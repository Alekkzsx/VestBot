/**
 * Serviço de Banco de Dados para Usuário Davi
 * Responsável por carregar, atualizar e sincronizar dados com o MySQL.
 */
const db = require('./db.cjs');

/**
 * Carrega todos os dados do Davi do MySQL
 */
async function getFullUserData(username = 'davi') {
  // 1. Obter usuário
  const users = await db.query('SELECT id, username, name FROM users WHERE username = ?', [username]);
  if (!users.length) {
    // Garante criação do usuário
    await db.query('INSERT INTO users (username, name) VALUES (?, ?)', [username, username.toUpperCase()]);
  }
  const [user] = await db.query('SELECT id, username, name FROM users WHERE username = ?', [username]);
  const userId = user.id;

  // 2. Obter perfil
  const profiles = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
  let profile = profiles[0];
  if (!profile) {
    await db.query('INSERT INTO user_profiles (user_id) VALUES (?)', [userId]);
    const [created] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    profile = created;
  }

  // 3. Obter Histórico de Questões (Simulado)
  const questionHistory = await db.query(`
    SELECT question_id AS questionId, timestamp, was_correct AS wasCorrect
    FROM user_question_history
    WHERE user_id = ?
    ORDER BY timestamp ASC
  `, [userId]);

  // 4. Obter Histórico de Interpretação
  const interpretationHistory = await db.query(`
    SELECT question_id AS questionId, timestamp, was_correct AS wasCorrect
    FROM user_interpretation_history
    WHERE user_id = ?
    ORDER BY timestamp ASC
  `, [userId]);

  // 5. Obter Histórico de Resoluções
  const resolutionsHistory = await db.query(`
    SELECT question_id AS questionId, timestamp, viewed_at AS viewedAt
    FROM user_resolutions_history
    WHERE user_id = ?
    ORDER BY timestamp ASC
  `, [userId]);

  // 6. Obter Cronograma (Schedule)
  const scheduleRows = await db.query(`
    SELECT id, day_of_week AS day, subject, topic, duration
    FROM user_schedule
    WHERE user_id = ?
  `, [userId]);

  // 7. Obter Gamificação
  const gamificationRows = await db.query(`
    SELECT consecutive_correct, achievements_json, challenges_json, subject_stats_json
    FROM user_gamification
    WHERE user_id = ?
  `, [userId]);
  
  let gamification = {
    achievements: [],
    challenges: [],
    completedSessions: [],
    consecutiveCorrect: 0,
    subjectStats: []
  };

  if (gamificationRows.length > 0) {
    const row = gamificationRows[0];
    gamification = {
      consecutiveCorrect: row.consecutive_correct || 0,
      achievements: typeof row.achievements_json === 'string' ? JSON.parse(row.achievements_json) : (row.achievements_json || []),
      challenges: typeof row.challenges_json === 'string' ? JSON.parse(row.challenges_json) : (row.challenges_json || []),
      subjectStats: typeof row.subject_stats_json === 'string' ? JSON.parse(row.subject_stats_json) : (row.subject_stats_json || []),
      completedSessions: []
    };
  }

  // 8. Obter Histórico de Aulas (Lessons)
  const lessonsHistory = await db.query(`
    SELECT lesson_id AS lessonId, completed_at AS completedAt, watched_duration AS watchedDuration, is_completed AS isCompleted
    FROM user_lessons_history
    WHERE user_id = ?
  `, [userId]);

  // 9. Obter Sessões de Atividade
  const sessions = await db.query(`
    SELECT session_id AS id, session_type AS type, duration_seconds AS duration, xp_earned AS xp, questions_count AS questionsCount, timestamp, raw_payload
    FROM user_sessions
    WHERE user_id = ?
    ORDER BY timestamp ASC
  `, [userId]);

  const parsedSessions = sessions.map(s => {
    if (s.raw_payload) {
      try {
        const raw = typeof s.raw_payload === 'string' ? JSON.parse(s.raw_payload) : s.raw_payload;
        return { ...raw, id: s.id, timestamp: s.timestamp };
      } catch (e) {}
    }
    return {
      id: s.id,
      timestamp: s.timestamp,
      duration: s.duration,
      xp: s.xp,
      questionsCount: s.questionsCount,
      type: s.type
    };
  });

  // 10. Obter Frequência (Dias de Estudo)
  const studyDaysRows = await db.query(`
    SELECT study_date AS studyDate
    FROM user_study_days
    WHERE user_id = ?
    ORDER BY study_date ASC
  `, [userId]);

  const frequency = {
    studyDays: studyDaysRows.map(r => r.studyDate)
  };

  return {
    version: profile.version || '4.0.0',
    lastUpdated: profile.last_updated ? new Date(profile.last_updated).toISOString() : new Date().toISOString(),
    user: {
      stats: {
        level: profile.level || 1,
        xp: profile.xp || 0,
        currentStreak: profile.current_streak || 0,
        questionsAnswered: profile.questions_answered || 0,
        correctAnswers: profile.correct_answers || 0,
        essaysWritten: profile.essays_written || 0
      },
      questionHistory: questionHistory.map(q => ({ ...q, wasCorrect: !!q.wasCorrect })),
      interpretationHistory: interpretationHistory.map(q => ({ ...q, wasCorrect: !!q.wasCorrect })),
      resolutionsHistory,
      schedule: scheduleRows,
      gamification,
      lessonsHistory: lessonsHistory.map(l => ({ ...l, isCompleted: !!l.isCompleted })),
      sessions: parsedSessions,
      frequency
    }
  };
}

