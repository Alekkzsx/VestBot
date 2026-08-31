class AbaComportamento extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="tab-behavior" class="tab-content animate-fade-in hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          <!-- Matriz de Padrão de Erro -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
            <div class="mb-6">
              <h3 class="font-bold text-xl text-slate-900 flex items-center gap-2"><i class="fas fa-chess-knight text-purple-600"></i> Matriz de Padrão de Erro</h3>
              <p class="text-slate-500 text-xs mt-1">Por que você erra? Cruzamento de tempo gasto x resultado.</p>
            </div>
            
            <div class="flex-1 flex items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div class="w-full max-w-sm aspect-square relative">
                <!-- Eixos -->
                <div class="absolute inset-0 flex">
                  <div class="w-1/2 h-full border-r-2 border-slate-300 border-dashed"></div>
                  <div class="w-1/2 h-full"></div>
                </div>
                <div class="absolute inset-0 flex flex-col">
                  <div class="h-1/2 w-full border-b-2 border-slate-300 border-dashed"></div>
                  <div class="h-1/2 w-full"></div>
                </div>
                
                <!-- Labels eixos -->
                <span class="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-slate-400 uppercase">Tempo Alto</span>
                <span class="absolute top-1/2 -right-12 -translate-y-1/2 rotate-90 text-[10px] font-bold text-slate-400 uppercase">Tempo Curto</span>
                <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase">Acerto</span>
                <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase">Erro</span>

                <!-- Quadrantes BG -->
                <div class="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-50/50 p-2 flex flex-col items-start justify-start"><span class="text-[10px] font-bold text-blue-400">Domínio Lento</span></div>
                <div class="absolute top-0 right-0 w-1/2 h-1/2 bg-green-50/50 p-2 flex flex-col items-end justify-start"><span class="text-[10px] font-bold text-green-500">Domínio Absoluto</span></div>
                <div class="absolute bottom-0 left-0 w-1/2 h-1/2 bg-red-50/50 p-2 flex flex-col items-start justify-end"><span class="text-[10px] font-bold text-red-500">Desconhecimento</span></div>
                <div class="absolute bottom-0 right-0 w-1/2 h-1/2 bg-orange-50/50 p-2 flex flex-col items-end justify-end"><span class="text-[10px] font-bold text-orange-500">Desatenção / Chute</span></div>

                <!-- Ponto de dado do Aluno -->
                <div class="absolute bg-black w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-black/20" style="bottom: 25%; right: 30%;">
                  <i class="fas fa-crosshairs text-[10px]"></i>
                </div>
              </div>
            </div>
            
            <div class="mt-6 bg-orange-50 border border-orange-100 p-4 rounded-xl">
              <p class="text-sm text-orange-800 font-bold mb-1"><i class="fas fa-exclamation-circle mr-1"></i> Foco em Desatenção</p>
              <p class="text-xs text-orange-700">Você costuma errar rápido demais. A maioria dos seus erros são impulsivos (menos de 30 segundos de leitura). Leia a questão inteira!</p>
            </div>
          </div>

          <!-- Análise de Fadiga (Resistência) -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
            <div class="mb-6">
              <h3 class="font-bold text-xl text-slate-900 flex items-center gap-2"><i class="fas fa-battery-half text-teal-500"></i> Análise de Fadiga</h3>
              <p class="text-slate-500 text-xs mt-1">Como seu cérebro se comporta após 2 horas de simulado.</p>
            </div>

            <div class="space-y-6 flex-1 flex flex-col justify-center">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-2xl shadow-inner"><i class="fas fa-battery-full"></i></div>
                <div class="flex-1">
                  <p class="text-xs text-slate-400 font-bold uppercase mb-1">Questões 1 a 20</p>
                  <h4 class="text-2xl font-black text-slate-900">85% <span class="text-sm font-medium text-slate-500">acurácia</span></h4>
                </div>
              </div>
              <div class="w-0.5 h-8 bg-gradient-to-b from-green-200 to-red-200 ml-8"></div>
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 text-2xl shadow-inner"><i class="fas fa-battery-quarter"></i></div>
                <div class="flex-1">
                  <p class="text-xs text-slate-400 font-bold uppercase mb-1">Questões 30 a 50</p>
                  <div class="flex items-center gap-3">
                    <h4 class="text-2xl font-black text-slate-900">52% <span class="text-sm font-medium text-slate-500">acurácia</span></h4>
                    <span class="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full"><i class="fas fa-arrow-down mr-1"></i> Queda crítica</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Heatmap e Repetição Espaçada -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          <!-- Heatmap de Horários -->
          <div class="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="font-bold text-xl text-slate-900 flex items-center gap-2"><i class="fas fa-fire text-orange-500"></i> Heatmap de Produtividade</h3>
                <p class="text-slate-500 text-xs mt-1">Horários em que você possui a maior taxa de acerto e retenção.</p>
              </div>
            </div>

            <div class="overflow-x-auto pb-4 custom-scrollbar">
              <div class="min-w-[500px]">
                <div class="flex text-[10px] text-slate-400 font-bold uppercase mb-2 ml-10">
                  <div class="flex-1 text-center">Manhã (6h-12h)</div>
                  <div class="flex-1 text-center">Tarde (12h-18h)</div>
                  <div class="flex-1 text-center">Noite (18h-24h)</div>
                  <div class="flex-1 text-center">Madrugada (0h-6h)</div>
                </div>
                
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <span class="w-8 text-[10px] font-bold text-slate-400">Seg</span>
                    <div class="flex-1 grid grid-cols-4 gap-2">
                      <div class="h-8 bg-green-500 rounded-md" title="90% de acertos"></div>
                      <div class="h-8 bg-green-300 rounded-md" title="75% de acertos"></div>
                      <div class="h-8 bg-slate-100 rounded-md" title="Sem dados"></div>
                      <div class="h-8 bg-slate-100 rounded-md" title="Sem dados"></div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-8 text-[10px] font-bold text-slate-400">Ter</span>
                    <div class="flex-1 grid grid-cols-4 gap-2">
                      <div class="h-8 bg-green-400 rounded-md" title="80% de acertos"></div>
                      <div class="h-8 bg-green-500 rounded-md" title="92% de acertos"></div>
                      <div class="h-8 bg-green-200 rounded-md" title="60% de acertos"></div>
                      <div class="h-8 bg-slate-100 rounded-md" title="Sem dados"></div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-8 text-[10px] font-bold text-slate-400">Qua</span>
                    <div class="flex-1 grid grid-cols-4 gap-2">
                      <div class="h-8 bg-green-500 rounded-md" title="88% de acertos"></div>
                      <div class="h-8 bg-green-400 rounded-md" title="82% de acertos"></div>
                      <div class="h-8 bg-slate-100 rounded-md" title="Sem dados"></div>
                      <div class="h-8 bg-slate-100 rounded-md" title="Sem dados"></div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-8 text-[10px] font-bold text-slate-400">Qui</span>
                    <div class="flex-1 grid grid-cols-4 gap-2">
                      <div class="h-8 bg-green-300 rounded-md" title="70% de acertos"></div>
                      <div class="h-8 bg-green-500 rounded-md" title="95% de acertos"></div>
                      <div class="h-8 bg-green-100 rounded-md" title="40% de acertos"></div>
                      <div class="h-8 bg-slate-100 rounded-md" title="Sem dados"></div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-8 text-[10px] font-bold text-slate-400">Sex</span>
                    <div class="flex-1 grid grid-cols-4 gap-2">
                      <div class="h-8 bg-green-400 rounded-md" title="85% de acertos"></div>
                      <div class="h-8 bg-green-300 rounded-md" title="72% de acertos"></div>
                      <div class="h-8 bg-slate-100 rounded-md" title="Sem dados"></div>
                      <div class="h-8 bg-slate-100 rounded-md" title="Sem dados"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Radar de Fixação / Curva do Esquecimento -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-xl text-slate-900 flex items-center gap-2"><i class="fas fa-brain text-indigo-500"></i> Curva do Esquecimento</h3>
              <p class="text-slate-500 text-xs mt-1">Conceitos prestes a expirar da memória.</p>
              
              <div class="space-y-4 mt-6">
                <div class="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div class="flex justify-between items-start mb-1">
                    <h5 class="text-xs font-bold text-red-900">Termoquímica (Entalpia)</h5>
                    <span class="text-[9px] bg-red-200 text-red-800 font-bold px-1.5 py-0.5 rounded">Expira Hoje</span>
                  </div>
                  <p class="text-[10px] text-red-700">Estudado há 6 dias. Retenção caiu para 30%.</p>
                </div>

                <div class="p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <div class="flex justify-between items-start mb-1">
                    <h5 class="text-xs font-bold text-yellow-900">Era Vargas (Constituição 34)</h5>
                    <span class="text-[9px] bg-yellow-200 text-yellow-800 font-bold px-1.5 py-0.5 rounded">Expira em 2 dias</span>
                  </div>
                  <p class="text-[10px] text-yellow-700">Estudado há 4 dias. Retenção em 55%.</p>
                </div>
              </div>
            </div>

            <a href="../telaResolucoes/index.html" class="w-full mt-4 py-3 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-2">
              <i class="fas fa-rotate"></i> Revisar Caderno de Erros
            </a>
          </div>

        </div>
      </div>
    `;
  }
}

customElements.define('aba-comportamento', AbaComportamento);
if (!customElements.get('perf-behavior-tab')) {
  customElements.define('perf-behavior-tab', class extends AbaComportamento {});
}
