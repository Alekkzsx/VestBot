const { obterMetricasPainel, obterDesafios } = require('../servicos/painelServico');

/**
 * Retorna as métricas agregadas do Dashboard para o usuário
 */
async function obterPainel(req, res) {
  try {
    const userId = parseInt(req.params.id, 10) || 1;
    const { periodo = '7d', disciplina = 'all' } = req.query;
    
    const dados = await obterMetricasPainel(userId, periodo, disciplina);
    res.json(dados);
  } catch (err) {
    console.error('[PAINEL CONTROLADOR] Erro:', err.message);
    res.status(500).json({ error: err.message });
  }
}

/**
 * Retorna o progresso das missões diárias, semanais e badges
 */
async function obterDesafiosUsuario(req, res) {
  try {
    const userId = parseInt(req.params.id, 10) || 1;
    const desafios = await obterDesafios(userId);
    res.json(desafios);
  } catch (err) {
    console.error('[DESAFIOS CONTROLADOR] Erro:', err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  obterPainel,
  obterDesafiosUsuario
};
