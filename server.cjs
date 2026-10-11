const express = require('express');
const cors = require('cors');
const fsSync = require('fs');
const path = require('path');
const { getGeminiKeys } = require('./secrets.cjs');
const db = require('./database/db.cjs');
const userService = require('./database/userService.cjs');
const questionService = require('./database/questionService.cjs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' })); // Safer limit for payload size

// --- DB EXAM CALENDAR CACHE HELPERS ---

async function getExamCalendarFromDb() {
  try {
    const rows = await db.query('SELECT raw_data, last_updated FROM exam_calendar_cache ORDER BY id DESC LIMIT 1');
    if (rows.length > 0) {
      const row = rows[0];
      const parsed = typeof row.raw_data === 'string' ? JSON.parse(row.raw_data) : row.raw_data;
      return { lastUpdated: row.last_updated, data: parsed };
    }
  } catch (e) {
    console.warn('DB exam calendar query warning:', e.message);
  }
  return null;
}

async function saveExamCalendarToDb(calendarData) {
  try {
    const now = Date.now();
    await db.query('DELETE FROM exam_calendar_cache');
    for (const item of calendarData) {
      await db.query(
        'INSERT INTO exam_calendar_cache (institution, exam_date, modality, raw_data, last_updated) VALUES (?, ?, ?, ?, ?)',
        [item.name || 'ETEC', item.date || '', item.modality || '', JSON.stringify(calendarData), now]
      );
    }
  } catch (e) {
    console.warn('DB save exam calendar warning:', e.message);
  }
}

// --- USER ENDPOINTS (PERSISTÊNCIA EXCLUSIVA NO BANCO MYSQL) ---

/**
 * GET /api/user/davi/full
 * Carrega todos os componentes de dados do Davi exclusivamente do MySQL
 */
app.get('/api/user/davi/full', async (req, res) => {
  try {
    const mysqlData = await userService.getFullUserData('davi');
    return res.json(mysqlData);
  } catch (error) {
    console.error('❌ Erro ao carregar dados do usuário do MySQL:', error);
    res.status(500).json({ error: 'Falha ao carregar dados do banco de dados MySQL: ' + error.message });
  }
});

/**
 * POST /api/user/davi/sync-bundle
 * SINCRONIZAÇÃO EM MASSA: Recebe todo o progresso do navegador do Davi e consolida no MySQL em transação atômica.
 */
