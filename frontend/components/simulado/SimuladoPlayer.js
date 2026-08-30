class SimuladoPlayer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="simulado-player-view" class="hidden animate-fade-in">
        
        <!-- Header Fixo da Prova -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-4 z-30">
          <div class="flex items-center gap-3">
            <span id="player-exam-title-badge" class="bg-black text-white text-xs font-bold px-3 py-1 rounded-lg">
              Simulado Oficial ETEC
            </span>
            <span id="player-progress-text" class="text-xs font-bold text-slate-500">
              Questão 1 de 50 • 2% Concluído
            </span>
          </div>

          <!-- Cronômetro & Ações -->
          <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <!-- Timer -->
            <div class="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-slate-800 font-mono font-black text-lg border border-slate-200">
              <i class="far fa-clock text-slate-400"></i>
              <span id="exam-timer-display">03:59:59</span>
            </div>

            <!-- Botão Entregar -->
            <button id="btn-submit-exam" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
              <i class="fas fa-paper-plane"></i> Finalizar Prova
            </button>
          </div>
        </div>

        <!-- Grid Principal da Prova (Questão + Cartão de Respostas) -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <!-- Coluna 1 a 3: Área da Questão Atual -->
          <div class="lg:col-span-3 space-y-6">
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10">
              
              <!-- Meta da Questão -->
              <div class="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div class="flex items-center gap-2 flex-wrap">
                  <span id="q-subject-badge" class="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    Matemática
                  </span>
                  <span id="q-topic-badge" class="text-xs font-bold text-slate-500">
                    Geometria Plana
                  </span>
                </div>
                <button id="btn-flag-review" class="text-xs font-bold text-slate-400 hover:text-amber-500 flex items-center gap-1.5 transition-colors">
                  <i class="far fa-flag"></i> <span>Marcar para Revisar</span>
                </button>
              </div>

              <!-- Número e Enunciado -->
              <div class="mb-8">
                <span id="q-number-title" class="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Questão 01 de 50</span>
                <p id="q-statement-text" class="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
                  Carregando questão...
                </p>
              </div>

              <!-- Imagem da Questão (Se houver) -->
              <div id="q-image-container" class="hidden mb-8 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <img id="q-image" src="" alt="Gráfico da questão" class="max-h-64 mx-auto rounded-lg shadow-sm">
              </div>

              <!-- Alternativas Interativas -->
              <div id="q-options-container" class="space-y-3 mb-8">
                <!-- Injetado via JS -->
              </div>

              <!-- Barra de Navegação Inferior -->
              <div class="flex justify-between items-center pt-6 border-t border-slate-100">
                <button id="btn-prev-question" class="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <i class="fas fa-chevron-left"></i> Anterior
                </button>
                <span id="q-status-indicator" class="text-xs font-semibold text-slate-400">
                  Não respondida
                </span>
                <button id="btn-next-question" class="px-6 py-3 rounded-xl bg-black text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
                  Próxima <i class="fas fa-chevron-right"></i>
                </button>
              </div>

            </div>
          </div>

          <!-- Coluna 4: Cartão-Resposta e Navegação Rápida (1 a 50) -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sticky top-28">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <i class="fas fa-grip text-slate-400"></i> Cartão-Resposta
                </h4>
                <span id="answers-counter" class="text-xs font-bold text-slate-500">0 / 50</span>
              </div>

              <!-- Legenda -->
              <div class="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-slate-900 inline-block"></span> Feita</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Dúvida</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-slate-200 inline-block"></span> Em branco</span>
              </div>

              <!-- Grade de 50 Questões -->
              <div id="grid-answer-sheet" class="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto p-1.5 custom-scrollbar">
                <!-- 50 botões gerados via JS -->
              </div>
            </div>
          </div>

        </div>

      </div>
    `;
  }
}

customElements.define('simulado-player', SimuladoPlayer);
