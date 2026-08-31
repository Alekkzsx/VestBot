class BarraLateral extends HTMLElement {
  connectedCallback() {
    const itemAtivo = this.getAttribute('item-ativo') || this.getAttribute('active-item') || 'painel';

    this.innerHTML = `
      <!-- Cabeçalho Mobile -->
      <div class="md:hidden bg-white p-4 border-b border-slate-200 flex justify-between items-center z-20 sticky top-0 w-full">
        <div class="font-bold text-xl text-black tracking-tight">ETECPRO</div>
        <div class="flex items-center gap-4">
          <button id="btn-toggle-sidebar" class="text-slate-600 hover:text-black focus:outline-none">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Barra Lateral / Sidebar -->
      <aside id="sidebar" class="bg-white h-screen fixed md:sticky top-0 left-0 border-r border-slate-200 w-64 transform -translate-x-full md:translate-x-0 transition-transform duration-300 z-30 flex flex-col shrink-0">
        <div class="h-24 flex items-center px-8 shrink-0">
          <h1 class="sidebar-expanded-only font-bold text-2xl tracking-tight text-black flex items-center">
            <div class="w-8 h-8 bg-black rounded-lg mr-3 flex items-center justify-center text-white text-xs"><i class="fas fa-layer-group"></i></div>
            ETECPRO
          </h1>
          <div class="sidebar-collapsed-only hidden w-full flex justify-center">
            <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs"><i class="fas fa-layer-group"></i></div>
          </div>
        </div>

        <nav class="flex-1 py-4 space-y-2 px-4 overflow-y-auto custom-scrollbar">
          <a href="../telaPainel/index.html" class="nav-item w-full text-left px-4 py-3.5 rounded-xl transition-all font-medium flex items-center text-sm group relative ${['painel', 'dashboard'].includes(itemAtivo) ? 'bg-slate-100 text-black font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">
            <i class="fas fa-home w-5 text-center text-lg transition-colors mr-3 ${['painel', 'dashboard'].includes(itemAtivo) ? 'text-black' : 'text-slate-400'}"></i>
            <span class="sidebar-expanded-only">Início</span>
          </a>
          
          <a href="../telaCronograma/index.html" class="nav-item w-full text-left px-4 py-3.5 rounded-xl transition-all font-medium flex items-center text-sm group relative ${['cronograma', 'schedule'].includes(itemAtivo) ? 'bg-slate-100 text-black font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">
            <i class="fas fa-calendar-alt w-5 text-center text-lg transition-colors mr-3 ${['cronograma', 'schedule'].includes(itemAtivo) ? 'text-black' : 'text-slate-400'}"></i>
            <span class="sidebar-expanded-only">Cronograma</span>
          </a>

          <a href="../telaAulas/index.html" class="nav-item w-full text-left px-4 py-3.5 rounded-xl transition-all font-medium flex items-center text-sm group relative ${['aulas', 'lessons'].includes(itemAtivo) ? 'bg-slate-100 text-black font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">
            <i class="fas fa-play-circle w-5 text-center text-lg transition-colors mr-3 ${['aulas', 'lessons'].includes(itemAtivo) ? 'text-black' : 'text-slate-400'}"></i>
            <span class="sidebar-expanded-only">Aulas</span>
            <span class="sidebar-expanded-only ml-auto bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NOVO</span>
          </a>

          <a href="../telaSimulado/index.html" class="nav-item w-full text-left px-4 py-3.5 rounded-xl transition-all font-medium flex items-center text-sm group relative ${['simulado', 'quiz'].includes(itemAtivo) ? 'bg-slate-100 text-black font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">
            <i class="fas fa-pen-square w-5 text-center text-lg transition-colors mr-3 ${['simulado', 'quiz'].includes(itemAtivo) ? 'text-black' : 'text-slate-400'}"></i>
            <span class="sidebar-expanded-only">Simulado</span>
          </a>

          <a href="../telaInterpretacao/index.html" class="nav-item w-full text-left px-4 py-3.5 rounded-xl transition-all font-medium flex items-center text-sm group relative ${['interpretacao', 'interpretation'].includes(itemAtivo) ? 'bg-slate-100 text-black font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">
            <i class="fas fa-book-open w-5 text-center text-lg transition-colors mr-3 ${['interpretacao', 'interpretation'].includes(itemAtivo) ? 'text-black' : 'text-slate-400'}"></i>
            <span class="sidebar-expanded-only">Interpretação</span>
            <span class="sidebar-expanded-only ml-auto bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NOVO</span>
          </a>

          <a href="../telaResolucoes/index.html" class="nav-item w-full text-left px-4 py-3.5 rounded-xl transition-all font-medium flex items-center text-sm group relative ${['resolucoes', 'resolutions'].includes(itemAtivo) ? 'bg-slate-100 text-black font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">
            <i class="fas fa-check-double w-5 text-center text-lg transition-colors mr-3 ${['resolucoes', 'resolutions'].includes(itemAtivo) ? 'text-black' : 'text-slate-400'}"></i>
            <span class="sidebar-expanded-only">Resoluções</span>
            <span class="sidebar-expanded-only ml-auto bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NOVO</span>
          </a>

          <a href="../telaAnalitica/index.html" class="nav-item w-full text-left px-4 py-3.5 rounded-xl transition-all font-medium flex items-center text-sm group relative ${['analitica', 'analytics'].includes(itemAtivo) ? 'bg-slate-100 text-black font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">
            <i class="fas fa-chart-bar w-5 text-center text-lg transition-colors mr-3 ${['analitica', 'analytics'].includes(itemAtivo) ? 'text-black' : 'text-slate-400'}"></i>
            <span class="sidebar-expanded-only">Analítica</span>
            <span class="sidebar-expanded-only ml-auto bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NOVO</span>
          </a>

          <a href="../telaEntendendo/index.html" class="nav-item w-full text-left px-4 py-3.5 rounded-xl transition-all font-medium flex items-center text-sm group relative ${['entendendo'].includes(itemAtivo) ? 'bg-slate-100 text-black font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">
            <i class="fas fa-lightbulb w-5 text-center text-lg transition-colors mr-3 ${['entendendo'].includes(itemAtivo) ? 'text-black' : 'text-slate-400'}"></i>
            <span class="sidebar-expanded-only">Entendendo</span>
            <span class="sidebar-expanded-only ml-auto bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NOVO</span>
          </a>

          <a href="../telaDesempenho/index.html" class="nav-item w-full text-left px-4 py-3.5 rounded-xl transition-all font-medium flex items-center text-sm group relative ${['desempenho', 'performance'].includes(itemAtivo) ? 'bg-slate-100 text-black font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">
            <i class="fas fa-chart-line w-5 text-center text-lg transition-colors mr-3 ${['desempenho', 'performance'].includes(itemAtivo) ? 'text-black' : 'text-slate-400'}"></i>
            <span class="sidebar-expanded-only">Desempenho</span>
          </a>
          <a href="../telaEngenharia/index.html" class="nav-item w-full text-left px-4 py-3.5 rounded-xl transition-all font-medium flex items-center text-sm group relative ${['engenharia', 'engineering'].includes(itemAtivo) ? 'bg-slate-100 text-black font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">
            <i class="fas fa-database w-5 text-center text-lg transition-colors mr-3 ${['engenharia', 'engineering'].includes(itemAtivo) ? 'text-black' : 'text-slate-400'}"></i>
            <span class="sidebar-expanded-only">Engenharia</span>
            <span class="sidebar-expanded-only ml-auto bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full"><i class="fas fa-lock"></i> ADMIN</span>
          </a>
        </nav>

        <div class="p-6 border-t border-slate-100">
          <div class="sidebar-expanded-only flex items-center">
            <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold"><i class="fas fa-user"></i></div>
            <div class="ml-3">
              <p class="text-sm font-bold text-black">Estudante</p>
              <p class="text-xs text-slate-500">Aspirante ETEC</p>
            </div>
          </div>
          <div class="sidebar-collapsed-only hidden flex justify-center">
            <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs"><i class="fas fa-user"></i></div>
          </div>
          <button id="btn-collapse-sidebar" class="mt-4 w-full flex items-center justify-center text-slate-400 hover:text-black transition-colors">
            <i class="fas fa-chevron-left"></i>
          </button>
        </div>
      </aside>

      <!-- Overlay para Mobile -->
      <div id="sidebar-overlay" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden opacity-0 hidden transition-opacity"></div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const btnToggleSidebar = this.querySelector('#btn-toggle-sidebar');
    const sidebar = this.querySelector('#sidebar');
    const overlay = this.querySelector('#sidebar-overlay');
    const btnCollapseSidebar = this.querySelector('#btn-collapse-sidebar');

    function toggleSidebarMobile() {
      if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        if (overlay) {
          overlay.classList.remove('hidden');
          setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        }
      } else {
        sidebar.classList.add('-translate-x-full');
        if (overlay) {
          overlay.classList.add('opacity-0');
          setTimeout(() => overlay.classList.add('hidden'), 300);
        }
      }
    }

    if (btnToggleSidebar) btnToggleSidebar.addEventListener('click', toggleSidebarMobile);
    if (overlay) overlay.addEventListener('click', toggleSidebarMobile);

    if (btnCollapseSidebar) {
      btnCollapseSidebar.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.contains('w-20');
        
        if (isCollapsed) {
          sidebar.classList.remove('w-20');
          sidebar.classList.add('w-64');
          this.querySelectorAll('.sidebar-expanded-only').forEach(el => el.classList.remove('hidden'));
          this.querySelectorAll('.sidebar-collapsed-only').forEach(el => el.classList.add('hidden'));
          this.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('justify-center');
            const icon = el.querySelector('i');
            if (icon) icon.classList.add('mr-3');
          });
          const iconBtn = btnCollapseSidebar.querySelector('i');
          iconBtn.classList.remove('fa-chevron-right');
          iconBtn.classList.add('fa-chevron-left');
        } else {
          sidebar.classList.remove('w-64');
          sidebar.classList.add('w-20');
          this.querySelectorAll('.sidebar-expanded-only').forEach(el => el.classList.add('hidden'));
          this.querySelectorAll('.sidebar-collapsed-only').forEach(el => el.classList.remove('hidden'));
          this.querySelectorAll('.nav-item').forEach(el => {
            el.classList.add('justify-center');
            const icon = el.querySelector('i');
            if (icon) icon.classList.remove('mr-3');
          });
          const iconBtn = btnCollapseSidebar.querySelector('i');
          iconBtn.classList.remove('fa-chevron-left');
          iconBtn.classList.add('fa-chevron-right');
        }
      });
    }
  }
}

// Registra os nomes do componente para compatibilidade total
customElements.define('barra-lateral', BarraLateral);
if (!customElements.get('app-sidebar')) {
  customElements.define('app-sidebar', class extends BarraLateral {});
}
