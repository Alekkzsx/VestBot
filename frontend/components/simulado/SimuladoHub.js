class SimuladoHub extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="simulado-hub-view" class="animate-fade-in">
        
        <!-- Header -->
        <div class="text-center mb-10 mt-4">
          <span class="bg-black text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
            Ambiente Oficial de Avaliação
          </span>
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Simulados Vestibulinho ETEC</h2>
          <p class="text-slate-500 text-sm max-w-xl mx-auto">Pratique com provas cronometradas, calibradas no nível exato da banca examinadora da ETEC.</p>
        </div>

        <!-- Grid de Modos de Simulado -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <!-- Modo 1: Simulado Oficial Completo (50Q - 4h) -->
          <div class="bg-black text-white rounded-3xl p-8 shadow-xl relative overflow-hidden group flex flex-col justify-between hover:shadow-2xl transition-all">
            <div class="absolute -right-10 -top-10 w-40 h-40 bg-slate-800 rounded-full opacity-60 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
            <div class="relative z-10">
              <div class="flex justify-between items-start mb-6">
                <div class="w-14 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center text-xl shadow-inner border border-slate-700">
                  <i class="fas fa-crown text-amber-400"></i>
                </div>
                <span class="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Recomendado
                </span>
              </div>
              <h3 class="font-bold text-2xl text-white mb-2">Simulado Oficial ETEC</h3>
              <p class="text-slate-300 text-xs leading-relaxed mb-6">50 questões multidisciplinares com tempo cronometrado oficial de 4 horas. A experiência real do dia da prova.</p>
              <div class="space-y-2 mb-8 text-xs text-slate-400 border-t border-slate-800 pt-4">
                <div class="flex items-center gap-2"><i class="fas fa-check text-emerald-400"></i> 50 Questões Padrão ETEC</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-emerald-400"></i> Cronômetro de 4 Horas</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-emerald-400"></i> Cartão-Resposta Interativo</div>
              </div>
            </div>
            <button id="btn-start-oficial" class="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors relative z-10 flex items-center justify-center gap-2 text-sm shadow-md">
              Iniciar Prova Completa <i class="fas fa-arrow-right"></i>
            </button>
          </div>

          <!-- Modo 2: Simulado Rápido de Treino (10Q - 30min) -->
          <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden">
            <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative z-10">
              <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-inner border border-blue-100">
                <i class="fas fa-bolt"></i>
              </div>
              <h3 class="font-bold text-2xl text-slate-900 mb-2">Simulado Rápido</h3>
              <p class="text-slate-500 text-xs leading-relaxed mb-6">10 questões sorteadas focadas nas suas maiores fraquezas e tópicos mais cobrados. Ideal para treinos diários.</p>
              <div class="space-y-2 mb-8 text-xs text-slate-500 border-t border-slate-100 pt-4">
                <div class="flex items-center gap-2"><i class="fas fa-check text-blue-600"></i> 10 Questões Express</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-blue-600"></i> Tempo Sugerido: 30 Minutos</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-blue-600"></i> Diagnóstico Instantâneo</div>
              </div>
            </div>
            <button id="btn-start-rapido" class="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors relative z-10 flex items-center justify-center gap-2 text-sm">
              Começar Simulado Rápido <i class="fas fa-arrow-right"></i>
            </button>
          </div>

          <!-- Modo 3: Simulado por Disciplina -->
          <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden">
            <div class="absolute -right-10 -top-10 w-32 h-32 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative z-10">
              <div class="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-inner border border-purple-100">
                <i class="fas fa-filter"></i>
              </div>
              <h3 class="font-bold text-2xl text-slate-900 mb-2">Treino por Disciplina</h3>
              <p class="text-slate-500 text-xs leading-relaxed mb-6">Selecione uma matéria específica para isolar seu estudo (ex: 15 questões de Matemática).</p>
              <div class="space-y-2 mb-8 text-xs text-slate-500 border-t border-slate-100 pt-4">
                <div class="flex items-center gap-2"><i class="fas fa-check text-purple-600"></i> Foco em Exatas ou Humanas</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-purple-600"></i> Ritmo sem Pressão</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-purple-600"></i> Explicações Detalhadas</div>
              </div>
            </div>
            <button id="btn-start-disciplina" class="w-full bg-slate-100 text-slate-800 hover:bg-slate-200 py-4 rounded-xl font-bold transition-colors relative z-10 flex items-center justify-center gap-2 text-sm">
              Selecionar Matéria <i class="fas fa-arrow-right"></i>
            </button>
          </div>

        </div>

        <!-- Histórico de Simulados Realizados -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i class="fas fa-history text-slate-400"></i> Histórico de Provas Concluídas
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Seus últimos resultados armazenados localmente e no banco.</p>
            </div>
            <span class="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">3 Provas Salvas</span>
          </div>

          <div class="divide-y divide-slate-100">
            
            <!-- Histórico 1 -->
            <div class="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center">
                  42
                </div>
                <div>
                  <h4 class="text-sm font-bold text-slate-900">Vestibulinho ETEC 2023 - 2º Semestre</h4>
                  <p class="text-xs text-slate-400">Realizado em 24/08/2026 • 50 questões • Tempo: 3h 12min</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <span class="text-sm font-black text-emerald-600">84% de Acerto</span>
                  <span class="text-[10px] text-slate-400 block font-medium">Acima do corte</span>
                </div>
                <a href="../telaResolucoes/index.html" class="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors">
                  Ver Resolução
                </a>
              </div>
            </div>

            <!-- Histórico 2 -->
            <div class="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center">
                  08
                </div>
                <div>
                  <h4 class="text-sm font-bold text-slate-900">Simulado Rápido - Foco em Exatas</h4>
                  <p class="text-xs text-slate-400">Realizado em 21/08/2026 • 10 questões • Tempo: 22min</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <span class="text-sm font-black text-blue-600">80% de Acerto</span>
                  <span class="text-[10px] text-slate-400 block font-medium">Bom desempenho</span>
                </div>
                <a href="../telaResolucoes/index.html" class="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors">
                  Ver Resolução
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
  }
}

customElements.define('simulado-hub', SimuladoHub);