/**
 * Atualiza ou insere o perfil do usuário
 */
async function updateUserProfile(stats, username = 'davi') {
  const [user] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
  const userId = user ? user.id : 1;

  const st = stats.stats || stats;
  await db.query(`
    INSERT INTO user_profiles (
      user_id, level, xp, current_streak, questions_answered, correct_answers, essays_written, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON DUPLICATE KEY UPDATE
      level = VALUES(level),
      xp = VALUES(xp),
      current_streak = VALUES(current_streak),
      questions_answered = VALUES(questions_answered),
      correct_answers = VALUES(correct_answers),
      essays_written = VALUES(essays_written),
      last_updated = CURRENT_TIMESTAMP;
  `, [
    userId,
    st.level || 1,
    st.xp || 0,
    st.currentStreak || 0,
    st.questionsAnswered || 0,
    st.correctAnswers || 0,
    st.essaysWritten || 0
  ]);

  return { success: true, lastUpdated: new Date().toISOString() };
}

/**
 * Salva ou adiciona ao histórico de questões
 */
async function saveQuestionHistory(historyList, username = 'davi') {
  const [user] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
  const userId = user ? user.id : 1;

  if (!Array.isArray(historyList) || historyList.length === 0) return { success: true };

  await db.transaction(async (conn) => {
    for (const h of historyList) {
      if (!h.questionId) continue;
      // Verificar se já existe para evitar duplicata exata no mesmo timestamp
      const [exists] = await conn.query(
        'SELECT id FROM user_question_history WHERE user_id = ? AND question_id = ? AND timestamp = ?',
        [userId, h.questionId, h.timestamp]
      );
      if (!exists.length) {
        await conn.query(
          'INSERT INTO user_question_history (user_id, question_id, was_correct, timestamp) VALUES (?, ?, ?, ?)',
          [userId, h.questionId, !!h.wasCorrect, h.timestamp || Date.now()]
        );
      }
    }
  });

  return { success: true };
}

/**
 * Salva histórico de interpretação
 */
async function saveInterpretationHistory(historyList, username = 'davi') {
  const [user] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
  const userId = user ? user.id : 1;

  if (!Array.isArray(historyList) || historyList.length === 0) return { success: true };

  await db.transaction(async (conn) => {
    for (const h of historyList) {
      if (!h.questionId) continue;
      const [exists] = await conn.query(
        'SELECT id FROM user_interpretation_history WHERE user_id = ? AND question_id = ? AND timestamp = ?',
        [userId, h.questionId, h.timestamp]
      );
      if (!exists.length) {
        await conn.query(
          'INSERT INTO user_interpretation_history (user_id, question_id, was_correct, timestamp) VALUES (?, ?, ?, ?)',
          [userId, h.questionId, !!h.wasCorrect, h.timestamp || Date.now()]
        );
      }
    }
  });

  return { success: true };
}

/**
 * Salva sessões de atividade
 */
