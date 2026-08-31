const { obterUsuarioPorId, obterProximaProva } = require('../servicos/usuarioServico');

/**
 * Retorna os dados do usuário e de gamificação
 */
async function obterUsuario(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const usuario = await obterUsuarioPorId(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Retorna a próxima data de prova oficial
 */
async function obterProximaProvaAgendada(req, res) {
  try {
    const prova = await obterProximaProva();
    res.json(prova ? prova : { prova: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  obterUsuario,
  obterProximaProvaAgendada
};
