const { pool } = require('../config/banco');

/**
 * Busca dados cadastrais e de gamificação do usuário
 * @param {number} userId 
 * @returns {Promise<Object>}
 */
async function obterUsuarioPorId(userId) {
  const [rows] = await pool.query(
    `SELECT u.*, g.nivel_atual, g.xp_total, g.ofensiva_dias
     FROM usuarios u
     LEFT JOIN gamificacao g ON g.usuario_id = u.id
     WHERE u.id = ?`,
    [userId]
  );
  if (rows.length === 0) return null;
  return rows[0];
}

/**
 * Busca a data da próxima prova oficial agendada
 * @returns {Promise<Object|null>}
 */
async function obterProximaProva() {
  const [rows] = await pool.query(
    `SELECT * FROM datas_oficiais_provas 
     WHERE data_prova > NOW() 
     ORDER BY data_prova ASC 
     LIMIT 1`
  );
  return rows.length > 0 ? rows[0] : null;
}

module.exports = {
  obterUsuarioPorId,
  obterProximaProva
};
