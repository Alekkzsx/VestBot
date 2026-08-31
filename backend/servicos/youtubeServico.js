const ytSearch = require('yt-search');

/**
 * Realiza uma busca no YouTube sem API Key oficial, usando scraping/API não oficial.
 * @param {string} termo Busca textual
 * @param {number} limite Número máximo de vídeos retornados
 * @returns {Promise<Array>} Lista de objetos de vídeos (id, title, timestamp, author, thumbnail)
 */
async function buscarVideos(termo, limite = 10) {
  try {
    const r = await ytSearch(termo);
    
    // Filtramos apenas resultados que são do tipo 'video'
    const videos = r.videos.slice(0, limite).map(v => ({
      videoId: v.videoId,
      titulo: v.title,
      duracao: v.timestamp,
      autor: v.author.name,
      views: v.views,
      thumb: v.thumbnail,
      url: v.url
    }));

    return videos;
  } catch (erro) {
    console.error('Erro no youtubeServico:', erro);
    throw new Error('Falha ao buscar vídeos no YouTube.');
  }
}

module.exports = {
  buscarVideos
};
