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
                <span id="ch-user-level-badge" class="text-xs text-slate-400 font-bold">• Nível 1: Iniciante</span>
              </div>
              <h2 class="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Central de Missões & XP</h2>
              <p class="text-slate-300 text-xs md:text-sm max-w-xl">Cumpra os desafios para acelerar sua pontuação, subir de nível e desbloquear simulados avançados.</p>
            </div>

            <!-- Progresso de Nível -->
            <div class="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl backdrop-blur-md w-full lg:w-80 shrink-0">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5"><i class="fas fa-bolt text-yellow-400"></i> Progresso do Nível</span>
                <span id="ch-xp-display" class="text-xs font-black text-white">0 / 500 XP</span>
              </div>
              <div class="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden mb-2">
                <div id="ch-xp-bar" class="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-1000" style="width: 0%;"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-400 font-bold">
                <span id="ch-level-current">Nível 1</span>
                <span id="ch-level-needed" class="text-purple-300">Faltam 500 XP p/ Nível 2</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Seletor de Categorias de Desafios -->
        <div class="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto custom-scrollbar">
          <button id="btn-challenge-daily" class="challenge-category-btn px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-black text-white shadow-sm flex items-center gap-2" data-category="daily">
            <i class="fas fa-calendar-day text-yellow-400"></i> Missões Diárias <span id="count-daily-badge" class="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full">3</span>
          </button>
          <button id="btn-challenge-weekly" class="challenge-category-btn px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-slate-900 bg-white border border-slate-200 flex items-center gap-2" data-category="weekly">
            <i class="fas fa-trophy text-purple-500"></i> Desafios Semanais <span id="count-weekly-badge" class="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full">1</span>
          </button>
          <button id="btn-challenge-achievements" class="challenge-category-btn px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-slate-900 bg-white border border-slate-200 flex items-center gap-2" data-category="achievements">
            <i class="fas fa-medal text-amber-500"></i> Conquistas Lendárias <span id="count-badges-badge" class="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full">4</span>
          </button>
        </div>

        <!-- CONTEÚDO 1: MISSÕES DIÁRIAS -->
        <div id="section-challenges-daily" class="space-y-4 animate-fade-in">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Missões de Hoje</h3>
            <span class="text-xs text-slate-400 font-medium flex items-center gap-1"><i class="far fa-clock"></i> Reseta à meia-noite</span>
          </div>

          <div id="container-daily-missions" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Gerado via JS -->
          </div>
        </div>

        <!-- CONTEÚDO 2: DESAFIOS SEMANAIS -->
        <div id="section-challenges-weekly" class="space-y-4 animate-fade-in hidden">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Desafios da Semana</h3>
            <span class="text-xs text-slate-400 font-medium flex items-center gap-1"><i class="far fa-calendar"></i> Reseta no Domingo</span>
          </div>

          <div id="container-weekly-missions" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Gerado via JS -->
          </div>
        </div>

        <!-- CONTEÚDO 3: CONQUISTAS LENDÁRIAS (BADGES) -->
        <div id="section-challenges-achievements" class="space-y-4 animate-fade-in hidden">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Hall de Conquistas Vitalícias</h3>
            <span id="badges-unlocked-summary" class="text-xs text-slate-400 font-medium">0 de 4 Desbloqueadas</span>
          </div>

          <div id="container-badges-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <!-- Gerado via JS -->
          </div>
        </div>

      </div>
    `;

    this.attachEvents();
    this.loadChallengesData();
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

  async loadChallengesData() {
    const BACKEND_URL = 'http://localhost:3000';
    try {
      const res = await fetch(`${BACKEND_URL}/api/desafios/1`, { signal: AbortSignal.timeout(2500) });
      if (!res.ok) throw new Error('Servidor indisponível');
      const data = await res.json();
      this.renderChallenges(data);
    } catch (err) {
      console.warn('[CHALLENGES] Servidor offline. Calculando desafios no IndexedDB local...');
      const offlineChallenges = await this.calcularDesafiosOffline();
      this.renderChallenges(offlineChallenges);
    }
  }

  async calcularDesafiosOffline() {
    let localLogs = [];
    try {
      if (typeof db !== 'undefined' && db.logs_questoes) {
        localLogs = await db.logs_questoes.toArray();
      }
    } catch (e) {}

    const agora = new Date();
    const hojeStr = agora.toISOString().split('T')[0];

    const hojeLogs = localLogs.filter(l => {
      const d = new Date(l.data_resolucao || l.data_hora || Date.now());
      return d.toISOString().split('T')[0] === hojeStr;
    });

    const exatasHoje = hojeLogs.filter(l => {
      const q = (l.questao_id || '').toUpperCase();
      return (q.includes('MAT') || q.includes('FIS') || q.includes('QUI')) && (l.acertou === 1 || l.acertou === true);
    }).length;

    const semanaLogs = localLogs.filter(l => {
      const d = new Date(l.data_resolucao || l.data_hora || Date.now());
      return (agora - d) / (1000 * 60 * 60 * 24) <= 7;
    });

    const totalGeral = localLogs.length;

    return {
      diarias: [
        {
          id: 'daily-streak',
          titulo: 'Manter a Ofensiva',
          descricao: 'Entre no app e resolva ao menos 1 questão hoje.',
          icone: 'fa-fire',
          cor: 'emerald',
          progresso: Math.min(1, hojeLogs.length),
          meta: 1,
          concluido: hojeLogs.length >= 1,
          recompensaXp: 100
        },
        {
          id: 'daily-exatas',
          titulo: 'Treino de Exatas',
          descricao: 'Acerte 5 questões de Matemática, Física ou Química.',
          icone: 'fa-calculator',
          cor: 'blue',
          progresso: Math.min(5, exatasHoje),
          meta: 5,
          concluido: exatasHoje >= 5,
          recompensaXp: 250
        },
        {
          id: 'daily-erros',
          titulo: 'Superar o Passado',
          descricao: 'Resolva 2 questões com acerto para consolidar a matéria.',
          icone: 'fa-rotate-left',
          cor: 'rose',
          progresso: Math.min(2, hojeLogs.filter(l => l.acertou).length),
          meta: 2,
          concluido: hojeLogs.filter(l => l.acertou).length >= 2,
          recompensaXp: 150
        }
      ],
      semanais: [
        {
          id: 'weekly-maratona',
          titulo: 'Maratona ETEC: 50 Questões',
          descricao: 'Resolva 50 questões durante a semana.',
          icone: 'fa-chess-knight',
          cor: 'purple',
          progresso: Math.min(50, semanaLogs.length),
          meta: 50,
          concluido: semanaLogs.length >= 50,
          recompensaXp: 500
        }
      ],
      badges: [
        {
          id: 'badge-primeiro-passo',
          titulo: 'Primeiro Passo',
          descricao: 'Fazer sua primeira questão',
          emoji: '🥇',
          conquistado: totalGeral >= 1,
          progressoTexto: `${Math.min(1, totalGeral)}/1`
        },
        {
          id: 'badge-foco',
          titulo: 'Foco Inabalável',
          descricao: 'Alcançar 3 dias de ofensiva',
          emoji: '🔥',
          conquistado: totalGeral >= 3,
          progressoTexto: `${Math.min(3, totalGeral)}/3 dias`
        },
        {
          id: 'badge-centuriao',
          titulo: 'Centurião',
          descricao: 'Resolver 100 questões',
          emoji: '🛡️',
          conquistado: totalGeral >= 100,
          progressoTexto: `${Math.min(100, totalGeral)}/100`
        },
        {
          id: 'badge-pace',
          titulo: 'Gênio do Pace',
          descricao: 'Média menor que 2m por questão',
          emoji: '⚡',
          conquistado: false,
          progressoTexto: '--'
        }
      ]
    };
  }

  renderChallenges(data) {
    if (!data) return;

    // 1. Diárias
    const dailyContainer = this.querySelector('#container-daily-missions');
    if (dailyContainer && data.diarias) {
      dailyContainer.innerHTML = '';
      data.diarias.forEach(m => {
        const pct = Math.min(100, Math.round((m.progresso / m.meta) * 100));
        const cardBorder = m.concluido ? 'border-emerald-200' : 'border-slate-200 hover:border-black';
        const cardBadge = m.concluido 
          ? `<div class="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-bl-lg uppercase">Concluído</div>` 
          : '';

        const actionText = m.concluido 
          ? `<span class="text-xs font-bold text-emerald-600 flex items-center gap-1"><i class="fas fa-check"></i> Resgatado</span>`
          : `<a href="../telaSimulado/index.html" class="text-xs font-bold text-black hover:underline flex items-center gap-1">Resolver <i class="fas fa-arrow-right text-[10px]"></i></a>`;

        const el = document.createElement('div');
        el.className = `bg-white p-6 rounded-2xl border ${cardBorder} shadow-sm flex flex-col justify-between relative overflow-hidden group transition-colors`;
        el.innerHTML = `
          ${cardBadge}
          <div>
            <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg mb-4">
              <i class="fas ${m.icone}"></i>
            </div>
            <h4 class="font-bold text-slate-900 text-sm mb-1">${m.titulo}</h4>
            <p class="text-xs text-slate-500 mb-4">${m.descricao}</p>
            <div class="space-y-1 mb-4">
              <div class="flex justify-between text-[11px] font-bold">
                <span class="text-slate-600">Progresso</span>
                <span class="${m.concluido ? 'text-emerald-600' : 'text-slate-800'}">${m.progresso} / ${m.meta}</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div class="bg-black h-full rounded-full transition-all duration-700" style="width: ${pct}%"></div>
              </div>
            </div>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-bold text-yellow-600 flex items-center gap-1"><i class="fas fa-bolt"></i> +${m.recompensaXp} XP</span>
            ${actionText}
          </div>
        `;
        dailyContainer.appendChild(el);
      });
    }

    // 2. Semanais
    const weeklyContainer = this.querySelector('#container-weekly-missions');
    if (weeklyContainer && data.semanais) {
      weeklyContainer.innerHTML = '';
      data.semanais.forEach(w => {
        const pct = Math.min(100, Math.round((w.progresso / w.meta) * 100));
        const el = document.createElement('div');
        el.className = 'bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between';
        el.innerHTML = `
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shrink-0">
              <i class="fas ${w.icone}"></i>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h4 class="font-bold text-slate-900 text-base">${w.titulo}</h4>
                <span class="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">+${w.recompensaXp} XP</span>
              </div>
              <p class="text-xs text-slate-500 mt-1">${w.descricao}</p>
            </div>
          </div>

          <div class="space-y-1 mb-4">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-slate-600">Progresso</span>
              <span class="text-purple-600">${w.progresso} / ${w.meta} (${pct}%)</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="bg-purple-600 h-full rounded-full transition-all duration-700" style="width: ${pct}%"></div>
            </div>
          </div>

          <a href="../telaSimulado/index.html" class="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl text-center transition-colors">
            Ir para o Simulado
          </a>
        `;
        weeklyContainer.appendChild(el);
      });
    }

    // 3. Badges
    const badgesContainer = this.querySelector('#container-badges-grid');
    const badgesSummary = this.querySelector('#badges-unlocked-summary');
    if (badgesContainer && data.badges) {
      badgesContainer.innerHTML = '';
      const unlockedCount = data.badges.filter(b => b.conquistado).length;
      if (badgesSummary) badgesSummary.textContent = `${unlockedCount} de ${data.badges.length} Desbloqueadas`;

      data.badges.forEach(b => {
        const el = document.createElement('div');
        if (b.conquistado) {
          el.className = 'bg-white p-6 rounded-2xl border border-amber-200 shadow-sm text-center flex flex-col items-center justify-between group hover:shadow-md transition-all';
          el.innerHTML = `
            <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-3 shadow-inner">
              ${b.emoji}
            </div>
            <h4 class="font-bold text-slate-900 text-xs mb-1">${b.titulo}</h4>
            <p class="text-[10px] text-slate-500 mb-2">${b.descricao}</p>
            <span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">Conquistado</span>
          `;
        } else {
          el.className = 'bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-between opacity-60';
          el.innerHTML = `
            <div class="w-14 h-14 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center text-2xl mb-3">
              <i class="fas fa-lock text-sm"></i>
            </div>
            <h4 class="font-bold text-slate-700 text-xs mb-1">${b.titulo}</h4>
            <p class="text-[10px] text-slate-400 mb-2">${b.descricao} (${b.progressoTexto})</p>
            <span class="text-[9px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase">Bloqueado</span>
          `;
        }
        badgesContainer.appendChild(el);
      });
    }
  }
}

customElements.define('dashboard-challenges', DashboardChallenges);