app.post('/api/user/davi/sync-bundle', async (req, res) => {
  try {
    const bundle = req.body;
    await userService.syncBundle(bundle, 'davi');
    console.log('🔄 [Auto-Sync] Progresso do Davi sincronizado com sucesso no MySQL!');
    res.json({
      success: true,
      syncedAt: Date.now(),
      database: 'connected',
      user: 'davi'
    });
  } catch (error) {
    console.error('❌ Erro no Sync Bundle MySQL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/profile
 */
app.post('/api/user/davi/profile', async (req, res) => {
  try {
    const newStats = req.body;
    await userService.updateUserProfile(newStats, 'davi');
    res.json({ success: true, lastUpdated: new Date().toISOString() });
  } catch (error) {
    console.error('❌ Erro ao salvar perfil no MySQL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/history
 */
app.post('/api/user/davi/history', async (req, res) => {
  try {
    const newHistory = req.body;
    if (!Array.isArray(newHistory)) throw new Error('History must be an array');
    await userService.saveQuestionHistory(newHistory, 'davi');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erro ao salvar histórico no MySQL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/schedule
 */
app.post('/api/user/davi/schedule', async (req, res) => {
  try {
    const newSchedule = req.body;
    if (!Array.isArray(newSchedule)) throw new Error('Schedule must be an array');
    await userService.saveUserSchedule(newSchedule, 'davi');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erro ao salvar cronograma no MySQL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/interpretation
 */
app.post('/api/user/davi/interpretation', async (req, res) => {
  try {
    const newHistory = req.body;
    if (!Array.isArray(newHistory)) throw new Error('Data must be an array');
    await userService.saveInterpretationHistory(newHistory, 'davi');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erro ao salvar interpretação no MySQL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/resolutions
 */
app.post('/api/user/davi/resolutions', async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) throw new Error('Data must be an array');
    await userService.saveResolutionsHistory(data, 'davi');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erro ao salvar resoluções no MySQL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/lessons
 */
app.post('/api/user/davi/lessons', async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) throw new Error('Data must be an array');
    await userService.saveLessonsHistory(data, 'davi');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erro ao salvar videoaulas no MySQL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/gamification
 */
app.post('/api/user/davi/gamification', async (req, res) => {
  try {
    const data = req.body;
    await userService.saveGamification(data, 'davi');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erro ao salvar gamificação no MySQL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/sessions
 */
app.post('/api/user/davi/sessions', async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) throw new Error('Data must be an array');
    await userService.saveUserSessions(data, 'davi');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erro ao salvar sessões no MySQL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/davi/frequency
 */
app.post('/api/user/davi/frequency', async (req, res) => {
  try {
    const data = req.body;
    await userService.saveFrequency(data, 'davi');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erro ao salvar frequência no MySQL:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- ROTAS DE QUESTÕES E RESOLUÇÕES DO BANCO DE DADOS MYSQL ---

/**
 * GET /api/questions/simulado
 * Serve as questões de simulado diretamente do MySQL
 */
app.get('/api/questions/simulado', async (req, res) => {
  try {
    const questions = await questionService.getSimuladoQuestions();
    res.json(questions);
  } catch (err) {
    console.error('❌ Erro ao buscar questões de simulado do MySQL:', err);
    res.status(500).json({ error: 'Erro ao carregar questões do banco de dados MySQL: ' + err.message });
  }
});

/**
 * GET /api/questions/interpretacao
 * Serve as questões de interpretação diretamente do MySQL
 */
app.get('/api/questions/interpretacao', async (req, res) => {
  try {
    const questions = await questionService.getInterpretationQuestions();
    res.json(questions);
  } catch (err) {
    console.error('❌ Erro ao buscar questões de interpretação do MySQL:', err);
    res.status(500).json({ error: 'Erro ao carregar questões do banco de dados MySQL: ' + err.message });
  }
});

/**
 * GET /api/resolutions/:mode
 * Serve as resoluções passo a passo diretamente do MySQL (quiz | interpretation)
 */
app.get('/api/resolutions/:mode', async (req, res) => {
  const mode = req.params.mode === 'interpretation' ? 'interpretation' : 'quiz';
  try {
    const resolutions = await questionService.getResolutions(mode);
    res.json(resolutions);
  } catch (err) {
    console.error('❌ Erro ao buscar resoluções do MySQL:', err);
    res.status(500).json({ error: 'Erro ao carregar resoluções do banco de dados MySQL: ' + err.message });
  }
});

// --- VISUALIZADOR DO BANCO DE DADOS NO NAVEGADOR (/admin) ---

app.get(['/admin', '/admin/', '/adminPage.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'database', 'adminPage.html'));
});

app.get('/api/admin/tables', async (req, res) => {
  try {
    const tables = await db.query('SHOW TABLES;');
    const list = [];
    for (const row of tables) {
      const name = Object.values(row)[0];
      const countRes = await db.query(`SELECT COUNT(*) AS total FROM \`${name}\`;`);
      list.push({ name, count: countRes[0].total });
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/table/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '50', 10)));
  const offset = Math.max(0, parseInt(req.query.offset || '0', 10));
  try {
    const tables = await db.query('SHOW TABLES;');
    const validTables = tables.map(t => Object.values(t)[0]);
    if (!validTables.includes(tableName)) {
      return res.status(400).json({ error: 'Tabela não encontrada' });
    }
    const countRes = await db.query(`SELECT COUNT(*) AS total FROM \`${tableName}\`;`);
    const rows = await db.query(`SELECT * FROM \`${tableName}\` LIMIT ? OFFSET ?;`, [limit, offset]);
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    res.json({ total: countRes[0].total, columns, rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/query', async (req, res) => {
  const { query: sql } = req.body;
  if (!sql || typeof sql !== 'string') return res.status(400).json({ error: 'Query necessária' });
  try {
    const rows = await db.query(sql);
    res.json({ rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- AI & CALENDAR LOGIC ---

let currentKeyIndex = 0;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const GEMINI_FALLBACK_MODELS = Array.from(new Set([
  GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-1.5-flash'
]));

function readEnvFileKeys() {
  const envFiles = ['.env.local', '.env'];
  const keys = [];

  for (const file of envFiles) {
    const filePath = path.join(__dirname, file);
    if (!fsSync.existsSync(filePath)) continue;

    const content = fsSync.readFileSync(filePath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*(?:GEMINI_API_KEY|GOOGLE_API_KEY|API_KEY)\s*=\s*(.+?)\s*$/);
      if (!match) continue;

      const value = match[1].replace(/^['"]|['"]$/g, '').trim();
      if (value) keys.push(value);
    }
  }

  return keys;
}

function loadGeminiKeys() {
  return Array.from(new Set([
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY,
    process.env.API_KEY,
    ...readEnvFileKeys(),
    ...getGeminiKeys()
  ].filter(Boolean)));
}

const keys = loadGeminiKeys();

function extractGeminiText(result) {
  if (!result) return '';
  if (typeof result === 'string') return result;
  if (typeof result.output === 'string') return result.output;
  if (typeof result.output_text === 'string') return result.output_text;
  if (typeof result.text === 'string') return result.text;

  if (Array.isArray(result.output)) {
    return result.output.map(extractGeminiText).filter(Boolean).join('\n');
  }

  const candidateText = result.candidates?.[0]?.content?.parts
    ?.map(part => part.text || '')
    .filter(Boolean)
    .join('\n');

  return candidateText || '';
}

function extractJson(text, expected = 'object') {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty AI response');
  }

  const cleaned = text
    .replace(/```(?:json)?/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch { }

  const pattern = expected === 'array' ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
  const match = cleaned.match(pattern);
  if (!match) {
    throw new Error(`AI response did not contain a JSON ${expected}`);
  }

  return JSON.parse(match[0]);
}

function normalizeLessonVideo(video, fallbackSubject = 'Videoaula YouTube') {
  if (!video || !video.id) return null;
  return {
    id: String(video.id),
    title: String(video.title || 'Videoaula Recomendada'),
    duration: String(video.duration || '??:??'),
    subject: String(video.subject || fallbackSubject),
    thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
    isLocked: false
  };
}

/**
 * Call Gemini API with key/model fallback.
 */
async function callGemini(prompt, options = {}) {
  if (!keys.length) {
    throw new Error('No Gemini API key configured. Set GEMINI_API_KEY, GOOGLE_API_KEY, API_KEY, or .env.local API_KEY.');
  }

  const wantsJson = options.json !== false;
  let lastError;

  for (const model of GEMINI_FALLBACK_MODELS) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[currentKeyIndex];
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: wantsJson ? { response_mime_type: 'application/json' } : undefined
          })
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok) {
          const text = extractGeminiText(result);
          if (text) return text;
          throw new Error('Gemini generateContent returned an empty response');
        }

        lastError = new Error(result.error?.message || `Gemini generateContent HTTP ${response.status}`);
        console.warn(`⚠️ Gemini generateContent failed [model=${model}, key=${currentKeyIndex}]: ${lastError.message}`);

        if (response.status === 429 || response.status === 403) {
          currentKeyIndex = (currentKeyIndex + 1) % keys.length;
          continue;
        }
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Gemini generateContent request error [model=${model}, key=${currentKeyIndex}]: ${error.message}`);
      }

      currentKeyIndex = (currentKeyIndex + 1) % keys.length;
    }
  }

  throw lastError || new Error('Gemini API Error');
}

async function callGeminiJson(prompt, expected = 'object') {
  const text = await callGemini(prompt, { json: true });
  return extractJson(text, expected);
}

/**
 * GET /api/ai/exam-calendar
 * Fetches or calculates exam dates for ETEC and IFSP (2027/1)
 */
app.get('/api/ai/exam-calendar', async (req, res) => {
  try {
    // 1. Verificar se existe cache válido no banco MySQL (menor que 24 horas)
    const cached = await getExamCalendarFromDb();
    const forceRefresh = req.query.refresh === '1' || req.query.refresh === 'true';
    if (!forceRefresh && cached && cached.lastUpdated && cached.data) {
      const age = Date.now() - cached.lastUpdated;
      if (age < 24 * 60 * 60 * 1000) {
        console.log('📅 AI Calendar: Servindo do cache local MySQL de 24h');
        return res.json(cached.data);
      }
    }

    console.log('📅 AI Calendar: Cache expirado ou inexistente. Iniciando busca real no Google...');

    // 2. Realizar as pesquisas na web com múltiplas queries de fallback
    const etecQueries = [
      'etec vestibulinho data da prova 2026',
      'vestibulinho etec ensino medio data prova',
      'etec centro paula souza processo seletivo data',
    ];
    const ifspQueries = [
      'ifsp jundiai processo seletivo tecnico data 2026',
      'ifsp ensino medio tecnico data prova',
      'ifsp processo seletivo data prova',
    ];

    let etecSnippets = [];
    let ifspSnippets = [];

    for (const q of etecQueries) {
      if (etecSnippets.length > 0) break;
      for (let attempt = 1; attempt <= 2; attempt++) {
        etecSnippets = await getWebSearchResults(q);
        if (etecSnippets.length > 0) break;
        if (attempt < 2) await new Promise(r => setTimeout(r, 1500));
      }
    }

    for (const q of ifspQueries) {
      if (ifspSnippets.length > 0) break;
      for (let attempt = 1; attempt <= 2; attempt++) {
        ifspSnippets = await getWebSearchResults(q);
        if (ifspSnippets.length > 0) break;
        if (attempt < 2) await new Promise(r => setTimeout(r, 1500));
      }
    }

    // Se após todas as tentativas não achar nada
    if (etecSnippets.length === 0 && ifspSnippets.length === 0) {
      console.log('📅 AI Calendar: Nenhuma informação encontrada na web.');
      const calendarData = [
        { name: 'ETEC 2027/1', date: 'Nada até o momento', modality: 'Ensino Médio / Técnico' },
        { name: 'IFSP Jundiaí 2027/1', date: 'Nada até o momento', modality: 'Ensino Médio Técnico' }
      ];

      await saveExamCalendarToDb(calendarData);
      return res.json(calendarData);
    }

    const context = [
      ...etecSnippets.map(s => `[ETEC Search] ${s.title}: ${s.snippet}`),
      ...ifspSnippets.map(s => `[IFSP Search] ${s.title}: ${s.snippet}`)
    ].join('\n\n');

    // 3. Elaborar prompt para o Gemini
    const systemPrompt = `
      Você é um assistente especializado nos vestibulinhos ETEC e IFSP (Campus Jundiaí - Ensino Médio Técnico).
      Sua tarefa é retornar um JSON com a data oficial ou estimada da próxima prova para o 1º Semestre de 2027 (ingresso em 2027), baseando-se nos resultados de pesquisa do Google fornecidos abaixo.
      
      Resultados de Pesquisa Google:
      ${context}
      
      Instruções:
      1. Analise cuidadosamente as informações para encontrar a data da prova do Ensino Médio para ETEC e IFSP Jundiaí (geralmente ocorrem no final de 2026, entre novembro e dezembro de 2026).
      2. Se houver uma data oficial anunciada, use-a.
      3. Caso contrário, se houver uma estimativa ou período citado (como "dezembro de 2026"), projete a data provável (um domingo).
      4. Se após analisar as notícias você não encontrar nenhuma menção a datas ou se os resultados não trouxerem nenhuma informação válida para a prova de 2027/1, defina o campo "date" correspondente exatamente como a string "Nada até o momento".
      
      Retorne EXATAMENTE este formato JSON (sem formatação markdown como \`\`\`json):
      [
        { "name": "ETEC 2027/1", "date": "YYYY-MM-DD ou a string 'Nada até o momento'", "modality": "Ensino Médio / Técnico" },
        { "name": "IFSP Jundiaí 2027/1", "date": "YYYY-MM-DD ou a string 'Nada até o momento'", "modality": "Ensino Médio Técnico" }
      ]
    `;

    const calendarData = await callGeminiJson(systemPrompt, 'array');
    if (!Array.isArray(calendarData) || calendarData.length === 0) {
      throw new Error('AI calendar response must be a non-empty array');
    }

    // 4. Gravar cache no MySQL
    await saveExamCalendarToDb(calendarData);

    console.log('📅 AI Calendar: Busca concluída e salva no cache MySQL.');
    res.json(calendarData);
  } catch (error) {
    console.error('AI Calendar Error:', error);

    // Tentar ler cache mesmo que expirado em caso de erro
    try {
      const cached = await getExamCalendarFromDb();
      if (cached && cached.data) {
        console.log('📅 AI Calendar: Retornando cache expirado devido a falha na pesquisa/IA.');
        return res.json(cached.data);
      }
    } catch (e) { }

    // Fallback estático se nada mais funcionar
    console.log('📅 AI Calendar: Usando fallback estático.');
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

    const definitionData = await callGeminiJson(prompt, 'object');

    res.json({
      word: String(definitionData.word || word),
      definition: String(definitionData.definition || 'Não foi possível definir esta palavra no momento.').slice(0, 240)
    });
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

    const selectedIds = await callGeminiJson(prompt, 'array');

    const finalVideos = selectedIds
      .map(id => rawVideos.find(v => v.id === id))
      .filter(v => v !== undefined)
      .map(v => normalizeLessonVideo(v, subject || 'Videoaula YouTube'))
      .filter(Boolean)
      .slice(0, 3);

    res.json(finalVideos.length > 0 ? finalVideos : rawVideos.slice(0, 3).map(v => normalizeLessonVideo(v, subject || 'Videoaula YouTube')).filter(Boolean));
  } catch (error) {
    console.error('AI Search Video Error:', error);
    const rawVideos = await getYoutubeFallbackResults(query, 3);
    res.json(rawVideos.map(v => normalizeLessonVideo(v, subject || 'Videoaula YouTube')).filter(Boolean));
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
  if (domain.includes('vestibulinhoetec')) return 'Vestibulinho ETEC';
  if (domain.includes('etecregistro')) return 'ETEC Registro';
  if (domain.includes('cps.sp.gov')) return 'Centro Paula Souza';
  if (domain.includes('ifsp.edu')) return 'IFSP';
  if (domain.includes('gov.br')) return 'Governo Federal';

  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
  } catch (e) {
    return 'Web';
  }
}

/**
 * Busca no DuckDuckGo Lite (HTML limpo, estrutura estável).
 * Não requer API key e é mais confiável que scraping do Google.
 */
async function getWebSearchResults(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    console.log(`🔍 [DuckDuckGo] Searching: ${query}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    if (!response.ok) {
      console.error(`❌ [DuckDuckGo] HTTP ${response.status}`);
      return [];
    }

    const html = await response.text();
    const results = [];

    // DuckDuckGo HTML results structure: <div class="result"> blocks
    const resultBlocks = html.split('<div class="result ').slice(1);

    for (const block of resultBlocks) {
      const endIdx = block.indexOf('</div>');
      const resultHtml = endIdx !== -1 ? block.slice(0, endIdx) : block;

      const linkMatch = resultHtml.match(/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      if (!linkMatch) continue;

      let linkUrl = linkMatch[1];
      const linkTitle = linkMatch[2].replace(/<[^>]*>?/gm, '').trim();

      if (!linkUrl.startsWith('http')) continue;

      const snippetMatch = resultHtml.match(/<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i) ||
        resultHtml.match(/class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/?(?:a|div)/i);
      const snippet = snippetMatch
        ? snippetMatch[1].replace(/<[^>]*>?/gm, '').trim()
        : '';

      const source = getSourceInfo(linkUrl);
      const title = linkTitle.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      const cleanSnippet = snippet.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

      results.push({ url: linkUrl, title, snippet: cleanSnippet, source });
    }

    console.log(`✅ [DuckDuckGo] Found ${results.length} results for "${query}"`);
    return results.slice(0, 8);
  } catch (e) {
    console.error('❌ [DuckDuckGo] Error:', e.message);
    return [];
  }
}

/**
 * GET /api/health
 */
app.get('/api/health', async (req, res) => {
  const dbStatus = await db.testConnection();
  res.json({
    status: 'ok',
    mode: 'MySQL-First (VestBot V5)',
    user: 'Davi',
    database: dbStatus.ok ? 'connected' : 'disconnected',
    dbError: dbStatus.ok ? null : dbStatus.error
  });
});

// --- SERVE BUILD STATIC (FALLBACK SE ACESSAR DIRETO NA PORTA 3001) ---
const distPath = path.join(__dirname, 'dist');
if (fsSync.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/admin')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// --- SERVER START ---

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 VestBot Server (MySQL Dedicated V5) running on http://0.0.0.0:${PORT}`);
  console.log(`🐬 Banco de Dados: vestbot_db (MySQL / MariaDB)`);
  console.log(`👤 Usuário Ativo: Davi`);
  console.log(`🔍 Painel do Banco: http://localhost:${PORT}/admin`);
});
