document.addEventListener('DOMContentLoaded', () => {
  const inputBusca = document.getElementById('input-busca-aulas');
  const btnBusca = document.getElementById('btn-buscar-aulas');
  const gridResultados = document.getElementById('grid-resultados-aulas');
  const tagsRecentes = document.querySelectorAll('.tag-pesquisa-recente');

  // URL do backend local
  const API_URL = 'http://localhost:3000/api/youtube/search';

  // Função que faz a busca no backend e renderiza os vídeos
  async function buscarVideos(termo) {
    if (!termo.trim()) return;

    // Loading state
    btnBusca.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    btnBusca.disabled = true;

    try {
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(termo + ' etec vestibulinho')}`);
      if (!response.ok) throw new Error('Erro na busca');
      
      const videos = await response.json();
      renderizarVideos(videos);
    } catch (erro) {
      console.error(erro);
      gridResultados.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Erro ao buscar vídeos. Verifique se o backend está rodando.</div>`;
    } finally {
      btnBusca.innerHTML = 'Pesquisar';
      btnBusca.disabled = false;
    }
  }

  // Função para renderizar os cards dos vídeos (que abrirão em modal ou direto na tela)
  function renderizarVideos(videos) {
    if (!videos || videos.length === 0) {
      gridResultados.innerHTML = `<div class="col-span-full text-center text-slate-500 py-10">Nenhum vídeo encontrado. Tente outra busca.</div>`;
      return;
    }

    gridResultados.innerHTML = videos.map(video => `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md hover:border-blue-300 transition-all flex flex-col cursor-pointer card-video-yt" data-videoid="${video.videoId}">
        <div class="yt-thumb-container h-48 bg-slate-200 relative overflow-hidden">
          <img src="${video.thumb}" alt="${video.titulo}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <i class="fab fa-youtube text-xl"></i>
            </div>
          </div>
          <span class="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">${video.duracao}</span>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2 block">Conteúdo Real</span>
            <h3 class="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2" title="${video.titulo}">${video.titulo}</h3>
          </div>
          <p class="text-xs text-slate-500 mt-2"><i class="fas fa-user-circle"></i> ${video.autor}</p>
        </div>
      </div>
    `).join('');

    attachVideoListeners();
  }

  function attachVideoListeners() {
    document.querySelectorAll('.card-video-yt').forEach(card => {
      // Evita duplicar listeners
      if (card.dataset.listenerAttached === 'true') return;
      card.dataset.listenerAttached = 'true';

      card.addEventListener('click', function() {
        if (this.dataset.playing === 'true') return;
        this.dataset.playing = 'true';

        const videoId = this.dataset.videoid;
        const thumbContainer = this.querySelector('.yt-thumb-container');
        
        if (!thumbContainer) return;

        thumbContainer.innerHTML = `
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen class="absolute inset-0 w-full h-full z-10" style="min-height: 100%;"></iframe>
        `;
        
        this.style.cursor = 'default';
        this.classList.remove('hover:border-blue-300', 'hover:shadow-md');
        const overlay = this.querySelector('.absolute.inset-0.bg-black\\/40');
        if(overlay) overlay.remove();
      });
    });
  }

  // Eventos de Busca
  btnBusca.addEventListener('click', () => {
    buscarVideos(inputBusca.value);
  });

  inputBusca.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      buscarVideos(inputBusca.value);
    }
  });

  // Eventos das Tags
  tagsRecentes.forEach(tag => {
    tag.addEventListener('click', (e) => {
      const termo = e.currentTarget.textContent.trim();
      inputBusca.value = termo;
      buscarVideos(termo);
    });
  });

  // Busca inicial padrão
  attachVideoListeners();
  buscarVideos('Matemática Básica');
});