async function saveUserSessions(sessionsList, username = 'davi') {
  const [user] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
  const userId = user ? user.id : 1;

  if (!Array.isArray(sessionsList) || sessionsList.length === 0) return { success: true };

  await db.transaction(async (conn) => {
    for (const s of sessionsList) {
      const sId = s.id || `sess_${s.timestamp}`;
      const [exists] = await conn.query(
        'SELECT id FROM user_sessions WHERE user_id = ? AND session_id = ?',
        [userId, sId]
      );
      if (!exists.length) {
        await conn.query(`
          INSERT INTO user_sessions (
            user_id, session_id, session_type, duration_seconds, xp_earned, questions_count, raw_payload, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          userId,
          sId,
          s.type || 'Simulado',
          s.duration || 0,
          s.xp || s.bonusXP || 0,
          s.questionsCount || 0,
          JSON.stringify(s),
          s.timestamp || Date.now()
        ]);
      }
    }
  });

  return { success: true };
}

/**
 * SINCRONIZAÇÃO EM MASSA (Sync Bundle do computador do Davi)
 * Recebe tudo o que Davi fez offline e aplica no MySQL atomicamente.
 */
async function syncBundle(bundle, username = 'davi') {
  const [user] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
  const userId = user ? user.id : 1;

  await db.transaction(async (conn) => {
    // 1. Atualizar Perfil e Stats
    if (bundle.stats) {
      const st = bundle.stats.stats || bundle.stats;
      await conn.query(`
        INSERT INTO user_profiles (
          user_id, level, xp, current_streak, questions_answered, correct_answers, essays_written, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE
          level = GREATEST(level, VALUES(level)),
          xp = GREATEST(xp, VALUES(xp)),
          current_streak = VALUES(current_streak),
          questions_answered = GREATEST(questions_answered, VALUES(questions_answered)),
          correct_answers = GREATEST(correct_answers, VALUES(correct_answers)),
          essays_written = GREATEST(essays_written, VALUES(essays_written)),
          last_updated = CURRENT_TIMESTAMP;
      `, [
        userId,
        st.level || 1,
        st.xp || 0,
        st.currentStreak || 0,
        st.questionsAnswered || 0,
        st.correctAnswers || 0,
        st.essaysWritten || 0
      ]);
    }

    // 2. Mesclar histórico de simulados
    if (Array.isArray(bundle.questionHistory)) {
      for (const h of bundle.questionHistory) {
        if (!h.questionId) continue;
        const [exists] = await conn.query(
          'SELECT id FROM user_question_history WHERE user_id = ? AND question_id = ? AND timestamp = ?',
          [userId, h.questionId, h.timestamp]
        );
        if (!exists.length) {
          await conn.query(
            'INSERT INTO user_question_history (user_id, question_id, was_correct, timestamp) VALUES (?, ?, ?, ?)',
            [userId, h.questionId, !!h.wasCorrect, h.timestamp || Date.now()]
          );
        }
      }
    }

    // 3. Mesclar histórico de interpretação
    if (Array.isArray(bundle.interpretationHistory)) {
      for (const h of bundle.interpretationHistory) {
        if (!h.questionId) continue;
        const [exists] = await conn.query(
          'SELECT id FROM user_interpretation_history WHERE user_id = ? AND question_id = ? AND timestamp = ?',
          [userId, h.questionId, h.timestamp]
        );
        if (!exists.length) {
          await conn.query(
            'INSERT INTO user_interpretation_history (user_id, question_id, was_correct, timestamp) VALUES (?, ?, ?, ?)',
            [userId, h.questionId, !!h.wasCorrect, h.timestamp || Date.now()]
          );
        }
      }
    }

    // 4. Salvar Gamificação
    if (bundle.gamification) {
      const g = bundle.gamification;
      await conn.query(`
        INSERT INTO user_gamification (user_id, consecutive_correct, achievements_json, challenges_json, subject_stats_json)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          consecutive_correct = VALUES(consecutive_correct),
          achievements_json = VALUES(achievements_json),
          challenges_json = VALUES(challenges_json),
          subject_stats_json = VALUES(subject_stats_json);
      `, [
        userId,
        g.consecutiveCorrect || 0,
        JSON.stringify(g.achievements || []),
        JSON.stringify(g.challenges || []),
        JSON.stringify(g.subjectStats || [])
      ]);
    }

    // 5. Salvar Sessões
    if (Array.isArray(bundle.sessions)) {
      for (const s of bundle.sessions) {
        const sId = s.id || `sess_${s.timestamp}`;
        const [exists] = await conn.query(
          'SELECT id FROM user_sessions WHERE user_id = ? AND session_id = ?',
          [userId, sId]
        );
        if (!exists.length) {
          await conn.query(`
            INSERT INTO user_sessions (
              user_id, session_id, session_type, duration_seconds, xp_earned, questions_count, raw_payload, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            userId,
            sId,
            s.type || 'Simulado',
            s.duration || 0,
            s.xp || s.bonusXP || 0,
            s.questionsCount || 0,
            JSON.stringify(s),
            s.timestamp || Date.now()
          ]);
        }
      }
    }

    // 6. Salvar Dias de Frequência (Study Days)
    if (bundle.frequency?.studyDays && Array.isArray(bundle.frequency.studyDays)) {
      for (const d of bundle.frequency.studyDays) {
        await conn.query(`
          INSERT INTO user_study_days (user_id, study_date)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE study_date = VALUES(study_date);
        `, [userId, d]);
      }
    }
  });

  return { success: true, syncedAt: Date.now(), user: username };
}

module.exports = {
  getFullUserData,
  updateUserProfile,
  saveQuestionHistory,
  saveInterpretationHistory,
  saveUserSessions,
  syncBundle
};

