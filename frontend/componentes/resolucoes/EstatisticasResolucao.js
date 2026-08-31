class EstatisticasResolucao extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Card 1: Total Analisado -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1">
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Questões</p>
            <p class="text-2xl font-black text-slate-900 mt-1">45 <span class="text-xs font-semibold text-slate-400">resolvidas</span></p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg">
            <i class="fas fa-list-check"></i>
          </div>
        </div>

        <!-- Card 2: Erros Pendentes -->
        <div class="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1 relative overflow-hidden">
          <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-50 rounded-full"></div>
          <div class="relative z-10">
            <p class="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <i class="fas fa-exclamation-triangle"></i> Caderno de Erros
            </p>
            <p class="text-2xl font-black text-rose-600 mt-1">12 <span class="text-xs font-semibold text-rose-400">para revisar</span></p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg relative z-10">
            <i class="fas fa-heart-crack"></i>
          </div>
        </div>

        <!-- Card 3: Taxa de Superação -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1">
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Superação de Erros</p>
            <p class="text-2xl font-black text-emerald-600 mt-1">78% <span class="text-xs font-semibold text-slate-400">corrigidos</span></p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <i class="fas fa-arrow-trend-up"></i>
          </div>
        </div>

        <!-- Card 4: Foco Urgente -->
        <div class="bg-black text-white p-5 rounded-2xl shadow-md flex items-center justify-between relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-20 h-20 bg-slate-800 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div class="relative z-10">
            <p class="text-slate-400 text-xs font-bold uppercase tracking-wider">Ponto Cego Crítico</p>
            <p class="text-base font-black text-white mt-1">Geometria Plana</p>
            <span class="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
              <i class="fas fa-fire"></i> 4 erros na semana
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center text-base relative z-10">
            <i class="fas fa-bullseye"></i>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('estatisticas-resolucao', EstatisticasResolucao);
if (!customElements.get('resolution-stats')) {
  customElements.define('resolution-stats', class extends EstatisticasResolucao {});
}
