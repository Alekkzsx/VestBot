class PrioridadeAnalitica extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6">
          <div>
            <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <i class="fas fa-arrow-trend-up text-purple-600"></i> Matriz de Prioridade: Onde Ganhar Pontos Rápido
            </h3>
            <p class="text-slate-500 text-xs mt-1">Cruzamento do peso da matéria no vestibulinho com a sua facilidade de recuperação.</p>
          </div>
          <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            Baseado no Vestibulinho ETEC
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Prioridade 1: Máximo Retorno (Fácil Ganho) -->
          <div class="bg-gradient-to-b from-emerald-50/60 to-white p-6 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Prioridade 1
            </div>
            <div>
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-4">
                <i class="fas fa-trophy"></i>
              </div>
              <h4 class="text-base font-bold text-slate-900 mb-1">Geometria Plana & Áreas</h4>
              <p class="text-xs text-slate-500 mb-4">Matemática • 4 a 5 questões por prova</p>
              
              <div class="space-y-2 text-xs">
                <div class="flex justify-between font-medium"><span class="text-slate-600">Seu acerto atual:</span> <span class="font-bold text-rose-500">35%</span></div>
                <div class="flex justify-between font-medium"><span class="text-slate-600">Ganho estimado na nota:</span> <span class="font-bold text-emerald-600">+2.5 pts</span></div>
                <div class="flex justify-between font-medium"><span class="text-slate-600">Dificuldade de correção:</span> <span class="font-bold text-slate-700">Baixa (Fórmulas diretas)</span></div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-emerald-100 flex items-center justify-between">
              <span class="text-[11px] font-bold text-emerald-700">Retorno Rápido</span>
              <a href="../telaAulas/index.html" class="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                Estudar Agora <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <!-- Prioridade 2: Médio Retorno -->
          <div class="bg-gradient-to-b from-blue-50/60 to-white p-6 rounded-2xl border border-blue-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Prioridade 2
            </div>
            <div>
              <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg mb-4">
                <i class="fas fa-bolt"></i>
              </div>
              <h4 class="text-base font-bold text-slate-900 mb-1">Interpretação e Inferência</h4>
              <p class="text-xs text-slate-500 mb-4">Português • 8 a 10 questões por prova</p>
              
              <div class="space-y-2 text-xs">
                <div class="flex justify-between font-medium"><span class="text-slate-600">Seu acerto atual:</span> <span class="font-bold text-amber-500">65%</span></div>
                <div class="flex justify-between font-medium"><span class="text-slate-600">Ganho estimado na nota:</span> <span class="font-bold text-blue-600">+2.0 pts</span></div>
                <div class="flex justify-between font-medium"><span class="text-slate-600">Dificuldade de correção:</span> <span class="font-bold text-slate-700">Média (Pace e Leitura)</span></div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-blue-100 flex items-center justify-between">
              <span class="text-[11px] font-bold text-blue-700">Consolidação</span>
              <a href="../telaInterpretacao/index.html" class="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1">
                Treinar Leitura <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <!-- Prioridade 3: Retorno Estratégico -->
          <div class="bg-gradient-to-b from-purple-50/60 to-white p-6 rounded-2xl border border-purple-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Prioridade 3
            </div>
            <div>
              <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg mb-4">
                <i class="fas fa-microscope"></i>
              </div>
              <h4 class="text-base font-bold text-slate-900 mb-1">Ecologia & Meio Ambiente</h4>
              <p class="text-xs text-slate-500 mb-4">Ciências da Natureza • 3 a 4 questões</p>
              
              <div class="space-y-2 text-xs">
                <div class="flex justify-between font-medium"><span class="text-slate-600">Seu acerto atual:</span> <span class="font-bold text-amber-500">55%</span></div>
                <div class="flex justify-between font-medium"><span class="text-slate-600">Ganho estimado na nota:</span> <span class="font-bold text-purple-600">+1.5 pts</span></div>
                <div class="flex justify-between font-medium"><span class="text-slate-600">Dificuldade de correção:</span> <span class="font-bold text-slate-700">Baixa (Conceitual)</span></div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between">
              <span class="text-[11px] font-bold text-purple-700">Ajuste Fino</span>
              <a href="../telaSimulado/index.html" class="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1">
                Fazer Simulado <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

        </div>

      </div>
    `;
  }
}

customElements.define('prioridade-analitica', PrioridadeAnalitica);
if (!customElements.get('analytics-priority')) {
  customElements.define('analytics-priority', class extends PrioridadeAnalitica {});
}
