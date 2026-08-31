const youtubeServico = require('../servicos/youtubeServico');

/**
 * Endpoint para buscar vídeos no YouTube
 * GET /api/youtube/search?q=TERMO
 */
async function buscarVideos(req, res) {
  try {
    const termo = req.query.q;
    
    if (!termo) {
      return res.status(400).json({ erro: 'O parâmetro de busca "q" é obrigatório.' });
    }

    const videos = await youtubeServico.buscarVideos(termo, 9); // Buscar 9 vídeos para ficar bem no grid 3x3
    return res.status(200).json(videos);
  } catch (erro) {
    console.error('Erro no youtubeControlador:', erro);
    return res.status(500).json({ erro: 'Erro interno ao buscar vídeos no YouTube.' });
  }
}

module.exports = {
  buscarVideos
};
