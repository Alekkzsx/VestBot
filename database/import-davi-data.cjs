/**
 * Script para importar dados reais do Davi diretamente para o MySQL.
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { dbConfig } = require('./db.cjs');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function importDavi() {
  console.log('🚀 Iniciando importação dos dados do Davi para o MySQL...');

  const conn = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
  });

  try {
    // 1. Garantir que usuário Davi existe (ID = 1)
    await conn.query(`
      INSERT INTO users (id, username, name)
      VALUES (1, 'davi', 'Davi')
      ON DUPLICATE KEY UPDATE name = 'Davi';
    `);

    // 2. Importar Perfil (profile.json)
    const profileFile = path.join(DATA_DIR, 'profile.json');
    if (fs.existsSync(profileFile)) {
      const p = JSON.parse(fs.readFileSync(profileFile, 'utf8'));
      const st = p.stats || {};
      await conn.query(`
        INSERT INTO user_profiles (
          user_id, level, xp, current_streak, questions_answered, correct_answers, essays_written, version
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          level = VALUES(level),
          xp = VALUES(xp),
          current_streak = VALUES(current_streak),
          questions_answered = VALUES(questions_answered),
          correct_answers = VALUES(correct_answers),
          essays_written = VALUES(essays_written),
          version = VALUES(version);
      `, [
        st.level || 11,
        st.xp || 10686,
        st.currentStreak || 4,
        st.questionsAnswered || 232,
        st.correctAnswers || 197,
        st.essaysWritten || 0,
        p.version || '4.0.0'
      ]);
      console.log(`✅ Perfil do Davi importado: Nível ${st.level || 11}, ${st.xp || 10686} XP, ${st.questionsAnswered || 232} questões respondidas!`);
    }

    // 3. Importar Histórico de Questões de Simulado (history.json)
    const historyFile = path.join(DATA_DIR, 'history.json');
    if (fs.existsSync(historyFile)) {
      const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      console.log(`📚 Importando ${history.length} registros de histórico de simulado...`);

      // Limpar antes para evitar duplicações
      await conn.query('DELETE FROM user_question_history WHERE user_id = 1;');

      // Inserir em lotes
      const batchSize = 100;
      for (let i = 0; i < history.length; i += batchSize) {
        const batch = history.slice(i, i + batchSize);
        for (const h of batch) {
          if (!h.questionId) continue;
          await conn.query(`
            INSERT INTO user_question_history (user_id, question_id, was_correct, timestamp)
            VALUES (1, ?, ?, ?)
          `, [h.questionId, !!h.wasCorrect, h.timestamp || Date.now()]);
        }
      }
      console.log(`✅ ${history.length} respostas de simulado inseridas no MySQL!`);
    }

    // 4. Importar Histórico de Interpretação (interpretation-history.json)
    const interFile = path.join(DATA_DIR, 'interpretation-history.json');
    if (fs.existsSync(interFile)) {
      const interHistory = JSON.parse(fs.readFileSync(interFile, 'utf8'));
      console.log(`📖 Importando ${interHistory.length} registros de interpretação...`);
      await conn.query('DELETE FROM user_interpretation_history WHERE user_id = 1;');

      for (const h of interHistory) {
        if (!h.questionId) continue;
        await conn.query(`
          INSERT INTO user_interpretation_history (user_id, question_id, was_correct, timestamp)
          VALUES (1, ?, ?, ?)
        `, [h.questionId, !!h.wasCorrect, h.timestamp || Date.now()]);
      }
      console.log(`✅ ${interHistory.length} respostas de interpretação inseridas!`);
    }

    // 5. Importar Histórico de Resoluções (resolutions-history.json)
    const resFile = path.join(DATA_DIR, 'resolutions-history.json');
    if (fs.existsSync(resFile)) {
      const resHistory = JSON.parse(fs.readFileSync(resFile, 'utf8'));
      console.log(`💡 Importando ${resHistory.length} resoluções visualizadas...`);
      await conn.query('DELETE FROM user_resolutions_history WHERE user_id = 1;');

      for (const r of resHistory) {
        if (!r.questionId) continue;
        await conn.query(`
          INSERT INTO user_resolutions_history (user_id, question_id, timestamp, viewed_at)
          VALUES (1, ?, ?, ?)
        `, [r.questionId, r.timestamp || Date.now(), r.viewedAt || r.timestamp || Date.now()]);
      }
      console.log(`✅ ${resHistory.length} resoluções visualizadas registradas!`);
    }

    // 6. Importar Frequência de Estudos (frequency.json)
    const freqFile = path.join(DATA_DIR, 'frequency.json');
    if (fs.existsSync(freqFile)) {
      const freq = JSON.parse(fs.readFileSync(freqFile, 'utf8'));
      const studyDays = freq.studyDays || [];
      console.log(`📅 Importando ${studyDays.length} dias de estudo (frequência)...`);
      await conn.query('DELETE FROM user_study_days WHERE user_id = 1;');

      for (const d of studyDays) {
        await conn.query(`
          INSERT INTO user_study_days (user_id, study_date)
          VALUES (1, ?)
          ON DUPLICATE KEY UPDATE study_date = VALUES(study_date);
        `, [d]);
      }
      console.log(`✅ ${studyDays.length} dias de frequência inseridos!`);
    }

    // 7. Importar Gamificação (gamification.json)
    const gamFile = path.join(DATA_DIR, 'gamification.json');
    if (fs.existsSync(gamFile)) {
      const g = JSON.parse(fs.readFileSync(gamFile, 'utf8'));
      await conn.query(`
        INSERT INTO user_gamification (user_id, consecutive_correct, achievements_json, challenges_json, subject_stats_json)
        VALUES (1, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          consecutive_correct = VALUES(consecutive_correct),
          achievements_json = VALUES(achievements_json),
          challenges_json = VALUES(challenges_json),
          subject_stats_json = VALUES(subject_stats_json);
      `, [
        g.consecutiveCorrect || 0,
        JSON.stringify(g.achievements || []),
        JSON.stringify(g.challenges || []),
        JSON.stringify(g.subjectStats || [])
      ]);
      console.log('✅ Dados de gamificação (conquistas, medalhas) importados!');
    }

    // 8. Importar Sessões de Atividade (sessions.json)
    const sessFile = path.join(DATA_DIR, 'sessions.json');
    if (fs.existsSync(sessFile)) {
      const sessions = JSON.parse(fs.readFileSync(sessFile, 'utf8'));
      console.log(`⏱️ Importando ${sessions.length} sessões de estudo...`);
      await conn.query('DELETE FROM user_sessions WHERE user_id = 1;');

      for (const s of sessions) {
        const sId = s.id || `sess_${s.timestamp}`;
        await conn.query(`
          INSERT INTO user_sessions (
            user_id, session_id, session_type, duration_seconds, xp_earned, questions_count, raw_payload, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          1,
          sId,
          s.type || 'Simulado',
          s.duration || 0,
          s.xp || s.bonusXP || 0,
          s.questionsCount || 0,
          JSON.stringify(s),
          s.timestamp || Date.now()
        ]);
      }
      console.log(`✅ ${sessions.length} sessões de estudo registradas!`);
    }

    // 9. Importar Cache de Calendário (calendar-cache.json)
    const calFile = path.join(DATA_DIR, 'calendar-cache.json');
    if (fs.existsSync(calFile)) {
      const cal = JSON.parse(fs.readFileSync(calFile, 'utf8'));
      if (cal.data && Array.isArray(cal.data)) {
        await conn.query('DELETE FROM exam_calendar_cache;');
        for (const item of cal.data) {
          await conn.query(`
            INSERT INTO exam_calendar_cache (institution, exam_date, modality, raw_data, last_updated)
            VALUES (?, ?, ?, ?, ?)
          `, [
            item.name || 'ETEC',
            item.date || 'Não definida',
            item.modality || 'Técnico',
            JSON.stringify(item),
            cal.lastUpdated || Date.now()
          ]);
        }
        console.log('✅ Cache do calendário de vestibulares importado!');
      }
    }

    console.log('\n🎉 =========================================================');
    console.log('🎉 TODOS OS DADOS DO DAVI FORAM IMPORTADOS COM SUCESSO NO MYSQL!');
    console.log('🎉 =========================================================');

  } catch (err) {
    console.error('❌ Erro ao importar dados do Davi:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

importDavi().then(() => process.exit(0)).catch(() => process.exit(1));

