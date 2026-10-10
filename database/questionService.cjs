/**
 * Serviço de Banco de Dados para Questões e Resoluções
 * Carrega diretamente do MySQL com suporte a agrupamento e opções.
 */
const db = require('./db.cjs');

/**
 * Retorna todas as questões de simulado do MySQL
 */
async function getSimuladoQuestions() {
  const rows = await db.query(`
    SELECT 
      q.id,
      q.subject AS materia,
      q.difficulty AS dificuldade,
      q.statement AS enunciado,
      q.correct_answer AS correta,
      q.correct_index AS correctIndex,
      q.base_explanation AS explicacao_base,
      q.image_url AS imagem,
      q.support_text AS texto_referencia,
      q.group_id AS grupo_id,
      q.theme AS tema
    FROM questions q
    WHERE q.type = 'simulado'
    ORDER BY q.id ASC
  `);

  if (!rows.length) return [];

  // Buscar todas as alternativas vinculadas de uma só vez
  const options = await db.query(`
    SELECT o.question_id, o.option_index, o.option_text
    FROM question_options o
    JOIN questions q ON o.question_id = q.id
    WHERE q.type = 'simulado'
    ORDER BY o.question_id ASC, o.option_index ASC
  `);

  const optionsMap = new Map();
  for (const opt of options) {
    if (!optionsMap.has(opt.question_id)) {
      optionsMap.set(opt.question_id, []);
    }
    optionsMap.get(opt.question_id).push(opt.option_text);
  }

  return rows.map(q => ({
    ...q,
    alternativas: optionsMap.get(q.id) || []
  }));
}

/**
 * Retorna todas as questões de interpretação do MySQL
 */
async function getInterpretationQuestions() {
  const rows = await db.query(`
    SELECT 
      q.id,
      q.group_id AS grupo_id,
      q.theme AS tema,
      q.subject AS materia,
      q.difficulty AS dificuldade,
      q.statement AS enunciado,
      q.correct_answer AS correta,
      q.base_explanation AS explicacao_base,
      q.image_url AS imagem,
      q.support_text AS texto_referencia
    FROM questions q
    WHERE q.type = 'interpretacao'
    ORDER BY q.group_id ASC, q.id ASC
  `);

  if (!rows.length) return [];

  const options = await db.query(`
    SELECT o.question_id, o.option_index, o.option_text
    FROM question_options o
    JOIN questions q ON o.question_id = q.id
    WHERE q.type = 'interpretacao'
    ORDER BY o.question_id ASC, o.option_index ASC
  `);

  const optionsMap = new Map();
  for (const opt of options) {
    if (!optionsMap.has(opt.question_id)) {
      optionsMap.set(opt.question_id, []);
    }
    optionsMap.get(opt.question_id).push(opt.option_text);
  }

  return rows.map(q => ({
    ...q,
    alternativas: optionsMap.get(q.id) || []
  }));
}

/**
 * Retorna as resoluções passo a passo do MySQL
 * @param {'quiz' | 'interpretation'} mode 
 */
async function getResolutions(mode = 'quiz') {
  const resolutions = await db.query(`
    SELECT r.id AS resolutionId, r.question_id AS questionId
    FROM question_resolutions r
    WHERE r.mode = ?
    ORDER BY r.question_id ASC
  `, [mode]);

  if (!resolutions.length) return [];

  const steps = await db.query(`
    SELECT s.resolution_id, s.step_number, s.title, s.content
    FROM resolution_steps s
    JOIN question_resolutions r ON s.resolution_id = r.id
    WHERE r.mode = ?
    ORDER BY s.resolution_id ASC, s.step_number ASC
  `, [mode]);

  const stepsMap = new Map();
  for (const step of steps) {
    if (!stepsMap.has(step.resolution_id)) {
      stepsMap.set(step.resolution_id, []);
    }
    stepsMap.get(step.resolution_id).push({
      title: step.title,
      content: step.content
    });
  }

  return resolutions.map(r => ({
    questionId: r.questionId,
    steps: stepsMap.get(r.resolutionId) || []
  }));
}

module.exports = {
  getSimuladoQuestions,
  getInterpretationQuestions,
  getResolutions
};

