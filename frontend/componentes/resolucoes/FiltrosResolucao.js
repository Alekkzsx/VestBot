class FiltrosResolucao extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <!-- Linha 1: Abas de Status & Busca -->
        <div class="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-6">
          <!-- Abas de Status -->
          <div class="flex gap-1.5 bg-slate-100 p-1.5 rounded-xl flex-wrap">
            <button id="filter-status-all" class="filter-status-btn px-4 py-2 rounded-lg text-xs font-bold transition-all bg-black text-white shadow-sm flex items-center gap-2" data-status="all">
              <i class="fas fa-layer-group"></i> Todas as Questões <span class="bg-slate-700 text-white text-[10px] px-1.5 py-0.2 rounded-full">45</span>
            </button>
            <button id="filter-status-wrong" class="filter-status-btn px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-2" data-status="wrong">
              <i class="fas fa-heart-crack text-rose-500"></i> Apenas Erros <span class="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.2 rounded-full">12</span>
            </button>
            <button id="filter-status-correct" class="filter-status-btn px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-2" data-status="correct">
              <i class="fas fa-check-circle text-emerald-500"></i> Apenas Acertos <span class="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded-full">33</span>
            </button>
          </div>

          <!-- Busca Rápida -->
          <div class="relative min-w-[280px]">
            <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input id="input-search-resolutions" type="text" placeholder="Buscar por assunto, termo ou fórmula..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-black focus:ring-0 outline-none transition-colors">
          </div>
        </div>

        <!-- Linha 2: Filtros por Disciplina e Origem da Prova -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <!-- Pílulas de Disciplina -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Matéria:</span>
            <button class="filter-subject-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-900 text-white" data-subject="all">Todas</button>
            <button class="filter-subject-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400" data-subject="Matemática">
              <i class="fas fa-calculator text-blue-500 mr-1"></i> Matemática
            </button>
            <button class="filter-subject-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400" data-subject="Português">
              <i class="fas fa-book text-rose-500 mr-1"></i> Português
            </button>
            <button class="filter-subject-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400" data-subject="Ciências">
              <i class="fas fa-flask text-emerald-500 mr-1"></i> Ciências
            </button>
            <button class="filter-subject-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400" data-subject="Humanas">
              <i class="fas fa-landmark text-amber-500 mr-1"></i> Humanas
            </button>
          </div>

          <!-- Select de Origem / Prova -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Origem:</span>
            <select id="select-origin-filter" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-black">
              <option value="all">Todas as Provas</option>
              <option value="ETEC">Vestibulinho ETEC</option>
              <option value="IFSP">Processo Seletivo IFSP</option>
              <option value="Simulado">Simulados Rápidos</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('filtros-resolucao', FiltrosResolucao);
if (!customElements.get('resolution-filters')) {
  customElements.define('resolution-filters', class extends FiltrosResolucao {});
}
