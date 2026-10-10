/**
 * Script de Migração e Seed do VestBot
 * Importa todas as 2.000+ questões, resoluções e progresso do Davi para o MySQL.
 * 
 * Executar via: node database/migrate-and-seed.cjs
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { dbConfig } = require('./db.cjs');

const ROOT_DIR = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT_DIR, 'questions');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

async function readJsonSafe(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.warn(`⚠️ Não foi possível ler JSON de ${path.basename(filePath)}:`, err.message);
    return defaultValue;
  }
}

async function getRootOrDirectConnection() {
  // Tentar conectar diretamente no banco vestbot_db
  try {
    const conn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true
    });
    return conn;
  } catch (err) {
    // Se falhar com vestbot, tentar root local
    console.warn(`⚠️ Conexão como '${dbConfig.user}' falhou (${err.message}). Tentando como 'root'...`);
    const rootConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: 'root',
      password: '',
      multipleStatements: true
    });
    return rootConn;
  }
}

async function runMigration() {
  console.log('🚀 ==========================================');
  console.log('🚀 INICIANDO MIGRAÇÃO DO VESTBOT PARA MYSQL');
  console.log('🚀 ==========================================');
  console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port} | Database: ${dbConfig.database}`);

  let conn;
  try {
    conn = await getRootOrDirectConnection();
    console.log('✅ Conexão inicial com o MySQL estabelecida!');

    // 1. Criar banco e conceder permissões caso necessário
    console.log(`📦 Criando banco de dados '${dbConfig.database}' se não existir...`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    
    // Se estiver conectado como root e o usuário for diferente, criar usuário vestbot
    if (dbConfig.user !== 'root') {
      try {
        await conn.query(`CREATE USER IF NOT EXISTS '${dbConfig.user}'@'%' IDENTIFIED BY '${dbConfig.password}';`);
        await conn.query(`GRANT ALL PRIVILEGES ON \`${dbConfig.database}\`.* TO '${dbConfig.user}'@'%';`);
        await conn.query(`FLUSH PRIVILEGES;`);
        console.log(`👤 Usuário de banco '${dbConfig.user}' configurado com sucesso!`);
      } catch (userErr) {
        // Pode falhar se não tiver privilégios de criar usuário; tudo bem se já existir
      }
    }

    await conn.query(`USE \`${dbConfig.database}\`;`);

    // 2. Executar schema.sql
    console.log('📄 Executando schema.sql para criar tabelas e relacionamentos...');
    const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf8');
    await conn.query(schemaSql);
    console.log('✅ Tabelas criadas com sucesso!');

    // 3. Importar Questões de Simulado
    const simuladoFile = path.join(QUESTIONS_DIR, 'Questões-Simulado.json');
    const simuladoQuestions = await readJsonSafe(simuladoFile, []);
    console.log(`\n📚 Importando ${simuladoQuestions.length} questões de simulado...`);

    let simuladoCount = 0;
    // Processar em lotes para alta performance
    const BATCH_SIZE = 100;
    for (let i = 0; i < simuladoQuestions.length; i += BATCH_SIZE) {
      const batch = simuladoQuestions.slice(i, i + BATCH_SIZE);
      for (const q of batch) {
        const qId = q.id !== undefined ? q.id : (i + 1);
        const correctIndex = Array.isArray(q.alternativas) 
          ? q.alternativas.findIndex(a => (a || '').trim().toLowerCase() === (q.correta || '').trim().toLowerCase())
          : 0;

        let imageUrl = q.imagem || null;
        if (!imageUrl && q.image_id) {
          imageUrl = q.image_id.includes('.') ? `/images/${q.image_id}` : `/images/${q.image_id}.png`;
        }

        await conn.query(`
          INSERT INTO questions (
            id, type, subject, difficulty, statement, correct_answer, 
            correct_index, base_explanation, image_url, support_text, group_id, theme
          ) VALUES (?, 'simulado', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            subject = VALUES(subject),
            difficulty = VALUES(difficulty),
            statement = VALUES(statement),
            correct_answer = VALUES(correct_answer),
            correct_index = VALUES(correct_index),
            base_explanation = VALUES(base_explanation),
            image_url = VALUES(image_url),
            support_text = VALUES(support_text),
            group_id = VALUES(group_id),
            theme = VALUES(theme);
        `, [
          qId,
          q.materia || 'Geral',
          q.dificuldade || 'Médio',
          q.enunciado || '',
          q.correta || '',
          correctIndex >= 0 ? correctIndex : 0,
          q.explicacao_base || null,
          imageUrl,
          q.texto_referencia || null,
          q.grupo_id || null,
          q.tema || null
        ]);

        // Inserir alternativas
        if (Array.isArray(q.alternativas)) {
          await conn.query('DELETE FROM question_options WHERE question_id = ?', [qId]);
          for (let optIdx = 0; optIdx < q.alternativas.length; optIdx++) {
            const optText = q.alternativas[optIdx];
            const isCorrect = (optIdx === correctIndex);
            await conn.query(`
              INSERT INTO question_options (question_id, option_index, option_text, is_correct)
              VALUES (?, ?, ?, ?)
            `, [qId, optIdx, optText, isCorrect]);
          }
        }
        simuladoCount++;
      }
      process.stdout.write(`  Progresso: ${simuladoCount}/${simuladoQuestions.length} questões processadas...\r`);
    }
    console.log(`\n✅ ${simuladoCount} questões de simulado importadas!`);

    // 4. Importar Questões de Interpretação
    const interFile = path.join(QUESTIONS_DIR, 'Questões-Interpretação.json');
    const interQuestions = await readJsonSafe(interFile, []);
    console.log(`\n📖 Importando ${interQuestions.length} questões de interpretação...`);

    let interCount = 0;
    for (const q of interQuestions) {
      const qId = q.id !== undefined ? q.id : (100000 + interCount);
      const correctIndex = Array.isArray(q.alternativas) 
        ? q.alternativas.findIndex(a => (a || '').trim().toLowerCase() === (q.correta || '').trim().toLowerCase())
        : 0;

      await conn.query(`
        INSERT INTO questions (
          id, type, subject, difficulty, statement, correct_answer, 
          correct_index, base_explanation, image_url, support_text, group_id, theme
        ) VALUES (?, 'interpretacao', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          subject = VALUES(subject),
          difficulty = VALUES(difficulty),
          statement = VALUES(statement),
          correct_answer = VALUES(correct_answer),
          correct_index = VALUES(correct_index),
          base_explanation = VALUES(base_explanation),
          image_url = VALUES(image_url),
          support_text = VALUES(support_text),
          group_id = VALUES(group_id),
          theme = VALUES(theme);
      `, [
        qId,
        q.materia || 'Língua Portuguesa',
        q.dificuldade || 'Média',
        q.enunciado || '',
        q.correta || '',
        correctIndex >= 0 ? correctIndex : 0,
        q.explicacao_base || null,
        q.imagem || null,
        q.texto_referencia || null,
        q.grupo_id || null,
        q.tema || null
      ]);

      if (Array.isArray(q.alternativas)) {
        await conn.query('DELETE FROM question_options WHERE question_id = ?', [qId]);
        for (let optIdx = 0; optIdx < q.alternativas.length; optIdx++) {
          const optText = q.alternativas[optIdx];
          const isCorrect = (optIdx === correctIndex);
          await conn.query(`
            INSERT INTO question_options (question_id, option_index, option_text, is_correct)
            VALUES (?, ?, ?, ?)
          `, [qId, optIdx, optText, isCorrect]);
        }
      }
      interCount++;
    }
    console.log(`✅ ${interCount} questões de interpretação importadas!`);

    // 5. Importar Resoluções (Simulado e Interpretação)
    const resSimuladoFile = path.join(QUESTIONS_DIR, 'Resolução-Simulados.json');
    const resSimulado = await readJsonSafe(resSimuladoFile, []);
    console.log(`\n💡 Importando ${resSimulado.length} resoluções passo-a-passo de simulados...`);

    let resCount = 0;
    for (const r of resSimulado) {
      if (!r.questionId) continue;
      // Inserir question_resolution
      await conn.query(`
        INSERT INTO question_resolutions (question_id, mode)
        VALUES (?, 'quiz')
        ON DUPLICATE KEY UPDATE mode = 'quiz';
      `, [r.questionId]);

      const [resRow] = await conn.query('SELECT id FROM question_resolutions WHERE question_id = ? AND mode = "quiz"', [r.questionId]);
      if (resRow && resRow.length > 0) {
        const resolutionId = resRow[0].id;
        await conn.query('DELETE FROM resolution_steps WHERE resolution_id = ?', [resolutionId]);

        if (Array.isArray(r.steps)) {
          for (let sIdx = 0; sIdx < r.steps.length; sIdx++) {
            const step = r.steps[sIdx];
            await conn.query(`
              INSERT INTO resolution_steps (resolution_id, step_number, title, content)
              VALUES (?, ?, ?, ?)
            `, [resolutionId, sIdx + 1, step.title || `Passo ${sIdx + 1}`, step.content || '']);
          }
        }
      }
      resCount++;
      if (resCount % 200 === 0) {
        process.stdout.write(`  Progresso: ${resCount}/${resSimulado.length} resoluções...\r`);
      }
    }
    console.log(`\n✅ ${resCount} resoluções de simulados importadas!`);

    // Resoluções de Interpretação
    const resInterFile = path.join(QUESTIONS_DIR, 'Resolução-Interpretação.json');
    const resInter = await readJsonSafe(resInterFile, []);
    console.log(`\n💡 Importando ${resInter.length} resoluções de interpretação...`);

    for (const r of resInter) {
      if (!r.questionId) continue;
      await conn.query(`
        INSERT INTO question_resolutions (question_id, mode)
        VALUES (?, 'interpretation')
        ON DUPLICATE KEY UPDATE mode = 'interpretation';
      `, [r.questionId]);

      const [resRow] = await conn.query('SELECT id FROM question_resolutions WHERE question_id = ? AND mode = "interpretation"', [r.questionId]);
      if (resRow && resRow.length > 0) {
        const resolutionId = resRow[0].id;
        await conn.query('DELETE FROM resolution_steps WHERE resolution_id = ?', [resolutionId]);
        if (Array.isArray(r.steps)) {
          for (let sIdx = 0; sIdx < r.steps.length; sIdx++) {
            const step = r.steps[sIdx];
            await conn.query(`
              INSERT INTO resolution_steps (resolution_id, step_number, title, content)
              VALUES (?, ?, ?, ?)
            `, [resolutionId, sIdx + 1, step.title || `Passo ${sIdx + 1}`, step.content || '']);
          }
        }
      }
    }
    console.log(`✅ Resoluções de interpretação importadas!`);

    // 6. Migrar dados do usuário Davi (se houver em data/)
    console.log('\n👤 Verificando dados existentes do usuário Davi para migração...');
    const profileData = await readJsonSafe(path.join(DATA_DIR, 'profile.json'), null);
    const historyData = await readJsonSafe(path.join(DATA_DIR, 'history.json'), []);
    const interHistoryData = await readJsonSafe(path.join(DATA_DIR, 'interpretation-history.json'), []);
    const resHistoryData = await readJsonSafe(path.join(DATA_DIR, 'resolutions-history.json'), []);
    const scheduleData = await readJsonSafe(path.join(DATA_DIR, 'schedule.json'), []);
    const gamificationData = await readJsonSafe(path.join(DATA_DIR, 'gamification.json'), null);
    const sessionsData = await readJsonSafe(path.join(DATA_DIR, 'sessions.json'), []);
    const frequencyData = await readJsonSafe(path.join(DATA_DIR, 'frequency.json'), { studyDays: [] });

    // Salvar Perfil
    const stats = profileData?.stats || {
      level: 1,
      xp: 0,
      currentStreak: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      essaysWritten: 0
    };

    await conn.query(`
      INSERT INTO user_profiles (
        user_id, level, xp, current_streak, questions_answered, correct_answers, essays_written, version
      ) VALUES (1, ?, ?, ?, ?, ?, ?, '4.0.0')
      ON DUPLICATE KEY UPDATE
        level = VALUES(level),
        xp = VALUES(xp),
        current_streak = VALUES(current_streak),
        questions_answered = VALUES(questions_answered),
        correct_answers = VALUES(correct_answers),
        essays_written = VALUES(essays_written);
    `, [
      stats.level || 1,
      stats.xp || 0,
      stats.currentStreak || 0,
      stats.questionsAnswered || 0,
      stats.correctAnswers || 0,
      stats.essaysWritten || 0
    ]);

    // Salvar Histórico de Questões
    if (Array.isArray(historyData) && historyData.length > 0) {
      console.log(`  Migrando ${historyData.length} registros de histórico de questões...`);
      for (const h of historyData) {
        if (!h.questionId) continue;
        await conn.query(`
          INSERT INTO user_question_history (user_id, question_id, was_correct, timestamp)
          VALUES (1, ?, ?, ?)
        `, [h.questionId, !!h.wasCorrect, h.timestamp || Date.now()]);
      }
    }

    // Salvar Histórico de Interpretação
    if (Array.isArray(interHistoryData) && interHistoryData.length > 0) {
      for (const h of interHistoryData) {
        if (!h.questionId) continue;
        await conn.query(`
          INSERT INTO user_interpretation_history (user_id, question_id, was_correct, timestamp)
          VALUES (1, ?, ?, ?)
        `, [h.questionId, !!h.wasCorrect, h.timestamp || Date.now()]);
      }
    }

    // Salvar Schedule
    if (Array.isArray(scheduleData) && scheduleData.length > 0) {
      for (const s of scheduleData) {
        if (!s.id) continue;
        await conn.query(`
          INSERT INTO user_schedule (id, user_id, day_of_week, subject, topic, duration)
          VALUES (?, 1, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            day_of_week = VALUES(day_of_week),
            subject = VALUES(subject),
            topic = VALUES(topic),
            duration = VALUES(duration);
        `, [s.id, s.day || '', s.subject || '', s.topic || '', s.duration || '']);
      }
    }

    // Salvar Gamificação
    if (gamificationData) {
      await conn.query(`
        INSERT INTO user_gamification (user_id, consecutive_correct, achievements_json, challenges_json, subject_stats_json)
        VALUES (1, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          consecutive_correct = VALUES(consecutive_correct),
          achievements_json = VALUES(achievements_json),
          challenges_json = VALUES(challenges_json),
          subject_stats_json = VALUES(subject_stats_json);
      `, [
        gamificationData.consecutiveCorrect || 0,
        JSON.stringify(gamificationData.achievements || []),
        JSON.stringify(gamificationData.challenges || []),
        JSON.stringify(gamificationData.subjectStats || [])
      ]);
    }

    // Salvar Frequency
    if (frequencyData?.studyDays && Array.isArray(frequencyData.studyDays)) {
      for (const day of frequencyData.studyDays) {
        await conn.query(`
          INSERT INTO user_study_days (user_id, study_date)
          VALUES (1, ?)
          ON DUPLICATE KEY UPDATE study_date = VALUES(study_date);
        `, [day]);
      }
    }

    console.log('\n🎉 ====================================================');
    console.log('🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO NO MYSQL!');
    console.log('🎉 ====================================================');
    console.log('Agora você pode abrir o MySQL Workbench:');
    console.log(`- Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`- Usuário: ${dbConfig.user}`);
    console.log(`- Database: ${dbConfig.database}`);
    console.log('Todas as tabelas e dados já estão disponíveis!');

  } catch (err) {
    console.error('\n❌ ERRO DURANTE A MIGRAÇÃO:', err);
    throw err;
  } finally {
    if (conn) await conn.end();
  }
}

if (require.main === module) {
  runMigration().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { runMigration };

