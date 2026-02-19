const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { getGeminiKeys } = require('./secrets.cjs');

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'data');

// File Paths - V4 Shared (Directly in data/)
const FILES = {
  PROFILE: path.join(DATA_DIR, 'profile.json'),
  HISTORY: path.join(DATA_DIR, 'history.json'),
  INTERPRETATION: path.join(DATA_DIR, 'interpretation-history.json'),
  RESOLUTIONS: path.join(DATA_DIR, 'resolutions-history.json'),
  SCHEDULE: path.join(DATA_DIR, 'schedule.json'),
  GAMIFICATION: path.join(DATA_DIR, 'gamification.json'),
  LESSONS: path.join(DATA_DIR, 'lessons-history.json'),
  LEGACY: path.join(DATA_DIR, 'data-user.txt')
};

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large history files

// --- HELPER WRAPPERS ---

/**
 * Ensures a directory exists
 */
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Atomic Write: Writes to temp file then renames to target
 * This prevents file corruption on power loss.
 */
async function atomicWrite(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  try {
    await ensureDir(path.dirname(filePath));
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2));
    await fs.rename(tempPath, filePath); // Atomic operation
    console.log(`💾 Saved: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error saving ${path.basename(filePath)}:`, error);
    try { await fs.unlink(tempPath); } catch { } // Cleanup temp
    throw error;
  }
}

/**
 * Reads a JSON file or returns default if missing
 */
async function readJson(filePath, defaultValue) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return defaultValue;
  }
}

// --- MIGRATION LOGIC ---

async function migrateLegacyData() {
  try {
    // Check if new structure already exists
    try {
      await fs.access(FILES.PROFILE);
      return; // Already migrated
    } catch { }

    console.log('📦 Checking for legacy data to migrate...');

    // Check if legacy file exists
    try {
      await fs.access(FILES.LEGACY);
    } catch {
      console.log('ℹ️ No legacy data found. Starting fresh.');
      return;
    }

    // Read Legacy
    const oldData = await readJson(FILES.LEGACY, null);
    if (!oldData || !oldData.user) return;

    console.log('🔄 Migrating legacy data to new structure...');

    // Split Data
    const profile = {
      version: '4.0.0',
      lastUpdated: new Date().toISOString(),
      stats: oldData.user.stats || {
        questionsAnswered: 0,
        correctAnswers: 0,
        currentStreak: 0,
        xp: 0,
        level: 1,
        essaysWritten: 0
      }
    };

    const history = oldData.user.questionHistory || [];
    const schedule = oldData.user.schedule || [];

    // Write New Files
    await ensureDir(DATA_DIR);
    await atomicWrite(FILES.PROFILE, profile);
    await atomicWrite(FILES.HISTORY, history);
    await atomicWrite(FILES.SCHEDULE, schedule);

    // Archive Legacy
    const archivePath = path.join(DATA_DIR, `data-user-migrated-${Date.now()}.txt`);
    await fs.rename(FILES.LEGACY, archivePath);

    console.log('✅ Migration Complete! User "Davi" is ready.');

  } catch (error) {
    console.error('❌ Migration Failed:', error);
  }
}

// --- ENDPOINTS ---

/**
 * GET /api/user/davi/full
 * Loads all data components and combines them for App Init
 */
