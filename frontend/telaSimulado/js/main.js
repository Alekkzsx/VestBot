document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // BANCO DE QUESTÕES (7 DISCIPLINAS ETEC)
  // ==========================================
  const mockQuestionsPool = [
    {
      id: 'ETEC-PORT-01',
      disciplina: 'Português',
      assunto: 'Interpretação & Figuras',
      enunciado: 'No trecho: "O silêncio da noite gritava nos ouvidos do estudante cansado", o recurso estilístico empregado para conferir expressividade ao texto é classificado como:',
      alternativas: [
        { letra: 'A', texto: 'Eufemismo' },
        { letra: 'B', texto: 'Paradoxo / Oxímoro' },
        { letra: 'C', texto: 'Pleonasmo' },
        { letra: 'D', texto: 'Catacrese' },
        { letra: 'E', texto: 'Metonímia' }
      ],
      correta: 'B'
    },
    {
      id: 'ETEC-MAT-01',
      disciplina: 'Matemática',
      assunto: 'Áreas & Geometria Plana',
      enunciado: 'Um laboratório de informática de uma ETEC tem piso retangular medindo 8 metros de comprimento por 6 metros de largura. Para cobrir todo o piso com placas quadradas de 0,5 m de lado, a quantidade de placas necessárias será de:',
      alternativas: [
        { letra: 'A', texto: '96 placas' },
        { letra: 'B', texto: '144 placas' },
        { letra: 'C', texto: '192 placas' },
        { letra: 'D', texto: '240 placas' },
        { letra: 'E', texto: '320 placas' }
      ],
      correta: 'C'
    },
    {
      id: 'ETEC-BIO-01',
      disciplina: 'Biologia',
      assunto: 'Ecologia & Cadeia Trófica',
      enunciado: 'Em um ecossistema aquático, a proliferação excessiva de algas devido ao despejo de esgoto orgânico provoca a queda do oxigênio dissolvido na água e a mortandade de peixes. Esse fenômeno ambiental é denominado:',
      alternativas: [
        { letra: 'A', texto: 'Bioacumulação' },
        { letra: 'B', texto: 'Eutrofização' },
        { letra: 'C', texto: 'Magnificação trófica' },
        { letra: 'D', texto: 'Inversão térmica' },
        { letra: 'E', texto: 'Acidificação oceânica' }
      ],
      correta: 'B'
    },
    {
      id: 'ETEC-FIS-01',
      disciplina: 'Física',
      assunto: 'Cinemática & Velocidade Média',
      enunciado: 'Um trem da CPTM parte de Jundiaí com destino à estação Barra Funda, percorrendo uma distância de 60 km em exatamente 45 minutos. A velocidade escalar média desse trem durante o trajeto foi de:',
      alternativas: [
        { letra: 'A', texto: '60 km/h' },
        { letra: 'B', texto: '75 km/h' },
        { letra: 'C', texto: '80 km/h' },
        { letra: 'D', texto: '90 km/h' },
        { letra: 'E', texto: '100 km/h' }
      ],
      correta: 'C'
    },
    {
      id: 'ETEC-QUI-01',
      disciplina: 'Química',
      assunto: 'Transformações Químicas & Físicas',
      enunciado: 'Dentre as transformações cotidianas a seguir, assinale a única que representa exclusivamente um FENÔMENO QUÍMICO:',
      alternativas: [
        { letra: 'A', texto: 'Evaporação da água de uma piscina.' },
        { letra: 'B', texto: 'Dissolução de açúcar no café quente.' },
        { letra: 'C', texto: 'Queima da lenha em uma lareira.' },
        { letra: 'D', texto: 'Fusão de uma barra de chocolate ao sol.' },
        { letra: 'E', texto: 'Trituração de grãos de milho para farinha.' }
      ],
      correta: 'C'
    },
    {
      id: 'ETEC-HIST-01',
      disciplina: 'História',
      assunto: 'Era Vargas & Industrialização',
      enunciado: 'Durante o primeiro governo de Getúlio Vargas (1930-1945), o Brasil passou por uma intensa reestruturação econômica e trabalhista, destacando-se:',
      alternativas: [
        { letra: 'A', texto: 'A criação da CLT e a implantação da indústria de base nacional (CSN e Vale).' },
        { letra: 'B', texto: 'A privatização imediata de todas as ferrovias estaduais.' },
        { letra: 'C', texto: 'A proibição do voto feminino em todo o território nacional.' },
        { letra: 'D', texto: 'O alinhamento irrestrito com as potências do Eixo na Segunda Guerra.' },
        { letra: 'E', texto: 'A extinção do Ministério do Trabalho.' }
      ],
      correta: 'A'
    },
    {
      id: 'ETEC-GEO-01',
      disciplina: 'Geografia',
      assunto: 'Domínios Morfoclimáticos & Biomas',
      enunciado: 'O domínio morfoclimático brasileiro caracterizado por clima semiárido, rios intermitentes e vegetação adaptada à escassez hídrica com plantas xerófitas é a:',
      alternativas: [
        { letra: 'A', texto: 'Mata das Araucárias' },
        { letra: 'B', texto: 'Mares de Morros' },
        { letra: 'C', texto: 'Caatinga' },
        { letra: 'D', texto: 'Cerrado' },
        { letra: 'E', texto: 'Pradaria' }
      ],
      correta: 'C'
    }
  ];

  // Gera questões dinâmicas com suporte às 7 matérias
  function generateExamQuestions(total = 50, selectedSubjects = ['Português', 'Matemática', 'Biologia', 'Física', 'Química', 'História', 'Geografia'], difficulty = 'all') {
    const subjects = selectedSubjects.length > 0 ? selectedSubjects : ['Português', 'Matemática', 'Biologia', 'Física', 'Química', 'História', 'Geografia'];
    const topics = {
      'Português': ['Figuras de Linguagem', 'Concordância Verbal', 'Interpretação', 'Funções Sintáticas'],
      'Matemática': ['Equação de 2º Grau', 'Pitágoras', 'Porcentagem', 'Áreas e Volumes'],
      'Biologia': ['Ecologia', 'Genética', 'Citologia', 'Fisiologia'],
      'Física': ['Cinemática', 'Ondas & Som', 'Óptica', 'Termologia'],
      'Química': ['Fenômenos Químicos', 'Tabela Periódica', 'Ligações', 'Separação de Misturas'],
      'História': ['Era Vargas', 'Revolução Industrial', 'Brasil Colônia', 'Guerra Fria'],
      'Geografia': ['Climatologia', 'Urbanização', 'Geopolítica', 'Biomas Brasileiros']
    };

    const totalToGenerate = Math.min(50, Math.max(1, total)); // Limita a no máximo 50
    const examQuestions = [];

    for (let i = 1; i <= totalToGenerate; i++) {
      const subject = subjects[(i - 1) % subjects.length];
      const matchPool = mockQuestionsPool.find(q => q.disciplina === subject) || mockQuestionsPool[0];
      const topicList = topics[subject] || ['Geral'];
      const topic = topicList[(i - 1) % topicList.length];
      const diffLabel = difficulty === 'all' ? (i % 3 === 0 ? 'Difícil' : (i % 2 === 0 ? 'Fácil' : 'Médio')) : difficulty;

      examQuestions.push({
        id: `ETEC-SIM-Q${String(i).padStart(2, '0')}`,
        index: i,
        disciplina: subject,
        assunto: topic,
        dificuldade: diffLabel,
        enunciado: `(${subject} • ${topic} • Nível ${diffLabel}) ${matchPool.enunciado}`,
        alternativas: matchPool.alternativas,
        correta: matchPool.correta
      });
    }
    return examQuestions;
  }

  // ==========================================
  // ESTADO DA APLICAÇÃO
  // ==========================================
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let userAnswers = {}; // { 0: 'B', 1: 'C' }
  let userFlags = {}; // { 0: true }
  let timerInterval = null;
  let secondsRemaining = 4 * 60 * 60; // 4 horas
  let startTime = null;

  // Elementos do DOM
  const hubView = document.getElementById('simulado-hub-view');
  const customView = document.getElementById('simulado-custom-view');
  const playerView = document.getElementById('simulado-player-view');
  const resultView = document.getElementById('simulado-result-view');

  const btnStartOficial = document.getElementById('btn-start-oficial');
  const btnStartRapido = document.getElementById('btn-start-rapido');
  const btnGoToCustom = document.getElementById('btn-go-to-custom-screen');
  const btnCustomBack = document.getElementById('btn-custom-back-to-hub');
  const formCustomScreen = document.getElementById('form-custom-simulado-screen');

  const btnSubmitExam = document.getElementById('btn-submit-exam');
  const btnBackToHub = document.getElementById('btn-back-to-hub');

  const timerDisplay = document.getElementById('exam-timer-display');
  const playerExamTitleBadge = document.getElementById('player-exam-title-badge');
  const playerProgressText = document.getElementById('player-progress-text');
  const gridAnswerSheet = document.getElementById('grid-answer-sheet');
  const answersCounter = document.getElementById('answers-counter');

  const qSubjectBadge = document.getElementById('q-subject-badge');
  const qTopicBadge = document.getElementById('q-topic-badge');
  const qNumberTitle = document.getElementById('q-number-title');
  const qStatementText = document.getElementById('q-statement-text');
  const qOptionsContainer = document.getElementById('q-options-container');
  const btnPrev = document.getElementById('btn-prev-question');
  const btnNext = document.getElementById('btn-next-question');
  const btnFlagReview = document.getElementById('btn-flag-review');
  const qStatusIndicator = document.getElementById('q-status-indicator');

  // ==========================================
  // NAVEGAÇÃO ENTRE AS 4 TELAS (Hub -> Custom -> Player -> Result)
  // ==========================================
  function showView(viewName) {
    if (hubView) hubView.classList.add('hidden');
    if (customView) customView.classList.add('hidden');
    if (playerView) playerView.classList.add('hidden');
    if (resultView) resultView.classList.add('hidden');

    if (viewName === 'hub' && hubView) hubView.classList.remove('hidden');
    if (viewName === 'custom' && customView) customView.classList.remove('hidden');
    if (viewName === 'player' && playerView) playerView.classList.remove('hidden');
    if (viewName === 'result' && resultView) resultView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navegar para a tela cheia de Customização
  if (btnGoToCustom) {
    btnGoToCustom.addEventListener('click', () => {
      showView('custom');
    });
  }

  // Voltar da tela de Customização para o Hub
  if (btnCustomBack) {
    btnCustomBack.addEventListener('click', () => {
      showView('hub');
    });
  }

  // ==========================================
  // INICIAR SIMULADO
  // ==========================================
  function startExam(totalQuestions = 50, durationSeconds = 14400, title = 'Simulado Oficial ETEC', selectedSubjects = ['Português', 'Matemática', 'Biologia', 'Física', 'Química', 'História', 'Geografia'], difficulty = 'all') {
    const safeTotal = Math.min(50, Math.max(1, totalQuestions)); // Máximo 50 questões
    const safeSeconds = Math.min(14400, durationSeconds > 0 ? durationSeconds : 86400); // Máximo 4 horas

    currentQuestions = generateExamQuestions(safeTotal, selectedSubjects, difficulty);
    currentQuestionIndex = 0;
    userAnswers = {};
    userFlags = {};
    secondsRemaining = safeSeconds;
    startTime = Date.now();

    if (playerExamTitleBadge) playerExamTitleBadge.textContent = title;

    buildAnswerSheetGrid();
    renderCurrentQuestion();
    startTimer(durationSeconds === 0);
    showView('player');
  }

  if (btnStartOficial) {
    btnStartOficial.addEventListener('click', () => startExam(50, 4 * 60 * 60, 'Simulado Oficial ETEC (50Q • 4h)'));
  }
  if (btnStartRapido) {
    btnStartRapido.addEventListener('click', () => startExam(10, 30 * 60, 'Simulado Rápido (10Q • 30min)'));
  }

  // Submissão da Tela de Personalização
  if (formCustomScreen) {
    formCustomScreen.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const checkedBoxes = Array.from(document.querySelectorAll('input[name="custom-screen-subject"]:checked'));
      if (checkedBoxes.length === 0) {
        alert('⚠️ Selecione ao menos uma matéria para o simulado.');
        return;
      }

      const selectedSubjects = checkedBoxes.map(cb => cb.value);
      const difficulty = document.querySelector('input[name="custom-screen-diff"]:checked')?.value || 'all';
      const qtySlider = document.getElementById('custom-qty-slider');
      const qty = parseInt(qtySlider?.value || '20');
      const timeSelect = document.getElementById('custom-screen-time-select');
      const timeSecs = parseInt(timeSelect?.value || '3600');

      let timeLabel = `${Math.floor(timeSecs / 60)}min`;
      if (timeSecs === 0) timeLabel = 'Livre';
      else if (timeSecs >= 3600) timeLabel = `${Math.floor(timeSecs / 3600)}h`;

      const title = `Simulado Sob Medida (${selectedSubjects.length} matérias) • ${qty}Q • ${timeLabel}`;
      startExam(qty, timeSecs, title, selectedSubjects, difficulty);
    });
  }

  // ==========================================
  // CRONÔMETRO
  // ==========================================
  function startTimer(isFreeMode = false) {
    clearInterval(timerInterval);
    updateTimerDisplay(isFreeMode);

    timerInterval = setInterval(() => {
      if (isFreeMode) {
        secondsRemaining++;
      } else {
        secondsRemaining--;
      }
      updateTimerDisplay(isFreeMode);

      if (!isFreeMode && secondsRemaining <= 0) {
        clearInterval(timerInterval);
        alert('⏰ Tempo esgotado! Seu simulado será finalizado automaticamente.');
        finishExam();
      }
    }, 1000);
  }

  function updateTimerDisplay(isFreeMode = false) {
    if (!timerDisplay) return;
    const totalSecs = isFreeMode ? (Math.floor((Date.now() - startTime) / 1000)) : secondsRemaining;
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const formatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    timerDisplay.textContent = formatted;

    if (!isFreeMode && secondsRemaining <= 600) {
      timerDisplay.className = 'text-rose-600 font-bold animate-pulse';
    } else {
      timerDisplay.className = 'text-slate-800 font-mono font-black text-lg';
    }
  }

  // ==========================================
  // CARTÃO-RESPOSTA (GRADE LATERAL ATÉ 50Q)
  // ==========================================
  function buildAnswerSheetGrid() {
    if (!gridAnswerSheet) return;
    gridAnswerSheet.innerHTML = '';

    currentQuestions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.id = `sheet-btn-${idx}`;
      btn.textContent = String(q.index).padStart(2, '0');
      btn.className = 'w-full h-10 rounded-xl text-xs font-bold transition-all border border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100 flex items-center justify-center relative select-none';

      btn.addEventListener('click', () => {
        currentQuestionIndex = idx;
        renderCurrentQuestion();
      });

      gridAnswerSheet.appendChild(btn);
    });

    updateAnswerSheetStatus();
  }

  function updateAnswerSheetStatus() {
    const answeredCount = Object.keys(userAnswers).length;
    if (answersCounter) {
      answersCounter.textContent = `${answeredCount} / ${currentQuestions.length}`;
    }

    if (playerProgressText) {
      const percent = Math.round((answeredCount / currentQuestions.length) * 100);
      playerProgressText.textContent = `Questão ${currentQuestionIndex + 1} de ${currentQuestions.length} • ${percent}% Concluído`;
    }

    currentQuestions.forEach((_, idx) => {
      const btn = document.getElementById(`sheet-btn-${idx}`);
      if (!btn) return;

      const isAnswered = userAnswers[idx] !== undefined;
      const isFlagged = userFlags[idx] === true;
      const isCurrent = idx === currentQuestionIndex;

      let baseClasses = 'w-full h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center relative select-none ';

      if (isAnswered) {
        baseClasses += 'bg-slate-900 text-white border border-slate-900 shadow-sm ';
      } else if (isFlagged) {
        baseClasses += 'bg-amber-50 text-amber-900 border-2 border-amber-400 ';
      } else {
        baseClasses += 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 ';
      }

      if (isCurrent) {
        baseClasses += 'ring-2 ring-blue-600 ring-inset font-black shadow-sm ';
        if (!isAnswered && !isFlagged) {
          baseClasses += 'bg-blue-50/70 text-blue-900 border-blue-400 ';
        }
      }

      btn.className = baseClasses;

      if (isFlagged) {
        btn.innerHTML = `${String(idx + 1).padStart(2, '0')}<span class="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-white"></span>`;
      } else {
        btn.textContent = String(idx + 1).padStart(2, '0');
      }
    });
  }

  // ==========================================
  // RENDERIZAR QUESTÃO ATUAL
  // ==========================================
  function renderCurrentQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    if (!q) return;

    if (qSubjectBadge) {
      const colors = {
        'Português': 'bg-rose-50 text-rose-700 border-rose-200',
        'Matemática': 'bg-blue-50 text-blue-700 border-blue-200',
        'Biologia': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Física': 'bg-cyan-50 text-cyan-700 border-cyan-200',
        'Química': 'bg-teal-50 text-teal-700 border-teal-200',
        'História': 'bg-amber-50 text-amber-700 border-amber-200',
        'Geografia': 'bg-orange-50 text-orange-700 border-orange-200'
      };
      qSubjectBadge.className = `text-xs font-bold px-2.5 py-1 rounded-lg border ${colors[q.disciplina] || 'bg-slate-100 text-slate-700'}`;
      qSubjectBadge.textContent = q.disciplina;
    }

    if (qTopicBadge) qTopicBadge.textContent = q.assunto;
    if (qNumberTitle) qNumberTitle.textContent = `Questão ${String(q.index).padStart(2, '0')} de ${currentQuestions.length}`;
    if (qStatementText) qStatementText.textContent = q.enunciado;

    // Atualiza botão de dúvida
    if (btnFlagReview) {
      if (userFlags[currentQuestionIndex]) {
        btnFlagReview.innerHTML = `<i class="fas fa-flag text-amber-500"></i> <span class="text-amber-600 font-bold">Marcada para Revisão</span>`;
      } else {
        btnFlagReview.innerHTML = `<i class="far fa-flag"></i> <span>Marcar para Revisar</span>`;
      }
    }

    // Renderiza alternativas
    if (qOptionsContainer) {
      qOptionsContainer.innerHTML = '';

      q.alternativas.forEach(alt => {
        const isSelected = userAnswers[currentQuestionIndex] === alt.letra;
        const optEl = document.createElement('div');

        const borderClass = isSelected ? 'border-black bg-slate-50 shadow-sm ring-1 ring-black' : 'border-slate-200 bg-white hover:border-slate-400';
        const iconBg = isSelected ? 'bg-black text-white' : 'bg-slate-100 text-slate-700';

        optEl.className = `flex items-center gap-4 p-4 rounded-2xl border ${borderClass} cursor-pointer transition-all`;
        optEl.innerHTML = `
          <span class="w-8 h-8 rounded-xl ${iconBg} font-black text-xs flex items-center justify-center shrink-0">
            ${alt.letra}
          </span>
          <span class="text-sm font-medium text-slate-800 flex-1 leading-relaxed">
            ${alt.texto}
          </span>
        `;

        optEl.addEventListener('click', () => {
          userAnswers[currentQuestionIndex] = alt.letra;
          renderCurrentQuestion();
          updateAnswerSheetStatus();

          // Salva no cofre local se a função estiver disponível
          if (typeof window.registrarResolucaoLocal === 'function') {
            const isCorrect = alt.letra === q.correta;
            window.registrarResolucaoLocal(q.id, alt.letra, isCorrect, 60, null, q.index);
          }
        });

        qOptionsContainer.appendChild(optEl);
      });
    }

    // Status da questão
    if (qStatusIndicator) {
      if (userAnswers[currentQuestionIndex]) {
        qStatusIndicator.innerHTML = `<span class="text-emerald-600 font-bold"><i class="fas fa-check"></i> Respondida (Opção ${userAnswers[currentQuestionIndex]})</span>`;
      } else {
        qStatusIndicator.innerHTML = `<span class="text-slate-400 font-medium">Em branco</span>`;
      }
    }

    // Botões Anterior / Próxima
    if (btnPrev) btnPrev.disabled = currentQuestionIndex === 0;
    if (btnNext) {
      if (currentQuestionIndex === currentQuestions.length - 1) {
        btnNext.innerHTML = `Finalizar <i class="fas fa-check ml-1"></i>`;
      } else {
        btnNext.innerHTML = `Próxima <i class="fas fa-chevron-right ml-1"></i>`;
      }
    }

    updateAnswerSheetStatus();
  }

  // Navegação
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderCurrentQuestion();
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        renderCurrentQuestion();
      } else {
        finishExam();
      }
    });
  }

  if (btnFlagReview) {
    btnFlagReview.addEventListener('click', () => {
      userFlags[currentQuestionIndex] = !userFlags[currentQuestionIndex];
      renderCurrentQuestion();
    });
  }

  // ==========================================
  // FINALIZAR SIMULADO & GERAR RELATÓRIO
  // ==========================================
  if (btnSubmitExam) {
    btnSubmitExam.addEventListener('click', () => {
      const totalAnswered = Object.keys(userAnswers).length;
      const unAnswered = currentQuestions.length - totalAnswered;

      let msg = 'Tem certeza que deseja finalizar e entregar sua prova?';
      if (unAnswered > 0) {
        msg = `Atenção: Você ainda possui ${unAnswered} questão(ões) em branco. Deseja entregar assim mesmo?`;
      }

      if (confirm(msg)) {
        finishExam();
      }
    });
  }

  function finishExam() {
    clearInterval(timerInterval);
    const elapsedTimeSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

    let correctCount = 0;
    const subjectStats = {};

    currentQuestions.forEach((q, idx) => {
      const userChoice = userAnswers[idx];
      const isCorrect = userChoice === q.correta;
      if (isCorrect) correctCount++;

      if (!subjectStats[q.disciplina]) {
        subjectStats[q.disciplina] = { total: 0, correct: 0 };
      }
      subjectStats[q.disciplina].total++;
      if (isCorrect) subjectStats[q.disciplina].correct++;
    });

    const total = currentQuestions.length;
    const accuracy = Math.round((correctCount / total) * 100);
    const avgPaceSeconds = Math.round(elapsedTimeSeconds / total);

    // Formata tempos
    const totalMins = Math.floor(elapsedTimeSeconds / 60);
    const paceMins = Math.floor(avgPaceSeconds / 60);
    const paceSecs = avgPaceSeconds % 60;

    // Atualiza DOM do Resultado
    const resScoreNumber = document.getElementById('result-score-number');
    const resTotalNumber = document.getElementById('result-total-number');
    const resAccuracy = document.getElementById('result-accuracy-percent');
    const resTotalTime = document.getElementById('result-total-time');
    const resPace = document.getElementById('result-pace-avg');
    const resHeadline = document.getElementById('result-feedback-headline');

    if (resScoreNumber) resScoreNumber.textContent = correctCount;
    if (resTotalNumber) resTotalNumber.textContent = total;
    if (resAccuracy) resAccuracy.textContent = `${accuracy}%`;
    if (resTotalTime) resTotalTime.textContent = `${totalMins} min`;
    if (resPace) resPace.textContent = `${paceMins}m ${paceSecs}s`;

    if (resHeadline) {
      if (accuracy >= 70) {
        resHeadline.textContent = `🏆 Excelente! Sua nota (${accuracy}%) está confortavelmente acima da média.`;
        resHeadline.className = 'text-emerald-600 font-bold text-base md:text-lg mb-8';
      } else {
        resHeadline.textContent = `Atenção: Revise o gabarito comentado para corrigir os erros cometidos.`;
        resHeadline.className = 'text-amber-600 font-bold text-base md:text-lg mb-8';
      }
    }

    // Renderiza barras com as matérias que caíram na prova
    const subjectsContainer = document.getElementById('result-subjects-bars');
    if (subjectsContainer) {
      subjectsContainer.innerHTML = '';
      Object.keys(subjectStats).forEach(subj => {
        const st = subjectStats[subj];
        const pct = Math.round((st.correct / st.total) * 100);
        const barColor = pct >= 70 ? 'bg-emerald-500' : (pct >= 50 ? 'bg-blue-500' : 'bg-rose-500');

        subjectsContainer.innerHTML += `
          <div>
            <div class="flex justify-between text-xs font-bold mb-1">
              <span>${subj}</span>
              <span class="text-slate-700">${pct}% (${st.correct}/${st.total})</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div class="${barColor} h-full rounded-full" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      });
    }

    showView('result');
  }

  if (btnBackToHub) {
    btnBackToHub.addEventListener('click', () => {
      showView('hub');
    });
  }
});
