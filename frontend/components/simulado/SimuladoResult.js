class SimuladoResult extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="simulado-result-view" class="hidden animate-fade-in max-w-4xl mx-auto">
        
        <!-- Card Principal de Pontuação -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12 mb-8 text-center relative overflow-hidden">
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-70"></div>
          <div class="relative z-10">
            <span class="bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block">
              🎉 Simulado Concluído com Sucesso!
            </span>
            <h2 class="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
              <span id="result-score-number">42</span> <span class="text-2xl md:text-3xl font-bold text-slate-400">/ <span id="result-total-number">50</span> Acertos</span>
            </h2>
            <p id="result-feedback-headline" class="text-emerald-600 font-bold text-base md:text-lg mb-8">
              Excelente! Você está 7.0 pontos acima da nota de corte estimada.
            </p>

            <!-- 3 Métricas Rápidas -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Acurácia Geral</span>
                <span id="result-accuracy-percent" class="text-2xl font-black text-slate-900">84%</span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tempo Total</span>
                <span id="result-total-time" class="text-2xl font-black text-slate-900">2h 45m</span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pace Médio</span>
                <span id="result-pace-avg" class="text-2xl font-black text-slate-900">3m 18s</span>
              </div>
            </div>

            <!-- Botões de Ação -->
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <a href="../telaResolucoes/index.html" class="px-8 py-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2">
                <i class="fas fa-check-double"></i> Ver Gabarito & Resoluções Passo a Passo
              </a>
              <button id="btn-back-to-hub" class="px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                <i class="fas fa-rotate-left"></i> Voltar aos Simulados
              </button>
            </div>

          </div>
        </div>

        <!-- Breakdown por Disciplina e Diagnóstico de Fadiga -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <!-- Rendimento por Disciplina -->
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h3 class="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
              <i class="fas fa-chart-pie text-blue-500"></i> Desempenho por Disciplina
            </h3>
            <div class="space-y-4" id="result-subjects-bars">
              <!-- Injetado dinamicamente -->
              <div>
                <div class="flex justify-between text-xs font-bold mb-1"><span>Português</span><span class="text-emerald-600">90% (9/10)</span></div>
                <div class="w-full bg-slate-100 rounded-full h-2"><div class="bg-emerald-500 h-full rounded-full" style="width: 90%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-bold mb-1"><span>Matemática</span><span class="text-emerald-600">80% (8/10)</span></div>
                <div class="w-full bg-slate-100 rounded-full h-2"><div class="bg-emerald-500 h-full rounded-full" style="width: 80%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-bold mb-1"><span>Ciências</span><span class="text-blue-600">70% (7/10)</span></div>
                <div class="w-full bg-slate-100 rounded-full h-2"><div class="bg-blue-500 h-full rounded-full" style="width: 70%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-bold mb-1"><span>Humanas</span><span class="text-emerald-600">90% (9/10)</span></div>
                <div class="w-full bg-slate-100 rounded-full h-2"><div class="bg-emerald-500 h-full rounded-full" style="width: 90%"></div></div>
              </div>
            </div>
          </div>

          <!-- Diagnóstico de Fadiga Cognitiva -->
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                <i class="fas fa-battery-half text-teal-500"></i> Rastreio de Fadiga Cognitiva
              </h3>
              <p class="text-xs text-slate-500 mb-6">Comparativo de acertos na primeira metade da prova vs segunda metade.</p>

              <div class="space-y-4">
                <div class="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <span class="text-xs font-bold text-slate-700">1ª Metade (Questões 1 a 25)</span>
                  <span class="text-sm font-black text-emerald-700">88% Acerto</span>
                </div>
                <div class="flex items-center justify-between p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl">
                  <span class="text-xs font-bold text-slate-700">2ª Metade (Questões 26 a 50)</span>
                  <span class="text-sm font-black text-amber-700">80% Acerto</span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100">
              <p class="text-xs text-slate-600 leading-relaxed">
                💡 <strong>Excelente resistência!</strong> Sua taxa de acerto permaneceu estável até a 45ª questão, indicando ótima gestão de foco.
              </p>
            </div>
          </div>

        </div>

      </div>
    `;
  }
}

customElements.define('simulado-result', SimuladoResult);
