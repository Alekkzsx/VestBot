document.addEventListener('DOMContentLoaded', () => {
  const URL_BACKEND = 'http://localhost:3000';
  let periodoAtual = '7d';
  let disciplinaAtual = 'all';

  // ==========================================
  // 1. CONTAGEM REGRESSIVA DE PROVAS
  // ==========================================
  const dataEtec = new Date('2026-12-06T13:30:00');
  const dataIfsp = new Date('2026-11-29T13:30:00');
  
  const timerEtecEl = document.getElementById('timer-countdown-etec');
  const timerIfspEl = document.getElementById('timer-countdown-ifsp');

  function calcularDias(dataAlvo) {
    const agora = new Date().getTime();
    const distancia = dataAlvo.getTime() - agora;
    if (distancia < 0) return 0;
    return Math.floor(distancia / (1000 * 60 * 60 * 24));
  }

  function atualizarContadores() {
    if (timerEtecEl) timerEtecEl.textContent = calcularDias(dataEtec);
    if (timerIfspEl) timerIfspEl.textContent = calcularDias(dataIfsp);
  }

  setInterval(atualizarContadores, 1000);
  atualizarContadores();

  // ==========================================
  // 2. NAVEGAÇÃO POR ABAS (Resumo vs Desafios)
  // ==========================================
  const tabResumo = document.getElementById('btn-tab-resumo');
  const tabDesafios = document.getElementById('btn-tab-desafios');
  const viewResumo = document.getElementById('view-resumo');
  const viewDesafios = document.getElementById('view-desafios');

  if (tabResumo && tabDesafios && viewResumo && viewDesafios) {
    function setAbaAtiva(aba) {
      if (aba === 'resumo') {
        tabResumo.className = 'px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 bg-black text-white shadow-sm';
        tabDesafios.className = 'px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 relative text-slate-500 hover:bg-slate-50';
        viewResumo.classList.remove('hidden');
        viewDesafios.classList.add('hidden');
      } else {
        tabDesafios.className = 'px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 relative bg-black text-white shadow-sm';
        tabResumo.className = 'px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 text-slate-500 hover:bg-slate-50';
        viewDesafios.classList.remove('hidden');
        viewResumo.classList.add('hidden');

        const desafiosComp = document.querySelector('desafios-painel') || document.querySelector('dashboard-challenges');
        if (desafiosComp && typeof desafiosComp.loadChallengesData === 'function') {
          desafiosComp.loadChallengesData();
        }
      }
    }
    tabResumo.addEventListener('click', () => setAbaAtiva('resumo'));
    tabDesafios.addEventListener('click', () => setAbaAtiva('desafios'));
  }

  // ==========================================
  // 3. GERENCIAMENTO DE FILTROS DO PAINEL
  // ==========================================
  const botoesPeriodo = document.querySelectorAll('.filter-period-btn');
  const selectDisciplina = document.getElementById('filter-discipline-select');
  const btnRecarregar = document.getElementById('btn-refresh-dashboard');
  const statusOrigemEl = document.getElementById('dashboard-source-status');

  botoesPeriodo.forEach(btn => {
    btn.addEventListener('click', () => {
      botoesPeriodo.forEach(b => {
        b.className = 'filter-period-btn px-3 py-1.5 rounded-lg transition-all text-slate-500 hover:text-black';
      });
      btn.className = 'filter-period-btn px-3 py-1.5 rounded-lg transition-all bg-black text-white shadow-sm';
      periodoAtual = btn.getAttribute('data-period') || '7d';
      carregarDadosPainel();
    });
  });

  if (selectDisciplina) {
    selectDisciplina.addEventListener('change', (e) => {
      disciplinaAtual = e.target.value;
      carregarDadosPainel();
    });
  }

  if (btnRecarregar) {
    btnRecarregar.addEventListener('click', () => {
      const icone = btnRecarregar.querySelector('i');
      if (icone) icone.classList.add('fa-spin');
      carregarDadosPainel().finally(() => {
        setTimeout(() => { if (icone) icone.classList.remove('fa-spin'); }, 500);
      });
    });
  }

  function inferirDisciplinaLocal(questaoId) {
    if (!questaoId) return 'Geral';
    const q = questaoId.toUpperCase();
    if (q.includes('PORT') || q.includes('LING')) return 'Português';
    if (q.includes('MAT') || q.includes('GEOM')) return 'Matemática';
    if (q.includes('BIO') || q.includes('ECO')) return 'Biologia';
    if (q.includes('FIS') || q.includes('OND')) return 'Física';
    if (q.includes('QUI') || q.includes('REA')) return 'Química';
    if (q.includes('HIST') || q.includes('VARGAS')) return 'História';
    if (q.includes('GEO') || q.includes('BIOMA')) return 'Geografia';
    return 'Geral';
  }

  // ==========================================
  // 4. MOTOR DE DADOS: ONLINE COM FALLBACK OFFLINE
  // ==========================================
  async function carregarDadosPainel() {
    try {
      const res = await fetch(`${URL_BACKEND}/api/dashboard/1?periodo=${periodoAtual}&disciplina=${disciplinaAtual}`, {
        signal: AbortSignal.timeout(3000)
      });

      if (!res.ok) throw new Error('Falha na resposta do servidor');

      const data = await res.json();
      atualizarStatusOrigem(true);
      renderizarPainel(data);

    } catch (err) {
      console.warn('[PAINEL] Servidor offline. Alternando para cálculo local via Dexie.js:', err.message);
      atualizarStatusOrigem(false);
      const dadosOffline = await calcularDadosOffline(periodoAtual, disciplinaAtual);
      renderizarPainel(dadosOffline);
    }
  }

  function atualizarStatusOrigem(isOnline) {
    if (!statusOrigemEl) return;
    if (isOnline) {
      statusOrigemEl.className = 'text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1';
      statusOrigemEl.innerHTML = `<i class="fas fa-database text-emerald-600"></i> Nave-Mãe (Online)`;
    } else {
      statusOrigemEl.className = 'text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1';
      statusOrigemEl.innerHTML = `<i class="fas fa-campground text-amber-600"></i> Modo Acampamento (Local)`;
    }
  }

  // ==========================================
  // 5. CÁLCULO OFFLINE (IndexedDB / Dexie.js)
  // ==========================================
  async function calcularDadosOffline(periodo, disciplina) {
    let localLogs = [];
    try {
      if (typeof db !== 'undefined' && db.logs_questoes) {
        localLogs = await db.logs_questoes.toArray();
      }
    } catch (e) {
      console.error('[OFFLINE] Erro ao ler Dexie:', e);
    }

    const agora = new Date();
    const hojeStr = agora.toISOString().split('T')[0];

    let logsFiltradosPorData = localLogs.filter(l => {
      const dataLog = new Date(l.data_resolucao || l.data_hora || Date.now());
      if (periodo === 'hoje') {
        return dataLog.toISOString().split('T')[0] === hojeStr;
      } else if (periodo === '7d') {
        const diffDias = (agora - dataLog) / (1000 * 60 * 60 * 24);
        return diffDias <= 7;
      } else if (periodo === '30d') {
        const diffDias = (agora - dataLog) / (1000 * 60 * 60 * 24);
        return diffDias <= 30;
      }
      return true;
    });

    let logsFinais = disciplina === 'all' 
      ? logsFiltradosPorData 
      : logsFiltradosPorData.filter(l => inferirDisciplinaLocal(l.questao_id) === disciplina);

    const totalQuestoes = logsFinais.length;
    const acertos = logsFinais.filter(l => l.acertou === 1 || l.acertou === true).length;
    const erros = totalQuestoes - acertos;
    const acuracia = totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : 0;

    const xpTotal = (acertos * 15) + (erros * 5);
    const nivel = Math.max(1, Math.floor(xpTotal / 500) + 1);
    const xpNoNivel = xpTotal % 500;
    const xpMetaNivel = 500;
    const nivelPercentual = Math.round((xpNoNivel / xpMetaNivel) * 100);

    const diasSemanaNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const frequenciaUltimos7Dias = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(agora.getDate() - i);
      const dataStr = d.toISOString().split('T')[0];
      const diaLabel = diasSemanaNomes[d.getDay()];

      const count = localLogs.filter(l => {
        const dataLog = new Date(l.data_resolucao || l.data_hora || Date.now()).toISOString().split('T')[0];
        return dataLog === dataStr;
      }).length;

      frequenciaUltimos7Dias.push({ dia: diaLabel, data: dataStr, count });
    }
    const maxF = Math.max(...frequenciaUltimos7Dias.map(f => f.count), 1);
    frequenciaUltimos7Dias.forEach(f => {
      f.percent = f.count > 0 ? Math.max(20, Math.round((f.count / maxF) * 100)) : 8;
    });

    const disciplinasBase = ['Português', 'Matemática', 'Biologia', 'Física', 'Química', 'História', 'Geografia'];
    const focoMap = {};
    disciplinasBase.forEach(d => focoMap[d] = { total: 0, acertos: 0 });

    logsFiltradosPorData.forEach(l => {
      const disc = inferirDisciplinaLocal(l.questao_id);
      if (!focoMap[disc]) focoMap[disc] = { total: 0, acertos: 0 };
      focoMap[disc].total++;
      if (l.acertou === 1 || l.acertou === true) focoMap[disc].acertos++;
    });

    const focoArray = Object.keys(focoMap).map(disc => {
      const info = focoMap[disc];
      const percent = totalQuestoes > 0 ? Math.round((info.total / totalQuestoes) * 100) : 0;
      const acuraciaDisc = info.total > 0 ? Math.round((info.acertos / info.total) * 100) : 0;
      return { disciplina: disc, total: info.total, acertos: info.acertos, percent, acuracia: acuraciaDisc };
    }).sort((a, b) => b.total - a.total);

    const atividadesRecentes = logsFinais.slice(-5).reverse().map((l, idx) => ({
      id: l.id || idx,
      questao_id: l.questao_id,
      disciplina: inferirDisciplinaLocal(l.questao_id),
      acertou: l.acertou === 1 || l.acertou === true,
      tempo_segundos: l.tempo_gasto || l.tempo_segundos || 60,
      alternativa_marcada: l.alternativa_marcada || 'A',
      data_hora: l.data_resolucao || l.data_hora || new Date().toISOString()
    }));

    return {
      usuario: {
        id: 1,
        nome: 'Estudante',
        nivel,
        xp: xpTotal,
        xpNoNivel,
        xpMetaNivel,
        nivelPercentual,
        streak: totalQuestoes > 0 ? 1 : 0
      },
      metricas: { totalQuestoes, acertos, erros, acuracia },
      frequenciaSemanal: frequenciaUltimos7Dias,
      focoDisciplinas: focoArray,
      atividadesRecentes,
      recomendacao: {
        disciplina: focoArray.find(f => f.acuracia < 60)?.disciplina || 'Interpretação & Exatas',
        motivo: 'Treino recomendado para equilíbrio das áreas',
        link: '../telaSimulado/index.html'
      }
    };
  }

  // ==========================================
  // 6. RENDERIZADOR DA INTERFACE
  // ==========================================
  function renderizarPainel(data) {
    if (!data) return;

    const u = data.usuario || { streak: 0, xp: 0, nivel: 1, nivelPercentual: 0 };
    const m = data.metricas || { totalQuestoes: 0, acertos: 0, acuracia: 0 };

    const streakEl = document.getElementById('dash-streak');
    const xpEl = document.getElementById('dash-xp');
    const accEl = document.getElementById('dash-accuracy');
    const totalEl = document.getElementById('dash-total-answered');

    if (streakEl) streakEl.textContent = `${u.streak} ${u.streak === 1 ? 'dia' : 'dias'}`;
    if (xpEl) xpEl.textContent = `${u.xp.toLocaleString()} XP`;
    if (accEl) accEl.textContent = `${m.acuracia}%`;
    if (totalEl) totalEl.textContent = `${m.totalQuestoes}`;

    const levelTitle = document.getElementById('dash-level-title');
    const levelRank = document.getElementById('dash-level-rank');
    const levelMeta = document.getElementById('dash-level-meta');
    const levelConic = document.getElementById('dash-level-conic');
    const levelPercent = document.getElementById('dash-level-percent');
    const levelCaption = document.getElementById('dash-level-caption');

    const ranks = ['Iniciante', 'Aspirante', 'Focado', 'Disciplinado', 'Competidor', 'Gabaritador', 'Mestre'];
    const rankName = ranks[Math.min(u.nivel - 1, ranks.length - 1)] || 'Aspirante';

    if (levelTitle) levelTitle.textContent = `Nível ${u.nivel}`;
    if (levelRank) levelRank.textContent = rankName;
    if (levelMeta) levelMeta.textContent = `META: NÍVEL ${u.nivel + 1}`;
    if (levelPercent) levelPercent.textContent = `${u.nivelPercentual}%`;
    if (levelConic) {
      levelConic.style.background = `conic-gradient(#0f172a 0% ${u.nivelPercentual}%, #f1f5f9 ${u.nivelPercentual}% 100%)`;
    }
    if (levelCaption) {
      const faltaXp = (u.xpMetaNivel || 500) - (u.xpNoNivel || 0);
      levelCaption.textContent = faltaXp > 0 ? `Faltam ${faltaXp} XP para o Nível ${u.nivel + 1}` : 'Parabéns pelo progresso!';
    }

    const recTitle = document.getElementById('rec-subject-title');
    const recReason = document.getElementById('rec-subject-reason');
    const recBtn = document.getElementById('rec-action-btn');

    if (data.recomendacao) {
      if (recTitle) recTitle.textContent = data.recomendacao.disciplina;
      if (recReason) recReason.textContent = data.recomendacao.motivo;
      if (recBtn) recBtn.href = data.recomendacao.link || '../telaSimulado/index.html';
    }

    const actList = document.getElementById('dash-activities-list');
    const actBadge = document.getElementById('dash-activities-count-badge');
    const actAcc = document.getElementById('dash-recent-accuracy');

    if (actBadge) actBadge.textContent = `${m.totalQuestoes} resoluç${m.totalQuestoes === 1 ? 'ão' : 'ões'}`;
    if (actAcc) actAcc.textContent = `${m.acuracia}%`;

    if (actList) {
      actList.innerHTML = '';
      if (!data.atividadesRecentes || data.atividadesRecentes.length === 0) {
        actList.innerHTML = `
          <div class="text-center py-10 text-slate-400 text-xs font-medium">
            Nenhuma resolução encontrada no período selecionado.<br>
            <a href="../telaSimulado/index.html" class="text-black font-bold underline mt-1 inline-block">Resolver uma questão agora</a>
          </div>
        `;
      } else {
        data.atividadesRecentes.forEach(act => {
          const isCorrect = act.acertou;
          const bgIcon = isCorrect ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200';
          const icon = isCorrect ? 'fa-check' : 'fa-xmark';
          
          let tempoTexto = act.tempo_segundos ? `${Math.floor(act.tempo_segundos / 60)}m ${act.tempo_segundos % 60}s` : '1m';

          const itemEl = document.createElement('div');
          itemEl.className = 'flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors';
          itemEl.innerHTML = `
            <div class="w-8 h-8 rounded-lg ${bgIcon} flex items-center justify-center text-xs font-bold mr-3 shrink-0">
              <i class="fas ${icon}"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-slate-900 truncate">${act.questao_id || 'Questão Avulsa'}</p>
              <p class="text-[10px] text-slate-400 font-medium">${act.disciplina} • Opção ${act.alternativa_marcada || 'A'}</p>
            </div>
            <div class="text-right shrink-0 ml-2">
              <span class="text-[10px] font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-500'} block">
                ${isCorrect ? '+15 XP' : '+5 XP'}
              </span>
              <span class="text-[9px] text-slate-400 font-medium">${tempoTexto}</span>
            </div>
          `;
          actList.appendChild(itemEl);
        });
      }
    }

    const freqBars = document.getElementById('dash-frequency-bars');
    if (freqBars && data.frequenciaSemanal) {
      freqBars.innerHTML = '';
      data.frequenciaSemanal.forEach((f, idx) => {
        const isToday = idx === data.frequenciaSemanal.length - 1;
        const barCol = document.createElement('div');
        barCol.className = 'flex flex-col items-center flex-1 h-full justify-end group cursor-pointer relative';
        
        const activeColor = isToday ? 'bg-black shadow-md' : 'bg-slate-800 group-hover:bg-black';

        barCol.innerHTML = `
          <div class="absolute -top-7 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow">
            ${f.count} ${f.count === 1 ? 'questão' : 'questões'}
          </div>
          <div class="w-full ${activeColor} rounded-t-md transition-all duration-500 relative" style="height: ${f.percent}%"></div>
          <span class="text-[10px] ${isToday ? 'text-black font-black' : 'text-slate-400 font-bold'} mt-2">${f.dia}</span>
        `;
        freqBars.appendChild(barCol);
      });
    }

    const focusList = document.getElementById('dash-focus-list');
    if (focusList && data.focoDisciplinas) {
      focusList.innerHTML = '';
      const subjectColors = {
        'Português': 'bg-rose-500',
        'Matemática': 'bg-blue-500',
        'Biologia': 'bg-emerald-500',
        'Física': 'bg-cyan-500',
        'Química': 'bg-teal-500',
        'História': 'bg-amber-500',
        'Geografia': 'bg-orange-500'
      };

      const items = data.focoDisciplinas.filter(f => f.total > 0);
      if (items.length === 0) {
        focusList.innerHTML = `
          <div class="text-center py-10 text-slate-400 text-xs">
            Nenhuma matéria estudada no período selecionado.
          </div>
        `;
      } else {
        items.forEach(item => {
          const colorClass = subjectColors[item.disciplina] || 'bg-slate-800';
          const el = document.createElement('div');
          el.innerHTML = `
            <div class="flex justify-between text-xs font-bold mb-1">
              <span class="text-slate-800 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full ${colorClass}"></span> ${item.disciplina}
              </span>
              <span class="text-slate-500 font-medium">${item.percent}% <span class="text-slate-400 text-[10px]">(${item.total}Q)</span></span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="${colorClass} h-2 rounded-full transition-all duration-700" style="width: ${item.percent}%"></div>
            </div>
          `;
          focusList.appendChild(el);
        });
      }
    }
  }

  // Inicializa
  carregarDadosPainel();
});
