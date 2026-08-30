document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // BANCO DE QUESTÕES MODELO VESTIBULINHO ETEC
  // ==========================================
  const mockQuestionsPool = [
    {
      id: 'ETEC-2023-Q01',
      disciplina: 'Português',
      assunto: 'Interpretação Textual',
      enunciado: 'O avanço das tecnologias digitais na educação pública paulista permitiu a personalização do aprendizado, mas escancarou desafios de conectividade. Segundo o texto, a principal contradição observada reside:',
      alternativas: [
        { letra: 'A', texto: 'Na substituição total do corpo docente por softwares inteligentes.' },
        { letra: 'B', texto: 'No aumento do interesse dos alunos concomitante à queda das matrículas.' },
        { letra: 'C', texto: 'Na oferta de recursos pedagógicos modernos diante de desigualdades no acesso à internet.' },
        { letra: 'D', texto: 'No desinteresse dos estudantes pelas carreiras na área de tecnologia.' },
        { letra: 'E', texto: 'Na falta de livros didáticos nas escolas técnicas estaduais.' }
      ],
      correta: 'C'
    },
    {
      id: 'ETEC-2023-Q02',
      disciplina: 'Matemática',
      assunto: 'Regra de Três Simples',
      enunciado: 'Para pintar um muro de 120 metros quadrados, um pintor utiliza 8 litros de tinta acrílica. Se a área a ser pintada for ampliada para 300 metros quadrados mantendo o mesmo rendimento, a quantidade necessária de tinta será de:',
      alternativas: [
        { letra: 'A', texto: '15 litros' },
        { letra: 'B', texto: '18 litros' },
        { letra: 'C', texto: '20 litros' },
        { letra: 'D', texto: '24 litros' },
        { letra: 'E', texto: '25 litros' }
      ],
      correta: 'C'
    },
    {
      id: 'ETEC-2023-Q03',
      disciplina: 'Ciências',
      assunto: 'Ecologia & Cadeias',
      enunciado: 'Em um ecossistema aquático, o fitoplâncton absorve energia solar e produz matéria orgânica que alimenta o zooplâncton, que por sua vez serve de alimento para pequenos peixes. Nesse contexto, o fitoplâncton atua como:',
      alternativas: [
        { letra: 'A', texto: 'Consumidor Primário' },
        { letra: 'B', texto: 'Produtor Autótrofo' },
        { letra: 'C', texto: 'Decompositor' },
        { letra: 'D', texto: 'Consumidor Secundário' },
        { letra: 'E', texto: 'Parasita Aquático' }
      ],
      correta: 'B'
    },
    {
      id: 'ETEC-2023-Q04',
      disciplina: 'Humanas',
      assunto: 'Revolução Industrial',
      enunciado: 'A máquina a vapor aperfeiçoada por James Watt no século XVIII revolucionou o sistema fabril britânico principalmente porque:',
      alternativas: [
        { letra: 'A', texto: 'Eliminou a necessidade de extração de carvão mineral.' },
        { letra: 'B', texto: 'Permitiu que as fábricas se instalassem longe das margens dos rios, ampliando a escala de produção.' },
        { letra: 'C', texto: 'Extinguiu imediatamente o trabalho infantil na Europa.' },
        { letra: 'D', texto: 'Substituiu a navegação marítima por trens intercontinentais.' },
        { letra: 'E', texto: 'Provocou a volta maciça da população para o meio rural.' }
      ],
      correta: 'B'
    },
    {
      id: 'ETEC-2023-Q05',
      disciplina: 'Matemática',
      assunto: 'Geometria Plana',
      enunciado: 'Um piso retangular de uma sala de aula de uma ETEC tem 6 metros de largura por 8 metros de comprimento. Deseja-se calcular o comprimento da diagonal dessa sala para a instalação de um cabo de fibra ótica. Essa medida vale:',
      alternativas: [
        { letra: 'A', texto: '9 metros' },
        { letra: 'B', texto: '10 metros' },
        { letra: 'C', texto: '12 metros' },
        { letra: 'D', texto: '14 metros' },
        { letra: 'E', texto: '16 metros' }
      ],
      correta: 'B'
    }
  ];

  // Gera 50 questões dinâmicas baseadas nos padrões da ETEC
  function generateExamQuestions(total = 50) {
    const subjects = ['Português', 'Matemática', 'Ciências', 'Humanas'];
    const topics = {
      'Português': ['Figuras de Linguagem', 'Concordância Verbal', 'Interpretação', 'Funções Sintáticas'],
      'Matemática': ['Equação de 2º Grau', 'Pitágoras', 'Porcentagem', 'Áreas e Volumes'],
      'Ciências': ['Genética Básica', 'Ondulatória', 'Tabela Periódica', 'Cinemática'],
      'Humanas': ['Era Vargas', 'Revolução Industrial', 'Geopolítica Moderna', 'Climatologia']
    };

    const examQuestions = [];
    for (let i = 1; i <= total; i++) {
      const baseIdx = (i - 1) % mockQuestionsPool.length;
      const base = mockQuestionsPool[baseIdx];
      const subject = subjects[(i - 1) % subjects.length];
      const topicList = topics[subject];
      const topic = topicList[(i - 1) % topicList.length];

      examQuestions.push({
        id: `ETEC-SIM-Q${String(i).padStart(2, '0')}`,
        index: i,
        disciplina: subject,
        assunto: topic,
        enunciado: `(${subject} - ${topic}) ${base.enunciado}`,
        alternativas: base.alternativas,
        correta: base.correta
      });
    }
    return examQuestions;
  }

  // ==========================================
  // ESTADO DA APLICAÇÃO
  // ==========================================
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let userAnswers = {}; // { 1: 'B', 2: 'C' }
  let userFlags = {}; // { 1: true }
  let timerInterval = null;
  let secondsRemaining = 4 * 60 * 60; // 4 horas
  let startTime = null;

  // Elementos do DOM
  const hubView = document.getElementById('simulado-hub-view');
  const playerView = document.getElementById('simulado-player-view');
  const resultView = document.getElementById('simulado-result-view');

  const btnStartOficial = document.getElementById('btn-start-oficial');
  const btnStartRapido = document.getElementById('btn-start-rapido');
  const btnStartDisciplina = document.getElementById('btn-start-disciplina');
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
  // NAVEGAÇÃO ENTRE TELAS
  // ==========================================
  function showView(viewName) {
    if (hubView) hubView.classList.add('hidden');
    if (playerView) playerView.classList.add('hidden');
    if (resultView) resultView.classList.add('hidden');

    if (viewName === 'hub' && hubView) hubView.classList.remove('hidden');
    if (viewName === 'player' && playerView) playerView.classList.remove('hidden');
    if (viewName === 'result' && resultView) resultView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // INICIAR SIMULADO
  // ==========================================
  function startExam(totalQuestions = 50, durationSeconds = 14400, title = 'Simulado Oficial ETEC') {
    currentQuestions = generateExamQuestions(totalQuestions);
    currentQuestionIndex = 0;
    userAnswers = {};
    userFlags = {};
    secondsRemaining = durationSeconds;
    startTime = Date.now();

    if (playerExamTitleBadge) playerExamTitleBadge.textContent = title;

    buildAnswerSheetGrid();
    renderCurrentQuestion();
    startTimer();
    showView('player');
  }

  if (btnStartOficial) {
    btnStartOficial.addEventListener('click', () => startExam(50, 4 * 60 * 60, 'Simulado Oficial ETEC (50Q)'));
  }
  if (btnStartRapido) {
    btnStartRapido.addEventListener('click', () => startExam(10, 30 * 60, 'Simulado Rápido de Treino (10Q)'));
  }
  if (btnStartDisciplina) {
    btnStartDisciplina.addEventListener('click', () => startExam(15, 45 * 60, 'Treino Especializado (15Q)'));
  }

  // ==========================================
  // CRONÔMETRO
  // ==========================================
  function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      secondsRemaining--;
      updateTimerDisplay();

      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        alert('⏰ Tempo esgotado! Seu simulado será finalizado automaticamente.');
        finishExam();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    if (!timerDisplay) return;
    const hours = Math.floor(secondsRemaining / 3600);
    const mins = Math.floor((secondsRemaining % 3600) / 60);
    const secs = secondsRemaining % 60;

    const formatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    timerDisplay.textContent = formatted;

    if (secondsRemaining <= 600) {
      timerDisplay.className = 'text-rose-600 font-bold animate-pulse';
    }
  }

  // ==========================================
  // CARTÃO-RESPOSTA (GRADE LATERAL)
  // ==========================================
  function buildAnswerSheetGrid() {
    if (!gridAnswerSheet) return;
    gridAnswerSheet.innerHTML = '';

    currentQuestions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.id = `sheet-btn-${idx}`;
      btn.textContent = String(q.index).padStart(2, '0');
      btn.className = 'w-full py-2.5 rounded-lg text-xs font-bold transition-all border border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100 flex items-center justify-center relative';

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

      // Reseta classes
      btn.className = 'w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center relative ';

      if (isCurrent) {
        btn.className += 'ring-2 ring-blue-600 font-black ';
      }

      if (isAnswered) {
        btn.className += 'bg-black text-white border-black ';
      } else if (isFlagged) {
        btn.className += 'bg-amber-100 text-amber-900 border-amber-300 ';
      } else {
        btn.className += 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 ';
      }

      if (isFlagged) {
        btn.innerHTML = `${String(idx + 1).padStart(2, '0')}<span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white"></span>`;
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

    if (qSubjectBadge) qSubjectBadge.textContent = q.disciplina;
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
        resHeadline.textContent = `🏆 Excelente! Sua nota está confortavelmente acima da média de aprovação.`;
        resHeadline.className = 'text-emerald-600 font-bold text-base md:text-lg mb-8';
      } else {
        resHeadline.textContent = `Atenção: Aproveite o gabarito comentado para revisar os tópicos críticos.`;
        resHeadline.className = 'text-amber-600 font-bold text-base md:text-lg mb-8';
      }
    }

    // Renderiza barras de matérias
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
