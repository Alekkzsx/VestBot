class QuestionTab extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="tab-question" class="tab-content animate-fade-in hidden">
        
        <!-- Barra de Pesquisa -->
        <div class="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center mb-8 max-w-3xl mx-auto focus-within:ring-4 focus-within:ring-slate-100 transition-all">
          <i class="fas fa-search text-slate-400 ml-4"></i>
          <input type="text" placeholder="Cole o código da questão, assunto ou ano (Ex: ETEC 2023 - Q15)..." class="flex-1 bg-transparent border-none p-4 outline-none font-medium text-slate-700">
          <button class="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">Analisar</button>
        </div>

        <!-- Painel de Resultados (Simulado para uma questão) -->
        <div class="bg-slate-900 rounded-t-3xl p-8 pb-32 relative overflow-hidden">
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">História</span>
                <span class="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Revolução Industrial</span>
                <span class="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider"><i class="fas fa-fire mr-1"></i> Difícil</span>
              </div>
              <h3 class="text-2xl font-black text-white">ETEC 2023 - Questão 15</h3>
            </div>
            <div class="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Seu Status Atual</p>
              <p class="text-red-400 font-bold flex items-center"><i class="fas fa-times-circle mr-2"></i> Você errou (Alternativa B)</p>
            </div>
          </div>
        </div>

        <!-- Cards Sobrepostos -->
        <div class="-mt-24 px-4 md:px-8 relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Gráfico de Pegadinha -->
          <div class="col-span-1 md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
            <h4 class="font-bold text-slate-900 mb-2 flex items-center"><i class="fas fa-chart-pie text-blue-500 mr-2"></i> Gráfico da "Pegadinha"</h4>
            <p class="text-sm text-slate-500 mb-6">Veja o que os outros alunos marcaram. A resposta correta era a C, mas a maioria caiu na pegadinha da alternativa B.</p>
            
            <div class="flex flex-col md:flex-row items-center gap-8">
              <div class="w-48 h-48 relative">
                <canvas id="questionDoughnut"></canvas>
              </div>
              <div class="flex-1 space-y-3 w-full">
                <div class="flex items-center justify-between text-sm"><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-slate-200"></div><span class="font-medium">Alternativa A</span></div><span class="text-slate-500">10%</span></div>
                <div class="flex items-center justify-between text-sm"><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200"></div><span class="font-bold text-red-600">Alternativa B (Sua resposta)</span></div><span class="font-bold text-slate-900">45%</span></div>
                <div class="flex items-center justify-between text-sm"><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-green-500"></div><span class="font-bold text-green-600">Alternativa C (Gabarito)</span></div><span class="font-bold text-slate-900">30%</span></div>
                <div class="flex items-center justify-between text-sm"><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-slate-200"></div><span class="font-medium">Alternativa D</span></div><span class="text-slate-500">12%</span></div>
                <div class="flex items-center justify-between text-sm"><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-slate-200"></div><span class="font-medium">Alternativa E</span></div><span class="text-slate-500">3%</span></div>
              </div>
            </div>
          </div>

          <!-- Speed Run e Acurácia Global -->
          <div class="col-span-1 space-y-6">
            <!-- Speed Run -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-slate-900 mb-1 flex items-center"><i class="fas fa-stopwatch text-orange-500 mr-2"></i> Speed Run</h4>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">Seu Tempo vs Aprovados</p>
              </div>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-700">Seu tempo na questão</span><span class="text-black">1m 15s</span></div>
                  <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"><div class="bg-black h-full" style="width: 40%"></div></div>
                </div>

              </div>
              <p class="text-xs text-orange-600 mt-4 font-medium"><i class="fas fa-info-circle"></i> Você foi rápido demais. Essa questão exige leitura cuidadosa de texto base.</p>
            </div>

            <!-- Histórico Pessoal -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
              <h4 class="font-bold text-slate-900 mb-4 flex items-center"><i class="fas fa-history text-slate-400 mr-2"></i> Seu Histórico</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span class="text-xs font-bold text-slate-500">Hoje</span>
                  <span class="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Erro</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span class="text-xs font-bold text-slate-500">Há 2 meses</span>
                  <span class="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Erro</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;
  }
}

customElements.define('perf-question-tab', QuestionTab);
