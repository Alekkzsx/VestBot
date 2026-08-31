class ProjecaoAnalitica extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <!-- Gráfico 1: Projeção de Nota até o Dia da Prova (2 Colunas) -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col justify-between">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                <i class="fas fa-chart-line text-blue-500"></i> Projeção de Nota até a Prova (06/12/2026)
              </h3>
              <p class="text-slate-500 text-xs mt-1">Simulação de curva de aprendizado baseada no seu ritmo atual.</p>
            </div>
            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              14 Semanas Restantes
            </span>
          </div>

          <div class="relative w-full h-[280px]">
            <canvas id="projectionChart"></canvas>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5 font-bold text-slate-700">
                <span class="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> Ritmo Atual (30min/dia)
              </span>
              <span class="flex items-center gap-1.5 font-bold text-slate-700">
                <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Ritmo Acelerado (+1 simulado/sem)
              </span>
              <span class="flex items-center gap-1.5 font-bold text-slate-700">
                <span class="w-3 h-0.5 bg-black inline-block"></span> Nota de Corte (35.0)
              </span>
            </div>
            <p class="text-slate-400 font-medium">Previsão na Prova: <strong class="text-black font-extrabold">43.8 pts</strong></p>
          </div>
        </div>

        <!-- Gráfico 2: Radar de Competitividade (1 Coluna) -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col justify-between items-center">
          <div class="w-full mb-4">
            <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <i class="fas fa-bullseye text-emerald-500"></i> Radar Competitivo
            </h3>
            <p class="text-slate-500 text-xs mt-1">Você vs Concorrentes no curso selecionado.</p>
          </div>

          <div class="relative w-full max-w-[240px] aspect-square flex-1 my-2">
            <canvas id="competitiveRadarChart"></canvas>
          </div>

          <div class="w-full pt-4 border-t border-slate-100 text-center space-y-1.5">
            <div class="flex justify-center gap-4 text-[11px] font-bold">
              <span class="text-black flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-black"></span> Sua Nota</span>
              <span class="text-slate-400 flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Média Geral</span>
              <span class="text-emerald-600 flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Top 10% Aprovados</span>
            </div>
            <p class="text-[11px] text-emerald-700 font-bold bg-emerald-50 py-1.5 px-3 rounded-lg mt-2">
              🏆 Você supera a média em 4 das 5 competências.
            </p>
          </div>
        </div>

      </div>
    `;
  }
}

customElements.define('projecao-analitica', ProjecaoAnalitica);
if (!customElements.get('analytics-projection')) {
  customElements.define('analytics-projection', class extends ProjecaoAnalitica {});
}
