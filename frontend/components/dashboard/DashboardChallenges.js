class DashboardChallenges extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="space-y-8 animate-fade-in">
        
        <!-- Banner de Gamificação & Nível -->
        <div class="bg-slate-900 text-white p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-xl">
          <div class="absolute -right-16 -top-16 w-80 h-80 bg-purple-600 rounded-full blur-[100px] opacity-30"></div>
          <div class="absolute -left-16 -bottom-16 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>

          <div class="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Temporada Vestibulinho 2026
                </span>
                <span class="text-xs text-slate-400 font-bold">• Nível 5: Aspirante ETEC</span>
              </div>
              <h2 class="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Central de Missões & XP</h2>
              <p class="text-slate-300 text-xs md:text-sm max-w-xl">Cumpra os desafios para acelerar sua pontuação, subir de nível e desbloquear simulados avançados.</p>
            </div>

            <!-- Progresso de Nível -->
            <div class="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl backdrop-blur-md w-full lg:w-80 shrink-0">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5"><i class="fas fa-bolt text-yellow-400"></i> Progresso do Nível</span>
                <span class="text-xs font-black text-white">1.250 / 2.000 XP</span>
              </div>
              <div class="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden mb-2">
                <div class="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-1000" style="width: 62.5%;"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>Nível 5</span>
                <span class="text-purple-300">Faltam 750 XP p/ Nível 6</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Seletor de Categorias de Desafios -->
        <div class="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto custom-scrollbar">
          <button id="btn-challenge-daily" class="challenge-category-btn px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-black text-white shadow-sm flex items-center gap-2" data-category="daily">
            <i class="fas fa-calendar-day text-yellow-400"></i> Missões Diárias <span class="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full">3</span>
          </button>
          <button id="btn-challenge-weekly" class="challenge-category-btn px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-slate-900 bg-white border border-slate-200 flex items-center gap-2" data-category="weekly">
            <i class="fas fa-trophy text-purple-500"></i> Desafios Semanais <span class="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full">2</span>
          </button>
          <button id="btn-challenge-achievements" class="challenge-category-btn px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-slate-900 bg-white border border-slate-200 flex items-center gap-2" data-category="achievements">
            <i class="fas fa-medal text-amber-500"></i> Conquistas Lendárias <span class="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full">4</span>
          </button>
        </div>

        <!-- CONTEÚDO 1: MISSÕES DIÁRIAS -->
        <div id="section-challenges-daily" class="space-y-4 animate-fade-in">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Missões de Hoje</h3>
            <span class="text-xs text-slate-400 font-medium flex items-center gap-1"><i class="far fa-clock"></i> Reseta em 08h 35m</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Missão 1: Concluída -->
            <div class="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div class="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-bl-lg uppercase">
                Concluído
              </div>
              <div>
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-4">
                  <i class="fas fa-fire"></i>
                </div>
                <h4 class="font-bold text-slate-900 text-sm mb-1">Manter a Ofensiva</h4>
                <p class="text-xs text-slate-500 mb-4">Entre no app e resolva ao menos 1 questão hoje.</p>
                <div class="space-y-1 mb-4">
                  <div class="flex justify-between text-[11px] font-bold">
                    <span class="text-slate-600">Progresso</span>
                    <span class="text-emerald-600">1 / 1</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-1.5"><div class="bg-emerald-500 h-full rounded-full" style="width: 100%"></div></div>
                </div>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-yellow-600 flex items-center gap-1"><i class="fas fa-bolt"></i> +100 XP</span>
                <span class="text-xs font-bold text-emerald-600 flex items-center gap-1"><i class="fas fa-check"></i> Resgatado</span>
              </div>
            </div>

            <!-- Missão 2: Em andamento -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-black transition-colors">
              <div>
                <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg mb-4">
                  <i class="fas fa-calculator"></i>
                </div>
                <h4 class="font-bold text-slate-900 text-sm mb-1">Treino de Exatas</h4>
                <p class="text-xs text-slate-500 mb-4">Acerte 5 questões de Matemática ou Física.</p>
                <div class="space-y-1 mb-4">
                  <div class="flex justify-between text-[11px] font-bold">
                    <span class="text-slate-600">Progresso</span>
                    <span class="text-blue-600">3 / 5</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-1.5"><div class="bg-blue-500 h-full rounded-full" style="width: 60%"></div></div>
                </div>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-yellow-600 flex items-center gap-1"><i class="fas fa-bolt"></i> +250 XP</span>
                <a href="../telaSimulado/index.html" class="text-xs font-bold text-black hover:underline flex items-center gap-1">
                  Resolver <i class="fas fa-arrow-right text-[10px]"></i>
                </a>
              </div>
            </div>

            <!-- Missão 3: Em andamento -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-black transition-colors">
              <div>
                <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg mb-4">
                  <i class="fas fa-rotate-left"></i>
                </div>
                <h4 class="font-bold text-slate-900 text-sm mb-1">Superar o Passado</h4>
                <p class="text-xs text-slate-500 mb-4">Revise 2 resoluções do seu Caderno de Erros.</p>
                <div class="space-y-1 mb-4">
                  <div class="flex justify-between text-[11px] font-bold">
                    <span class="text-slate-600">Progresso</span>
                    <span class="text-rose-600">0 / 2</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-1.5"><div class="bg-rose-500 h-full rounded-full" style="width: 0%"></div></div>
                </div>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-yellow-600 flex items-center gap-1"><i class="fas fa-bolt"></i> +150 XP</span>
                <a href="../telaResolucoes/index.html" class="text-xs font-bold text-black hover:underline flex items-center gap-1">
                  Revisar <i class="fas fa-arrow-right text-[10px]"></i>
                </a>
              </div>
            </div>

          </div>
        </div>

        <!-- CONTEÚDO 2: DESAFIOS SEMANAIS -->
        <div id="section-challenges-weekly" class="space-y-4 animate-fade-in hidden">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Desafios da Semana</h3>
            <span class="text-xs text-slate-400 font-medium flex items-center gap-1"><i class="far fa-calendar"></i> Reseta no Domingo</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Semanal 1 -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div class="flex items-start gap-4 mb-4">
                <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shrink-0">
                  <i class="fas fa-chess-knight"></i>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <h4 class="font-bold text-slate-900 text-base">Maratona ETEC: 50 Questões</h4>
                    <span class="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">+500 XP</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">Complete um Simulado Oficial ETEC inteiro (50 questões) durante a semana.</p>
                </div>
              </div>

              <div class="space-y-1 mb-4">
                <div class="flex justify-between text-xs font-bold">
                  <span class="text-slate-600">Progresso</span>
                  <span class="text-purple-600">32 / 50 questões (64%)</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2"><div class="bg-purple-600 h-full rounded-full" style="width: 64%"></div></div>
              </div>

              <a href="../telaSimulado/index.html" class="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl text-center transition-colors">
                Continuar Simulado
              </a>
            </div>

            <!-- Semanal 2 -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div class="flex items-start gap-4 mb-4">
                <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0">
                  <i class="fas fa-crown"></i>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <h4 class="font-bold text-slate-900 text-base">Mestre da Interpretação</h4>
                    <span class="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">+400 XP</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">Acerte 85% ou mais em 3 simulados de Português e Humanas.</p>
                </div>
              </div>

              <div class="space-y-1 mb-4">
                <div class="flex justify-between text-xs font-bold">
                  <span class="text-slate-600">Progresso</span>
                  <span class="text-amber-600">2 / 3 simulados (66%)</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2"><div class="bg-amber-500 h-full rounded-full" style="width: 66%"></div></div>
              </div>

              <a href="../telaInterpretacao/index.html" class="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl text-center transition-colors">
                Treinar Interpretação
              </a>
            </div>

          </div>
        </div>

        <!-- CONTEÚDO 3: CONQUISTAS LENDÁRIAS (BADGES) -->
        <div id="section-challenges-achievements" class="space-y-4 animate-fade-in hidden">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Hall de Conquistas Vitalícias</h3>
            <span class="text-xs text-slate-400 font-medium">4 de 12 Desbloqueadas</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <!-- Badge 1: Desbloqueado -->
            <div class="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm text-center flex flex-col items-center justify-between group hover:shadow-md transition-all">
              <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-3 shadow-inner">
                🥇
              </div>
              <h4 class="font-bold text-slate-900 text-xs mb-1">Primeiro Passo</h4>
              <p class="text-[10px] text-slate-500 mb-2">Fazer seu 1º simulado completo</p>
              <span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">Conquistado</span>
            </div>

            <!-- Badge 2: Desbloqueado -->
            <div class="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm text-center flex flex-col items-center justify-between group hover:shadow-md transition-all">
              <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-3 shadow-inner">
                🔥
              </div>
              <h4 class="font-bold text-slate-900 text-xs mb-1">Foco Inabalável</h4>
              <p class="text-[10px] text-slate-500 mb-2">Alcançar 3 dias de ofensiva</p>
              <span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">Conquistado</span>
            </div>

            <!-- Badge 3: Bloqueado -->
            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-between opacity-60">
              <div class="w-14 h-14 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center text-2xl mb-3">
                <i class="fas fa-lock text-sm"></i>
              </div>
              <h4 class="font-bold text-slate-700 text-xs mb-1">Centurião</h4>
              <p class="text-[10px] text-slate-400 mb-2">Resolver 100 questões (45/100)</p>
              <span class="text-[9px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase">Bloqueado</span>
            </div>

            <!-- Badge 4: Bloqueado -->
            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-between opacity-60">
              <div class="w-14 h-14 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center text-2xl mb-3">
                <i class="fas fa-lock text-sm"></i>
              </div>
              <h4 class="font-bold text-slate-700 text-xs mb-1">Gênio do Pace</h4>
              <p class="text-[10px] text-slate-400 mb-2">Média menor que 2m por questão</p>
              <span class="text-[9px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase">Bloqueado</span>
            </div>

          </div>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const btns = this.querySelectorAll('.challenge-category-btn');
    const secDaily = this.querySelector('#section-challenges-daily');
    const secWeekly = this.querySelector('#section-challenges-weekly');
    const secAchievements = this.querySelector('#section-challenges-achievements');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => {
          b.className = 'challenge-category-btn px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-slate-900 bg-white border border-slate-200 flex items-center gap-2';
        });
        btn.className = 'challenge-category-btn px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-black text-white shadow-sm flex items-center gap-2';

        const cat = btn.getAttribute('data-category');
        if (secDaily) secDaily.classList.add('hidden');
        if (secWeekly) secWeekly.classList.add('hidden');
        if (secAchievements) secAchievements.classList.add('hidden');

        if (cat === 'daily' && secDaily) secDaily.classList.remove('hidden');
        if (cat === 'weekly' && secWeekly) secWeekly.classList.remove('hidden');
        if (cat === 'achievements' && secAchievements) secAchievements.classList.remove('hidden');
      });
    });
  }
}

customElements.define('dashboard-challenges', DashboardChallenges);
