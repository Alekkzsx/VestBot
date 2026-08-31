/**
 * Helper para inferência de disciplina a partir do identificador da questão
 * @param {string} questaoId 
 * @returns {string} Nome da disciplina
 */
function inferirDisciplina(questaoId) {
  if (!questaoId) return 'Geral';
  const q = questaoId.toUpperCase();
  if (q.includes('PORT') || q.includes('LING')) return 'Português';
  if (q.includes('MAT') || q.includes('GEOM')) return 'Matemática';
  if (q.includes('BIO') || q.includes('ECO')) return 'Biologia';
  if (q.includes('FIS') || q.includes('OND')) return 'Física';
  if (q.includes('QUI') || q.includes('REA')) return 'Química';
  if (q.includes('HIST') || q.includes('VARGAS')) return 'História';
  if (q.includes('GEO') || q.includes('BIOMA')) return 'Geografia';
  return 'Geral';
}

const DISCIPLINAS_OFICIAIS = [
  'Português',
  'Matemática',
  'Biologia',
  'Física',
  'Química',
  'História',
  'Geografia'
];

module.exports = {
  inferirDisciplina,
  DISCIPLINAS_OFICIAIS
};
