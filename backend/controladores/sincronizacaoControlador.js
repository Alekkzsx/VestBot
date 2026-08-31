const { processarSincronizacao } = require('../servicos/sincronizacaoServico');

/**
 * Endpoint de Ping para verificação de conectividade
 */
function ping(req, res) {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
}

/**
 * Endpoint para sincronização em lote (Modo Acampamento / Offline-First)
 */
async function sincronizar(req, res) {
  try {
    const { logs_questoes } = req.body;
    const resultado = await processarSincronizacao(logs_questoes);
    res.json(resultado);
  } catch (error) {
    console.error('[SYNC CONTROLADOR] Erro:', error.message);
    if (error.message === 'Nenhum log para sincronizar.') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro interno na sincronização.' });
  }
}

module.exports = {
  ping,
  sincronizar
};
