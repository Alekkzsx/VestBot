const { pool } = require('../config/banco');

/**
 * Processa a sincronização em lote dos logs de questões enviados pelo cliente
 * @param {Array} logsQuestoes 
 * @returns {Promise<Object>} Resultado da inserção com quantidade inserida e duplicadas ignoradas
 */
async function processarSincronizacao(logsQuestoes) {
  if (!logsQuestoes || !Array.isArray(logsQuestoes) || logsQuestoes.length === 0) {
    throw new Error('Nenhum log para sincronizar.');
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let inseridos = 0;
    let duplicados = 0;

    for (const log of logsQuestoes) {
      try {
        const syncHash = log.sync_hash || `${log.questao_id}_${log.data_resolucao || Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await connection.query(
          `INSERT INTO desempenho_questoes 
           (usuario_id, questao_id, simulado_id, ordem_resolucao, alternativa_marcada, acertou, tempo_segundos, data_hora, sync_hash) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            log.usuario_id || 1, // Default: ID 1
            log.questao_id,
            log.simulado_id || null,
            log.ordem_resolucao || null,
            log.alternativa_marcada || null,
            log.acertou ? 1 : 0,
            log.tempo_gasto || log.tempo_segundos || 0,
            log.data_resolucao || log.data_hora || new Date().toISOString(),
            syncHash
          ]
        );
        inseridos++;
      } catch (insertErr) {
        if (insertErr.code === 'ER_DUP_ENTRY') {
          duplicados++;
        } else if (insertErr.code === 'ER_NO_REFERENCED_ROW_2') {
          console.warn(`[SYNC] Questão "${log.questao_id}" não encontrada no banco. Ignorada.`);
        } else {
          throw insertErr;
        }
      }
    }

    await connection.commit();

    return {
      status: 'ok',
      inseridos,
      duplicados,
      total_recebido: logsQuestoes.length
    };

  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  processarSincronizacao
};