app.get('/api/user/davi/full', async (req, res) => {
  try {
    await migrateLegacyData();

    const [profile, history, schedule, gamification, lessons] = await Promise.all([
      readJson(FILES.PROFILE, { stats: { level: 1, xp: 0, questionsAnswered: 0, correctAnswers: 0, currentStreak: 0, essaysWritten: 0 } }),
      readJson(FILES.HISTORY, []),
      readJson(FILES.SCHEDULE, []),
      readJson(FILES.GAMIFICATION, { achievements: [], challenges: [], completedSessions: [], consecutiveCorrect: 0, subjectStats: [] }),
      readJson(FILES.LESSONS, [])
    ]);

    // Reconstruct the "Unified" object for the frontend to consume initially
    const fullData = {
      version: profile.version || '4.0.0',
      lastUpdated: profile.lastUpdated || new Date().toISOString(),
      user: {
        stats: profile.stats,
        questionHistory: history,
        schedule: schedule,
        gamification: gamification,
        lessonsHistory: lessons
      }
    };

    res.json(fullData);
  } catch (error) {
    console.error('Error loading full data:', error);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

/**
 * POST /api/user/davi/profile
 * Updates Stats/XP/Level/Streak
 */
app.post('/api/user/davi/profile', async (req, res) => {
  try {
    const newStats = req.body; // Expects just the stats object or profile object

    // We strictly assume we receive the 'stats' object or a full profile wrapper
    // Let's normalize
    const dataToSave = {
      version: '4.0.0',
      lastUpdated: new Date().toISOString(),
      stats: newStats.stats || newStats // Handle both {stats: {...}} and {...}
    };

    await atomicWrite(FILES.PROFILE, dataToSave);
    res.json({ success: true, lastUpdated: dataToSave.lastUpdated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/history
 * Updates Question History
 */
app.post('/api/user/davi/history', async (req, res) => {
  try {
    const newHistory = req.body; // Expects Array
    if (!Array.isArray(newHistory)) throw new Error('History must be an array');

    await atomicWrite(FILES.HISTORY, newHistory);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/schedule
 * Updates Schedule
 */
app.post('/api/user/davi/schedule', async (req, res) => {
  try {
    const newSchedule = req.body; // Expects Array
    if (!Array.isArray(newSchedule)) throw new Error('Schedule must be an array');

    await atomicWrite(FILES.SCHEDULE, newSchedule);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/interpretation
 * Updates Interpretation History
 */
app.post('/api/user/davi/interpretation', async (req, res) => {
  try {
    const newHistory = req.body;
    if (!Array.isArray(newHistory)) throw new Error('Data must be an array');
    await atomicWrite(FILES.INTERPRETATION, newHistory);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/resolutions
 * Updates Resolutions History
 */
app.post('/api/user/davi/resolutions', async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) throw new Error('Data must be an array');
    await atomicWrite(FILES.RESOLUTIONS, data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/lessons
 * Updates Lessons History
 */
app.post('/api/user/davi/lessons', async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) throw new Error('Data must be an array');
    await atomicWrite(FILES.LESSONS, data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/gamification
 * Updates Gamification data (achievements, challenges, sessions)
 */
app.post('/api/user/davi/gamification', async (req, res) => {
  try {
    const data = req.body;
    await atomicWrite(FILES.GAMIFICATION, data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- AI & CALENDAR LOGIC ---

let currentKeyIndex = 0;
const keys = getGeminiKeys();

/**
 * Call Gemini API with Fallback
 */
async function callGemini(prompt) {
  const maxRetries = keys.length;

  for (let i = 0; i < maxRetries; i++) {
    const key = keys[currentKeyIndex];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      const result = await response.json();

      if (response.ok) {
        return result.candidates[0].content.parts[0].text;
      }

      console.warn(`⚠️ Key ${currentKeyIndex} failed: ${result.error?.message || 'Unknown error'}`);

      // If quota issue (429), move to next key
      if (response.status === 429 || response.status === 403) {
        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
        continue;
      }

      throw new Error(result.error?.message || 'Gemini API Error');
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      currentKeyIndex = (currentKeyIndex + 1) % keys.length;
    }
  }
}

/**
 * GET /api/ai/exam-calendar
 * Fetches or calculates exam dates for ETEC and IFSP (2027/1)
 */
app.get('/api/ai/exam-calendar', async (req, res) => {
  try {
    const systemPrompt = `
      Você é um assistente especializado nos vestibulinhos ETEC e IFSP (Campus Jundiaí - Ensino Médio Técnico).
      Sua tarefa é retornar um JSON com a data estimada ou oficial da próxima prova para o 1º Semestre de 2027.
      
      Contexto Atual: Hoje é 13 de Fevereiro de 2026.
      
      Datas de referência baseadas em anos anteriores para 2027/1:
      - ETEC: Geralmente ocorre no início de Dezembro de 2026.
      - IFSP Jundiaí (Médio Técnico): Geralmente ocorre em Dezembro de 2026.
      
      Retorne EXATAMENTE este formato JSON:
      [
        { "name": "ETEC 2027/1", "date": "YYYY-MM-DD", "modality": "Ensino Médio / Técnico" },
        { "name": "IFSP Jundiaí 2027/1", "date": "YYYY-MM-DD", "modality": "Ensino Médio Técnico" }
      ]
      
      Se não houver data oficial, use sua lógica de IA para projetar a data mais provável baseada nos domínios históricos (domingo).
    `;

    const aiResponse = await callGemini(systemPrompt);
    const calendarData = JSON.parse(aiResponse);

    res.json(calendarData);
  } catch (error) {
    console.error('AI Calendar Error:', error);
    // Fallback static data if AI fails
    res.json([
      { name: 'ETEC 2027/1', date: '2026-12-06', modality: 'Ensino Médio / Técnico' },
      { name: 'IFSP Jundiaí 2027/1', date: '2026-12-13', modality: 'Ensino Médio Técnico' }
    ]);
  }
});

/**
 * GET /api/ai/dictionary
 * Fetches a short definition for a word using Gemini AI
 */
app.get('/api/ai/dictionary', async (req, res) => {
  const { word, context } = req.query;

  if (!word) {
    return res.status(400).json({ error: 'Word is required' });
  }

  try {
    const prompt = `
      Você é um dicionário acadêmico para estudantes prestes a prestar o vestibulinho ETEC ou IFSP.
      Defina a palavra ou termo: "${word}"
      ${context ? `Contexto da frase: "${context}"` : ''}
      
      Regras:
      1. Resposta curta e direta (máximo 150 caracteres).
      2. Linguagem simples mas formal.
      3. Retorne EXATAMENTE este formato JSON:
      { "word": "${word}", "definition": "SUA_DEFINICAO_AQUI" }
    `;

    const aiResponse = await callGemini(prompt);
    const definitionData = JSON.parse(aiResponse);

    res.json(definitionData);
  } catch (error) {
    console.error('AI Dictionary Error:', error);
    res.json({ word, definition: "Não foi possível definir esta palavra no momento." });
  }
});

async function getYoutubeFallbackResults(query, limit = 10) {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' aula')}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    const html = await response.text();

    // More robust regex for ytInitialData
    const match = html.match(/var ytInitialData = (\{.*?\});/);
    if (!match) {
      console.warn('❌ YT Scraper: Could not find ytInitialData');
      return [];
    }

    const data = JSON.parse(match[1]);
    const results = [];

    // Improved path traversal for YouTube results
    const sectionList = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
    if (!sectionList) return [];

    const itemSection = sectionList.find(c => c.itemSectionRenderer);
    const contents = itemSection?.itemSectionRenderer?.contents;

    if (!contents) return [];

    for (const item of contents) {
      if (item.videoRenderer && results.length < limit) {
        const video = item.videoRenderer;
        const videoId = video.videoId;

        // Use hqdefault for better quality or mqdefault
        results.push({
          id: videoId,
          title: video.title.runs[0].text,
          duration: video.lengthText?.simpleText || '??:??',
          subject: 'Videoaula YouTube',
          thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
        });
      }
    }
    console.log(`✅ YT Scraper: Found ${results.length} videos`);
    return results;
  } catch (e) {
    console.error('❌ YT Fallback Error:', e);
    return [];
  }
}

/**
 * POST /api/ai/search-videos
 * Strategy: Software Searches (Scraper) -> AI Verifies/Filters
 */
app.post('/api/ai/search-videos', async (req, res) => {
  const { query, subject } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    console.log(`🔍 Video Search: ${query}`);
    const rawVideos = await getYoutubeFallbackResults(query, 10);

    if (rawVideos.length === 0) {
      return res.json([]);
    }

    // AI selects the best 3, but we ensure the metadata is preserved
    const prompt = `
      Você é um curador acadêmico. Analise esta lista de vídeos do YouTube sobre "${query}".
      Selecione os 3 melhores vídeos educativos (ETEC/IFSP).
      Retorne APENAS um JSON array com os IDs: ["ID1", "ID2", "ID3"]
      
      Lista:
      ${JSON.stringify(rawVideos.map(v => ({ id: v.id, title: v.title })))}
    `;

    const aiResponse = await callGemini(prompt);
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    const selectedIds = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);

    const finalVideos = selectedIds
      .map(id => rawVideos.find(v => v.id === id))
      .filter(v => v !== undefined)
      .slice(0, 3);

    res.json(finalVideos.length > 0 ? finalVideos : rawVideos.slice(0, 3));
  } catch (error) {
    console.error('AI Search Video Error:', error);
    const rawVideos = await getYoutubeFallbackResults(query, 3);
    res.json(rawVideos);
  }
});

/**
 * POST /api/yt/get-videos-info
 * Fetches metadata for a list of YouTube IDs
 */
app.post('/api/yt/get-videos-info', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'IDs must be an array' });

  try {
    const results = ids.map(id => ({
      id: id,
      title: 'Videoaula Recomendada',
      duration: '??:??',
      subject: 'Recomendação',
      thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video info' });
  }
});

/**
 * POST /api/yt/fallback-search
 */
app.post('/api/yt/fallback-search', async (req, res) => {
  const { query } = req.body;
  const results = await getYoutubeFallbackResults(query);
  res.json(results);
});

/**
 * Helper: Programmatic Web Search (DuckDuckGo Scraper)
 * Prioritizes educational sources
 */
/**
 * Helper to identify educational sites and their display names
 */
function getSourceInfo(url) {
  const domain = url.toLowerCase();
  if (domain.includes('brasilescola')) return 'Brasil Escola';
  if (domain.includes('mundoeducacao')) return 'Mundo Educação';
  if (domain.includes('todamateria')) return 'Toda Matéria';
  if (domain.includes('khanacademy')) return 'Khan Academy';
  if (domain.includes('g1.globo.com/educacao')) return 'G1 Educação';
  if (domain.includes('preparaenem')) return 'Prepara Enem';
  if (domain.includes('sobiologia')) return 'Só Biologia';
  if (domain.includes('sohistoria')) return 'Só História';
  if (domain.includes('somatematica')) return 'Só Matemática';
  if (domain.includes('descomplica')) return 'Descomplica';
  if (domain.includes('manualdomundo')) return 'Manual do Mundo';
  if (domain.includes('wikipedia')) return 'Wikipedia';
  if (domain.includes('guiadoestudante')) return 'Guia do Estudante';

  // Generic fallback: extract domain name
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
  } catch (e) {
    return 'Web';
  }
}

/**
 * Searches for high-quality educational snippets
 * Prioritizes educational sources
 */
async function getWebSearchSnippets(query) {
  try {
    // 1. Attempt a more direct query first
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' resumo resumo')}`;
    console.log(`🔍 [Scraper] Target: ${searchUrl}`);

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    if (!response.ok) {
      console.error(`❌ [Scraper] DDG return status ${response.status}`);
      return [];
    }

    const html = await response.text();
    const results = [];

    // Improved block detection
    const resultBlocks = html.split('class="result__body"').slice(1, 15);
    console.log(`📦 [Scraper] Found ${resultBlocks.length} blocks`);

    for (const block of resultBlocks) {
      // More flexible regex for DuckDuckGo HTML
      const titleMatch = block.match(/class="result__title">[\s\S]*?href="(.*?)"[\s\S]*?>(.*?)<\/a>/i);
      const snippetMatch = block.match(/class="result__snippet">([\s\S]*?)<\/a>/i);

      if (titleMatch && snippetMatch) {
        let url = titleMatch[1];
        if (url.includes('uddg=')) {
          url = decodeURIComponent(url.split('uddg=')[1].split('&')[0]);
        }

        const title = titleMatch[2].replace(/<[^>]*>?/gm, '').trim();
        const snippet = snippetMatch[1].replace(/<[^>]*>?/gm, '').trim();
        const source = getSourceInfo(url);

        results.push({ url, title, snippet, source });
      }
    }

    console.log(`✅ [Scraper] Processed ${results.length} valid results`);
    return results;
  } catch (e) {
    console.error('❌ [Scraper] Fatal Error:', e);
    return [];
  }
}

/**
 * POST /api/ai/search-web-summary
 */
app.post('/api/ai/search-web-summary', async (req, res) => {
  const { query, subject } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    console.log(`\n--- 🌐 NEW RESEARCH REQUEST ---`);
    console.log(`Input: "${query}" | Subject: "${subject}"`);

    // AI Refinement
    const refinementPrompt = `
      Extract ONLY the primary academic topic for a Google search from this video title: "${query}".
      Relevant subject: "${subject || 'General'}".
      Remove "Lesson X", channel names, or filler.
      Example: "Class 01 - Bio - Cells" -> "Cell Biology Animal and Plant Cell Summary"
      IMPORTANT: Return ONLY the search terms, NO extra text.
    `;

    let refinedQuery = await callGemini(refinementPrompt);
    refinedQuery = refinedQuery.replace(/["'“”]/g, '').trim(); // Remove any extra quotes
    console.log(`✨ AI Refined: "${refinedQuery}"`);

    const snippets = await getWebSearchSnippets(refinedQuery);

    if (snippets.length === 0) {
      console.warn(`⚠️ No snippets found for: "${refinedQuery}"`);
      return res.json({
        type: 'error',
        message: 'A pesquisa não retornou resultados acadêmicos. Tente novamente em instantes.'
      });
    }

    res.json({
      type: 'web_results',
      results: snippets,
      query: refinedQuery
    });
  } catch (error) {
    console.error('💥 Backend Route Error:', error);
    res.status(500).json({ error: 'Failed to search web' });
  }
});

/**
 * POST /api/ai/lesson-summary
 * Gera um resumo didático consolidado sobre o tema da aula
 * baseado em scraping web + síntese pelo Gemini
 */
app.post('/api/ai/lesson-summary', async (req, res) => {
  const { lessonTitle, subject } = req.body;
  if (!lessonTitle) return res.status(400).json({ error: 'lessonTitle is required' });

  try {
    console.log(`\n--- 📖 LESSON SUMMARY REQUEST ---`);
    console.log(`Aula: "${lessonTitle}" | Disciplina: "${subject}"`);

    // 1. Refinar a query para busca educacional
    const refinementPrompt = `
      A partir do título da videoaula "${lessonTitle}" da disciplina "${subject || 'Geral'}",
      extraia apenas os termos de busca para encontrar um resumo acadêmico sobre o tema.
      Remova "Aula X", nome de canal, ou texto de relleno.
      Exemplo: "Aula 01 - Bio - Células" -> "Organelas Célula Animal Vegetal resumo"
      IMPORTANTE: Retorne APENAS os termos de busca, sem nenhum texto extra.
    `;

    let refinedQuery = await callGemini(refinementPrompt);
    refinedQuery = refinedQuery.replace(/["""]/g, '').trim();
    console.log(`✨ Query refinada: "${refinedQuery}"`);

    // 2. Buscar snippets educacionais
    const snippets = await getWebSearchSnippets(refinedQuery + ' resumo ETEC');
    console.log(`📦 Snippets encontrados: ${snippets.length}`);

    // 3. Síntese pelo Gemini: gerar resumo didático estruturado
    const context = snippets.length > 0
      ? snippets.slice(0, 5).map(s => `${s.title}: ${s.snippet}`).join('\n\n')
      : `Tema: ${lessonTitle} — Disciplina: ${subject}`;

    const summaryPrompt = `
      Você é um professor experiente do Ensino Fundamental 2, preparando um aluno para o vestibulinho da ETEC.
      
      Com base no contexto abaixo sobre o tema "${lessonTitle}" (${subject}), escreva um resumo didático COMPLETO e ESTRUTURADO.
      
      Contexto de pesquisa:
      ${context}
      
      O resumo DEVE conter:
      1. Uma introdução clara do conceito (2-3 frases)
      2. Os pontos MAIS importantes sobre o tema (entre 4 e 6 pontos de bala)
      3. Uma frase final resumindo o que o aluno deve memorizar para a prova
      
      Requisitos:
      - Linguagem clara, acessível para estudantes do 9º ano
      - Exemplos concretos quando possível
      - Foco no que cai no vestibulinho ETEC
      - Retorne APENAS o JSON abaixo, sem qualquer texto antes ou depois:

      {
        "intro": "Texto introdutório...",
        "keyPoints": [
          "Ponto 1...",
          "Ponto 2...",
          "Ponto 3...",
          "Ponto 4..."
        ],
        "memorizeTip": "Para a prova, lembre-se que..."
      }
    `;

    const aiResponse = await callGemini(summaryPrompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('AI response was not valid JSON');
    }

    const summary = JSON.parse(jsonMatch[0]);

    // 4. Montar fontes (até 3)
    const sources = snippets.slice(0, 3).map(s => ({
      title: s.title,
      url: s.url,
      source: s.source
    }));

    console.log(`✅ Resumo gerado com ${summary.keyPoints?.length} pontos-chave`);

    res.json({
      type: 'lesson_summary',
      query: refinedQuery,
      intro: summary.intro,
      keyPoints: summary.keyPoints || [],
      memorizeTip: summary.memorizeTip,
      sources
    });

  } catch (error) {
    console.error('💥 Lesson Summary Error:', error);
    res.status(500).json({
      type: 'error',
      message: 'Não foi possível gerar o resumo. Tente novamente.'
    });
  }
});



/**
 * POST /api/ai/generic-call
 * Generic link for AI tasks (recommendations, summaries, etc)
 */
app.post('/api/ai/generic-call', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const aiResponse = await callGemini(prompt);
    res.json({ result: aiResponse });
  } catch (error) {
    console.error('AI Generic Call Error:', error);
    res.status(500).json({ error: 'AI Failure' });
  }
});

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'Split-File V4', user: 'Davi' });
});

/**
 * POST /api/ai/scrape-exercises
 * Scrapes educational exercises from the web and formats them via AI
 */
app.post('/api/ai/scrape-exercises', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    console.log(`📝 Searching exercises for: ${query}`);

    // Search for exercises on priority sites
    const searchResults = await getWebSearchSnippets(`${query} exercícios com gabarito`);

    if (searchResults.length === 0) {
      return res.json({ type: 'error', message: 'Nenhum exercício encontrado para este tema.' });
    }

    // Use the content of the top result to extract questions via AI
    const context = searchResults.slice(0, 3).map(r => `${r.title}: ${r.snippet}`).join('\n\n');

    const prompt = `
      Você é um professor acadêmico. Com base neste contexto de pesquisa sobre "${query}", extraia ou crie 5 exercícios de múltipla escolha de nível ETEC/IFSP.
      
      Contexto:
      ${context}
      
      Retorne APENAS um JSON array no seguinte formato exato (sem markdown):
      [
        {
          "question": "Pergunta do exercício...",
          "options": ["Opção A", "Opção B", "Opção C", "Opção D", "Opção E"],
          "answer": 0,
          "explanation": "Explicação pedagógica rápida."
        }
      ]
    `;

    const aiResponse = await callGemini(prompt);
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    const exercises = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);

    res.json({
      type: 'exercises',
      results: exercises,
      source: searchResults[0].source
    });
  } catch (error) {
    console.error('Scrape Exercises Error:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// --- SERVER START ---

app.listen(PORT, () => {
  console.log(`🚀 VestBot Server (V4 Clean-Data) running on port ${PORT}`);
  console.log(`📂 Data Directory: ${DATA_DIR}`);
});
