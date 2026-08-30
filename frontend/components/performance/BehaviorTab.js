class BehaviorTab extends HTMLElement {
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
                
                <!-- Linhas dos dias -->
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2"><span class="w-8 text-[10px] text-slate-400 font-bold">SEG</span><div class="flex-1 grid grid-cols-4 gap-1"><div class="h-6 bg-green-400 rounded-sm"></div><div class="h-6 bg-green-200 rounded-sm"></div><div class="h-6 bg-green-500 rounded-sm"></div><div class="h-6 bg-slate-100 rounded-sm"></div></div></div>
                  <div class="flex items-center gap-2"><span class="w-8 text-[10px] text-slate-400 font-bold">TER</span><div class="flex-1 grid grid-cols-4 gap-1"><div class="h-6 bg-green-500 rounded-sm"></div><div class="h-6 bg-green-300 rounded-sm"></div><div class="h-6 bg-green-600 rounded-sm shadow-sm"></div><div class="h-6 bg-slate-100 rounded-sm"></div></div></div>
                  <div class="flex items-center gap-2"><span class="w-8 text-[10px] text-slate-400 font-bold">QUA</span><div class="flex-1 grid grid-cols-4 gap-1"><div class="h-6 bg-slate-100 rounded-sm"></div><div class="h-6 bg-green-100 rounded-sm"></div><div class="h-6 bg-green-400 rounded-sm"></div><div class="h-6 bg-slate-100 rounded-sm"></div></div></div>
                  <div class="flex items-center gap-2"><span class="w-8 text-[10px] text-slate-400 font-bold">QUI</span><div class="flex-1 grid grid-cols-4 gap-1"><div class="h-6 bg-green-300 rounded-sm"></div><div class="h-6 bg-slate-100 rounded-sm"></div><div class="h-6 bg-green-600 rounded-sm shadow-sm"></div><div class="h-6 bg-green-100 rounded-sm"></div></div></div>
                  <div class="flex items-center gap-2"><span class="w-8 text-[10px] text-slate-400 font-bold">SEX</span><div class="flex-1 grid grid-cols-4 gap-1"><div class="h-6 bg-green-500 rounded-sm"></div><div class="h-6 bg-green-200 rounded-sm"></div><div class="h-6 bg-slate-100 rounded-sm"></div><div class="h-6 bg-slate-100 rounded-sm"></div></div></div>
                </div>
              </div>
            </div>
            <p class="text-xs text-slate-500 mt-4 text-center">💡 Seu "Prime Time" cognitivo é nas <strong class="text-slate-800">Noites de Terça e Quinta</strong>.</p>
          </div>

          <!-- Curva de Esquecimento -->
          <div class="bg-slate-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-red-600 rounded-full blur-3xl opacity-30"></div>
            <h3 class="font-bold text-xl text-white flex items-center gap-2 mb-2 relative z-10"><i class="fas fa-bell text-red-400"></i> Alerta de Esquecimento</h3>
            <p class="text-slate-400 text-xs mb-8 relative z-10">Curva de Repetição Espaçada ativada.</p>

            <div class="space-y-4 relative z-10">
              <div class="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-bold text-white">Biologia Celular</span>
                  <span class="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Crítico</span>
                </div>
                <div class="flex items-center justify-between mt-1">
                  <span class="text-xs text-slate-400">Última revisão: Há 42 dias</span>
                  <button class="text-xs font-bold text-blue-400 hover:text-white transition-colors">Revisar Agora <i class="fas fa-arrow-right"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- NEW: Métricas Neurocognitivas (Aversão a texto, Efeito Dominó, Interdisciplinaridade) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Aversão a Texto -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-lg mb-4">
                <i class="fas fa-align-left"></i>
              </div>
              <h3 class="font-bold text-slate-900 mb-1">Aversão a Textos Longos</h3>
              <p class="text-xs text-slate-500 mb-6">Diferença de acerto pelo tamanho do enunciado.</p>
            </div>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-[11px] font-bold mb-1"><span class="text-slate-700">Textos Curtos (Até 3 linhas)</span><span class="text-green-600">85% acerto</span></div>
                <div class="w-full bg-slate-100 rounded-full h-1.5"><div class="bg-green-500 h-full rounded-full" style="width: 85%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-[11px] font-bold mb-1"><span class="text-slate-700">Textos Longos (+4 linhas)</span><span class="text-red-500">42% acerto</span></div>
                <div class="w-full bg-slate-100 rounded-full h-1.5"><div class="bg-red-500 h-full rounded-full" style="width: 42%"></div></div>
              </div>
              <p class="text-[10px] text-blue-600 font-bold bg-blue-50 p-2 rounded-lg mt-2"><i class="fas fa-lightbulb"></i> Foco na interpretação textual de exatas.</p>
            </div>
          </div>

          <!-- Resiliência Emocional -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-lg mb-4">
                <i class="fas fa-heart-crack"></i>
              </div>
              <h3 class="font-bold text-slate-900 mb-1">Resiliência (Efeito Dominó)</h3>
              <p class="text-xs text-slate-500 mb-6">Seu desempenho na questão IMEDIATAMENTE após um erro.</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex-1 text-center bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Após Errar</p>
                <p class="text-2xl font-black text-red-500">28%</p>
                <p class="text-[9px] text-slate-500">de acerto na próx.</p>
              </div>
              <i class="fas fa-arrow-right text-slate-300"></i>
              <div class="flex-1 text-center bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Após Acertar</p>
                <p class="text-2xl font-black text-green-500">82%</p>
                <p class="text-[9px] text-slate-500">de acerto na próx.</p>
              </div>
            </div>
            <p class="text-[10px] text-purple-600 font-bold bg-purple-50 p-2 rounded-lg mt-4"><i class="fas fa-brain"></i> Um erro abala sua confiança. Respire!</p>
          </div>

          <!-- Interdisciplinaridade -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div class="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-lg mb-4">
                <i class="fas fa-project-diagram"></i>
              </div>
              <h3 class="font-bold text-slate-900 mb-1">Fator Interdisciplinar</h3>
              <p class="text-xs text-slate-500 mb-6">Como você lida com questões híbridas (Padrão ETEC).</p>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700"><i class="fas fa-flask text-slate-400 w-4"></i> Disciplina Única</span>
                <span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">88% Acerto</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700"><i class="fas fa-link text-slate-400 w-4"></i> Híbridas (ex: Bio+Geo)</span>
                <span class="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg">45% Acerto</span>
              </div>
            </div>
            <p class="text-[10px] text-amber-700 font-bold bg-amber-50 p-2 rounded-lg mt-4"><i class="fas fa-exclamation-triangle"></i> Dificuldade em conectar contextos distintos.</p>
          </div>

        </div>

      </div>
    `;
  }
}

customElements.define('perf-behavior-tab', BehaviorTab);
