class OverviewTab extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="tab-overview" class="tab-content animate-fade-in block">
        <!-- Metrics Overview Grid -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">Feitas</span>
            <div class="mt-4 flex items-baseline gap-2"><span class="text-3xl font-black text-black">340</span><span class="text-slate-400 text-xs font-semibold">questões</span></div>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">Acertos</span>
            <div class="mt-4 flex items-baseline gap-2"><span class="text-3xl font-black text-emerald-600">255</span><span class="text-slate-400 text-xs font-semibold">corretas</span></div>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">Erros</span>
            <div class="mt-4 flex items-baseline gap-2"><span class="text-3xl font-black text-rose-600">85</span><span class="text-slate-400 text-xs font-semibold">incorretas</span></div>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">Acurácia Geral</span>
            <div class="mt-4 flex items-baseline gap-2"><span class="text-3xl font-black text-amber-500">75%</span><span class="text-slate-400 text-xs font-semibold">de acertos</span></div>
          </div>
          <!-- Pace / Gestão de Tempo -->
          <div class="bg-black p-6 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden group">
            <div class="absolute -right-6 -top-6 w-20 h-20 bg-slate-800 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
            <span class="text-slate-400 text-xs font-bold uppercase tracking-wider relative z-10 flex items-center"><i class="fas fa-stopwatch mr-2 text-white"></i> Pace de Prova</span>
            <div class="mt-4 flex flex-col gap-1 relative z-10">
              <div class="flex items-baseline gap-2"><span class="text-3xl font-black text-white">2m10s</span><span class="text-slate-400 text-xs font-semibold">/questão</span></div>
              <span class="text-[10px] text-green-400 font-bold uppercase tracking-widest"><i class="fas fa-arrow-down mr-1"></i> 50s Abaixo do limite</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Gráfico de Evolução -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-bold text-slate-900 flex items-center gap-2"><i class="fas fa-chart-line text-blue-500"></i> Evolução de Aprendizado</h3>
              <span class="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded">Últimas 4 Semanas</span>
            </div>
            <div class="flex-1 relative w-full min-h-[250px]">
              <canvas id="evolutionChart"></canvas>
            </div>
          </div>

          <!-- Radar de Afinidade e Dificuldade -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Radar -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
              <h3 class="font-bold text-slate-900 mb-2 w-full text-left">Radar de Afinidade</h3>
              <p class="text-xs text-slate-400 w-full text-left mb-4">Seu equilíbrio entre áreas.</p>
              <div class="relative w-full max-w-[200px] aspect-square flex-1">
                <canvas id="radarChart"></canvas>
              </div>
            </div>
            
            <!-- Desempenho por Dificuldade -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-slate-900 mb-2">Por Dificuldade</h3>
                <p class="text-xs text-slate-400 mb-6">Como você se sai nas questões decisivas.</p>
              </div>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-700">Fácil</span><span class="text-green-600">92%</span></div>
                  <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div class="bg-green-500 h-full" style="width: 92%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-700">Médio</span><span class="text-yellow-500">68%</span></div>
                  <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div class="bg-yellow-400 h-full" style="width: 68%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-700">Difícil</span><span class="text-red-500">35%</span></div>
                  <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div class="bg-red-500 h-full" style="width: 35%"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Micro-Tópicos -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pontos Fortes -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 class="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <i class="fas fa-crown text-amber-500"></i> Top 3 Pontos Fortes
            </h3>
            <div class="space-y-4">
              <div class="flex items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-black mr-4">1</div>
                <div class="flex-1">
                  <p class="font-bold text-slate-800 text-sm">Figuras de Linguagem</p>
                  <p class="text-xs text-slate-500">Português</p>
                </div>
                <div class="text-right">
                  <p class="font-black text-green-600">95%</p>
                </div>
              </div>
              <div class="flex items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-black mr-4">2</div>
                <div class="flex-1">
                  <p class="font-bold text-slate-800 text-sm">Regra de Três Simples</p>
                  <p class="text-xs text-slate-500">Matemática</p>
                </div>
                <div class="text-right">
                  <p class="font-black text-green-600">90%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pontos Cegos -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0"></div>
            <h3 class="font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
              <i class="fas fa-exclamation-triangle text-red-500"></i> Top 3 Pontos Cegos
            </h3>
            <div class="space-y-4 relative z-10">
              <div class="flex items-center p-4 bg-white border border-red-100 shadow-sm rounded-xl">
                <div class="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-black mr-4">1</div>
                <div class="flex-1">
                  <p class="font-bold text-slate-800 text-sm">Equação de 2º Grau</p>
                  <p class="text-xs text-slate-500">Matemática</p>
                </div>
                <div class="text-right">
                  <p class="font-black text-red-600">20%</p>
                </div>
              </div>
              <div class="flex items-center p-4 bg-white border border-red-100 shadow-sm rounded-xl">
                <div class="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-black mr-4">2</div>
                <div class="flex-1">
                  <p class="font-bold text-slate-800 text-sm">Revolução Industrial</p>
                  <p class="text-xs text-slate-500">História</p>
                </div>
                <div class="text-right">
                  <p class="font-black text-red-600">35%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('perf-overview-tab', OverviewTab);
