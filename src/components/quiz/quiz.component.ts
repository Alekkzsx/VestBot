import { Component, inject, signal, OnDestroy, computed, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, Question } from '../../services/content.service';
import { QuestionHistoryService } from '../../services/question-history.service';
import { DictionaryService, DictionaryEntry } from '../../services/dictionary.service';
import { ActivitySessionService } from '../../services/activity-session.service';
import { ResolutionsService } from '../../services/resolutions.service';
import { WordPopupComponent } from '../word-popup/word-popup.component';
import { CelebrationComponent, CelebrationType } from '../celebration/celebration.component';
import { LatexPipe } from '../../pipes/latex.pipe';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, WordPopupComponent, CelebrationComponent, LatexPipe],
  templateUrl: './quiz.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizComponent implements OnDestroy {
  contentService = inject(ContentService);
  questionHistory = inject(QuestionHistoryService);
  dictionary = inject(DictionaryService);
  activitySession = inject(ActivitySessionService);
  resolutionsService = inject(ResolutionsService);

  // Configuration State
  availableSubjects = signal<string[]>(this.contentService.getSubjects());
  config = signal({
    selectedSubjects: [] as string[],
    questionCount: 50, // ETEC Standard
    difficulty: 'Mista' as 'Fácil' | 'Médio' | 'Difícil' | 'Mista',
    timerMinutes: 240 // ETEC Standard (4 hours)
  });

  // Quiz State
  quizActive = signal(false);
  questions = signal<Question[]>([]);
  currentIndex = signal(0);
  selectedOptionIndex = signal<number | null>(null);
  isAnswered = signal(false);
  isCorrect = signal(false);
  score = signal(0);
  quizFinished = signal(false);
  answeredIndices = signal<Set<number>>(new Set());
  userAnswers = signal<Map<number, number>>(new Map());
  currentHint = signal<any | null>(null);
  currentHintStepIndex = signal(0);
  isReviewMode = signal(false);

  // Celebration State
  showCelebration = signal(false);
  celebrationType = signal<CelebrationType>('correct');
  celebrationXP = signal(0);

  // Loading State
  isPreparing = signal(false);
  loadingMessage = signal('Organizando questões...');

  // Timer State
  timeLeft = signal(0); // in seconds
  private timerInterval: any;

  // Explanation State
  explanationText = signal<string | null>(null);

  // File Selection
  selectedFiles = signal<string[]>([]);
  availableFiles = this.contentService.getAvailableFiles();

  // Word Popup State
  showWordPopup = signal(false);
  selectedWord = signal('');
  wordDefinitions = signal<DictionaryEntry[] | null>(null);
  popupPosition = signal({ x: 0, y: 0 });

  constructor() {
    this.config.update(c => ({ ...c, selectedSubjects: [...this.availableSubjects()] }));

    // Load all questions from local files on initialization
    this.loadLocalQuestions();
  }

  async loadLocalQuestions() {
    try {
      // Load all question files by default via HTTP
      await this.contentService.loadQuestionsFromFiles();
      const stats = this.contentService.getQuestions().length;
      console.log(`QuizComponent: ${stats} questions available for quizzes`);

      // Update subjects after questions are loaded
      const subjects = this.contentService.getSubjects();
      this.availableSubjects.set(subjects);
      this.config.update(c => ({ ...c, selectedSubjects: [...subjects] }));

      // Load resolutions in background
      this.resolutionsService.loadResolutions();
    } catch (error) {
      console.error('Failed to load questions from files, using fallback:', error);
    }
  }

  ngOnDestroy() {
    this.stopTimer();
    // Force save history when component is destroyed (e.g. sidebar navigation)
    const userData = (this.questionHistory as any).userDataService.getUserData();
    if (userData && userData.user.questionHistory) {
      (this.questionHistory as any).userDataService.forceSaveHistory(userData.user.questionHistory);
    }
  }

  // --- Configuration Methods ---

  toggleSubject(subject: string) {
    this.config.update(c => {
      const exists = c.selectedSubjects.includes(subject);
      let newSubjects;
      if (exists) {
        newSubjects = c.selectedSubjects.filter(s => s !== subject);
      } else {
        newSubjects = [...c.selectedSubjects, subject];
      }
      return { ...c, selectedSubjects: newSubjects };
    });
  }

  setQuestionCount(count: number) {
    this.config.update(c => ({ ...c, questionCount: count }));
  }

  setDifficulty(diff: 'Fácil' | 'Médio' | 'Difícil' | 'Mista') {
    this.config.update(c => ({ ...c, difficulty: diff }));
  }

  setTimer(minutes: number) {
    this.config.update(c => ({ ...c, timerMinutes: minutes }));
  }

  setStandardSubjects() {
    this.config.update(c => ({ ...c, selectedSubjects: [...this.availableSubjects()] }));
  }

  /**
   * Fisher-Yates Shuffle Algorithm - Estatisticamente uniforme
   * Garante que todas as permutações tenham a mesma probabilidade
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Distribui questões de forma balanceada entre matérias
   * Garante representação proporcional de todas as matérias selecionadas
   */
  private distributeBalanced(
    pool: Question[],
    targetCount: number,
    selectedSubjects: string[],
    difficultyFilter?: 'Fácil' | 'Médio' | 'Difícil'
  ): Question[] {
    let filteredPool = difficultyFilter
      ? pool.filter(q => q.difficulty === difficultyFilter)
      : pool;

    if (filteredPool.length === 0) return [];

    const finalSelection: Question[] = [];
    const usedIds = new Set<number>();

    // Cálculo de cotas
    const baseQuota = Math.floor(targetCount / selectedSubjects.length);
    const extraSlots = targetCount % selectedSubjects.length;

    const shuffledSubjects = this.shuffleArray([...selectedSubjects]);

    // Fase 1: Distribuir cota base para cada matéria (match direto)
    for (const subject of shuffledSubjects) {
      const subjectPool = filteredPool.filter(q =>
        q.subject === subject && !usedIds.has(q.id)
      );

      if (subjectPool.length === 0) continue;

      const shuffled = this.shuffleArray(subjectPool);
      const toTake = Math.min(baseQuota, shuffled.length);

      for (let i = 0; i < toTake; i++) {
        finalSelection.push(shuffled[i]);
        usedIds.add(shuffled[i].id);
      }
    }

    // Fase 2: Distribuir sobras
    if (finalSelection.length < targetCount && extraSlots > 0) {
      const subjectCounts = new Map<string, number>();
      shuffledSubjects.forEach(s => {
        subjectCounts.set(s, finalSelection.filter(q => q.subject === s).length);
      });

      const sortedSubjects = [...shuffledSubjects].sort((a, b) =>
        (subjectCounts.get(a) || 0) - (subjectCounts.get(b) || 0)
      );

      for (const subject of sortedSubjects) {
        if (finalSelection.length >= targetCount) break;

        const available = filteredPool.filter(q =>
          q.subject === subject && !usedIds.has(q.id)
        );

        if (available.length > 0) {
          const shuffled = this.shuffleArray(available);
          finalSelection.push(shuffled[0]);
          usedIds.add(shuffled[0].id);
        }
      }
    }

    return this.shuffleArray(finalSelection);
  }

  /**
   * Modo Mista: Balanceia simultaneamente dificuldade E matérias
   * Proporções ETEC: 20% Fácil, 50% Médio, 30% Difícil
   */
  private distributeMixedMode(
    pool: Question[],
    targetCount: number,
    selectedSubjects: string[]
  ): Question[] {
    const easyCount = Math.round(targetCount * 0.20);
    const mediumCount = Math.round(targetCount * 0.50);
    const hardCount = Math.round(targetCount * 0.30);

    // Distribuir cada nível de dificuldade de forma balanceada entre matérias
    const easyQuestions = this.distributeBalanced(pool, easyCount, selectedSubjects, 'Fácil');
    const mediumQuestions = this.distributeBalanced(pool, mediumCount, selectedSubjects, 'Médio');
    const hardQuestions = this.distributeBalanced(pool, hardCount, selectedSubjects, 'Difícil');

    let combined = [...easyQuestions, ...mediumQuestions, ...hardQuestions];

    // Se não atingiu o total, completar sem filtro de dificuldade
    if (combined.length < targetCount) {
      const usedIds = new Set(combined.map(q => q.id));
      const remainingPool = pool.filter(q => !usedIds.has(q.id));
      const additional = this.distributeBalanced(
        remainingPool,
        targetCount - combined.length,
        selectedSubjects
      );
      combined = [...combined, ...additional];
    }

    return this.shuffleArray(combined.slice(0, targetCount));
  }

  async startQuiz() {
    if (this.config().selectedSubjects.length === 0) {
      alert('Selecione pelo menos uma matéria.');
      return;
    }

    this.isPreparing.set(true);
    this.loadingMessage.set('Preparando simulado...');

    try {
      const allQuestions = this.contentService.getQuestions();
      const targetCount = this.config().questionCount;
      const selectedSubjects = this.config().selectedSubjects;
      const selectedDifficulty = this.config().difficulty;

      // Filter out questions that are still blocked by spaced repetition
      const availableQuestions = allQuestions.filter(q =>
        this.questionHistory.canShowQuestion(q.id)
      );

      console.log(`🔄 Spaced repetition: ${allQuestions.length - availableQuestions.length} questions blocked`);

      // Filtrar questões por matérias selecionadas — match direto com subjects do dataset
      let pool = availableQuestions.filter(q =>
        selectedSubjects.includes(q.subject)
      );

      let finalSelection: Question[] = [];

      // Aplicar distribuição balanceada
      if (selectedDifficulty === 'Mista') {
        finalSelection = this.distributeMixedMode(pool, targetCount, selectedSubjects);
      } else {
        // Dificuldade específica
        const difficultyPool = pool.filter(q => q.difficulty === selectedDifficulty);
        finalSelection = this.distributeBalanced(difficultyPool, targetCount, selectedSubjects, selectedDifficulty);
      }

      // Limitar ao número solicitado
      finalSelection = finalSelection.slice(0, targetCount);

      // Validações
      if (finalSelection.length === 0) {
        this.isPreparing.set(false); // Stop loading before showing alert

        const blockedCount = allQuestions.length - availableQuestions.length;
        if (blockedCount > 0) {
          const shouldClear = confirm(
            `Não há questões disponíveis!\n\n` +
            `${blockedCount} questões estão bloqueadas pelo sistema de repetição espaçada.\n\n` +
            `Deseja limpar o histórico e liberar todas as questões?`
          );
          if (shouldClear) {
            this.questionHistory.clearHistory();
            alert('✅ Histórico limpo com sucesso!\n\nTodas as questões estão disponíveis novamente.\n\nClique em "Começar Simulado" para tentar novamente.');
          }
        } else {
          alert('Não há questões disponíveis com os filtros selecionados. Tente outras matérias ou dificuldades.');
        }
        return;
      }

      // Avisar se há menos questões do que pedido
      if (finalSelection.length < targetCount) {
        const blockedCount = allQuestions.length - availableQuestions.length;
        let message = `Apenas ${finalSelection.length} questões disponíveis (você pediu ${targetCount}).`;

        if (blockedCount > 0) {
          message += `\n\n${blockedCount} questões estão bloqueadas pelo sistema de repetição espaçada.`;
          message += `\n\nDeseja continuar com ${finalSelection.length} questões ou limpar o histórico?`;
        } else {
          message += `\n\nDeseja continuar?`;
        }

        const proceed = confirm(message);
        if (!proceed) {
          this.isPreparing.set(false); // Stop loading before offering to clear

          // Offer to clear history if there are blocked questions
          if (blockedCount > 0) {
            const shouldClear = confirm('Deseja limpar o histórico e liberar todas as questões?');
            if (shouldClear) {
              this.questionHistory.clearHistory();
              alert('✅ Histórico limpo com sucesso!\n\nTodas as questões estão disponíveis novamente.\n\nClique em "Começar Simulado" para tentar novamente.');
            }
          }
          return;
        }

      }

      // Log de estatísticas MELHORADO
      const stats = {
        total: finalSelection.length,
        fácil: finalSelection.filter(q => q.difficulty === 'Fácil').length,
        médio: finalSelection.filter(q => q.difficulty === 'Médio').length,
        difícil: finalSelection.filter(q => q.difficulty === 'Difícil').length,
        porMateria: selectedSubjects.map(s => ({
          materia: s,
          count: finalSelection.filter(q => q.subject === s).length,
          percentual: ((finalSelection.filter(q => q.subject === s).length / finalSelection.length) * 100).toFixed(1) + '%'
        })),
        comRecursos: {
          imagem: finalSelection.filter(q => q.imageUrl).length,
          textoApoio: finalSelection.filter(q => q.supportText).length
        }
      };
      console.log('📊 Distribuição do Simulado:', stats);

      // Iniciar o quiz
      const shuffledSelection = finalSelection.map(q => this.contentService.shuffleQuestion(q));
      
      // Reset COMPLETE state before starting new quiz
      this.questions.set(shuffledSelection);
      this.currentIndex.set(0);
      this.score.set(0);
      this.userAnswers.set(new Map());
      this.answeredIndices.set(new Set());
      this.quizFinished.set(false);
      this.isReviewMode.set(false);
      this.quizActive.set(true);
      this.resetQuestionState();

      // Iniciar cronômetro se configurado
      if (this.config().timerMinutes > 0) {
        this.timeLeft.set(this.config().timerMinutes * 60);
        this.startTimer();
      } else {
        this.timeLeft.set(0);
      }

      // Iniciar sessão de atividade para tracking de XP de conclusão
      this.activitySession.startSession('quiz');

    } catch (e) {
      console.error(e);
      alert('Erro ao iniciar simulado.');
    } finally {
      this.isPreparing.set(false);
    }
  }

  // --- Timer Methods ---

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.timeLeft.update(t => {
        if (t <= 1) {
          this.stopTimer();
          this.finishQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formattedTime = computed(() => {
    const totalSeconds = this.timeLeft();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  // --- Quiz Methods ---

  resetQuestionState() {
    const currentIdx = this.currentIndex();
    const savedAnswer = this.userAnswers().get(currentIdx);

    if (savedAnswer !== undefined) {
      this.selectedOptionIndex.set(savedAnswer);
      this.isAnswered.set(true);
      const currentQ = this.questions()[currentIdx];
      this.isCorrect.set(savedAnswer === currentQ.correctIndex);
    } else {
      this.selectedOptionIndex.set(null);
      this.isAnswered.set(false);
      this.isCorrect.set(false);
    }
    this.explanationText.set(null);
    this.currentHint.set(null);
    this.currentHintStepIndex.set(0);
  }

  selectOption(index: number) {
    if (this.isReviewMode()) return; // Impedir alteração em modo de revisão

    // Permite trocar a opção mesmo se já respondeu (UX melhorada)
    this.selectedOptionIndex.set(index);
    
    // Se já estava respondida, atualizar na hora pro usuário ver o feedback visual
    if (this.isAnswered()) {
        this.submitAnswer();
    }
  }

  submitAnswer() {
    if (this.selectedOptionIndex() === null) return;

    const currentIdx = this.currentIndex();
    const currentQ = this.questions()[currentIdx];
    const newSelectedOption = this.selectedOptionIndex();
    const correct = newSelectedOption === currentQ.correctIndex;

    // Lógica de ajuste de score para re-submissão
    const previousAnswer = this.userAnswers().get(currentIdx);
    if (previousAnswer !== undefined) {
      const wasPreviouslyCorrect = previousAnswer === currentQ.correctIndex;
      if (wasPreviouslyCorrect && !correct) {
        this.score.update(s => Math.max(0, s - 1)); // Mudou de certa para errada
      } else if (!wasPreviouslyCorrect && correct) {
        this.score.update(s => s + 1); // Mudou de errada para certa
      }
    } else if (correct) {
      this.score.update(s => s + 1); // Primeira vez e está certa
    }

    this.isCorrect.set(correct);
    this.isAnswered.set(true);

    // Marcar como respondida para a grade e persistir escolha
    this.answeredIndices.update(set => {
      const newSet = new Set(set);
      newSet.add(currentIdx);
      return newSet;
    });

    this.userAnswers.update(map => {
      const newMap = new Map(map);
      newMap.set(currentIdx, newSelectedOption!);
      return newMap;
    });

    // Show celebration only every 10 correct answers (primeira vez correta)
    if (correct && previousAnswer === undefined && this.score() % 10 === 0 && this.score() > 0) {
      this.celebrationType.set('streak');
      this.celebrationXP.set(50);
      this.showCelebration.set(true);
    }

    // Record attempt for spaced repetition
    this.questionHistory.recordAttempt(currentQ.id, correct, 'quiz');

    // Record question in session and update stats with subject
    this.activitySession.recordQuestion(currentQ.difficulty);
    this.contentService.updateStats(correct, currentQ.difficulty, currentQ.subject);
  }

  nextQuestion() {
    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update(i => i + 1);
      this.resetQuestionState();
    } else {
      this.finishQuiz();
    }
  }

  previousQuestion() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      this.resetQuestionState();
    }
  }

  skipQuestion() {
    this.nextQuestion();
  }

  goToQuestion(index: number) {
    if (index >= 0 && index < this.questions().length) {
      this.currentIndex.set(index);
      this.resetQuestionState();
    }
  }

  finishQuiz() {
    this.stopTimer();
    this.quizFinished.set(true);

    // Complete session and award bonus XP
    const bonusXP = this.activitySession.completeSession();
    if (bonusXP > 0) {
      console.log(`🎊 Simulado completo! Bônus de conclusão: +${bonusXP} XP`);
    }

    // Show completion celebration
    this.celebrationType.set('completion');
    this.celebrationXP.set(bonusXP);
    this.showCelebration.set(true);
  }

  closeCelebration() {
    this.showCelebration.set(false);
  }

  exitQuiz() {
    this.stopTimer();

    // Force immediate save of history before exiting
    const userData = (this.questionHistory as any).userDataService.getUserData();
    if (userData && userData.user.questionHistory) {
      (this.questionHistory as any).userDataService.forceSaveHistory(userData.user.questionHistory);
    }

    // Abandon session (no bonus XP)
    this.activitySession.abandonSession();

    this.quizActive.set(false);
    this.quizFinished.set(false);
    this.isReviewMode.set(false);
  }

  enterReviewMode() {
    this.quizFinished.set(false);
    this.isReviewMode.set(true);
    this.currentIndex.set(0);
    this.resetQuestionState();
  }

  showExplanation() {
    const q = this.questions()[this.currentIndex()];

    if (q.explanation) {
      this.explanationText.set(q.explanation);
    } else {
      this.explanationText.set('Esta questão não possui explicação disponível.');
    }
  }

  showHint() {
    const q = this.questions()[this.currentIndex()];
    const resolution = this.resolutionsService.getResolutionForQuestion(q.id, 'quiz');

    if (resolution) {
      this.currentHint.set(resolution);
      this.currentHintStepIndex.set(0);
    } else {
      this.currentHint.set({
        steps: [{ title: 'Dica', content: 'Infelizmente não temos uma resolução detalhada para esta questão ainda.' }]
      });
      this.currentHintStepIndex.set(0);
    }
  }

  // Limite máximo de passos visíveis nas dicas durante o simulado
  private readonly MAX_HINT_STEPS = 2;

  nextHintStep() {
    const maxIndex = Math.min(this.MAX_HINT_STEPS - 1, this.currentHint().steps.length - 1);
    if (this.currentHint() && this.currentHintStepIndex() < maxIndex) {
      this.currentHintStepIndex.update(idx => idx + 1);
    }
  }

  prevHintStep() {
    if (this.currentHintStepIndex() > 0) {
      this.currentHintStepIndex.update(idx => idx - 1);
    }
  }

  // --- Word Popup Methods ---

  /**
   * Handle text selection to show word definition
   */
  @HostListener('document:mouseup', ['$event'])
  handleTextSelection(event: MouseEvent) {
    // Only handle selections during active quiz
    if (!this.quizActive()) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) {
      this.closeWordPopup();
      return;
    }

    const selectedText = selection.toString().trim();

    // Only process single words or short phrases (max 3 words)
    const wordCount = selectedText.split(/\s+/).length;
    if (wordCount > 3) {
      return;
    }

    // Get the first word for lookup
    const word = selectedText.split(/\s+/)[0].replace(/[.,!?;:]/g, '');

    // Get definition from dictionary
    const definitions = this.dictionary.getDefinition(word);

    if (definitions && definitions.length > 0) {
      // Get selection position
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Set popup position (center of selection)
      this.popupPosition.set({
        x: rect.left + (rect.width / 2),
        y: rect.top
      });

      this.selectedWord.set(word);
      this.wordDefinitions.set(definitions);
      this.showWordPopup.set(true);
    }
  }

  /**
   * Close word popup
   */
  closeWordPopup() {
    this.showWordPopup.set(false);
    this.selectedWord.set('');
    this.wordDefinitions.set(null);
  }
}