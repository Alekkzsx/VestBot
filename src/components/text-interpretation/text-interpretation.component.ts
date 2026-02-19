import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterpretationService } from '../../services/interpretation.service';
import { ContentService, Question } from '../../services/content.service';
import { QuestionHistoryService } from '../../services/question-history.service';
import { ActivitySessionService } from '../../services/activity-session.service';
import { CelebrationComponent, CelebrationType } from '../celebration/celebration.component';
import { LatexPipe } from '../../pipes/latex.pipe';

type ViewState = 'config' | 'activity' | 'loading' | 'error' | 'result';

@Component({
  selector: 'app-text-interpretation',
  standalone: true,
  imports: [CommonModule, FormsModule, LatexPipe],
  templateUrl: './text-interpretation.component.html',
  styleUrl: './text-interpretation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInterpretationComponent implements OnInit {
  private interpretationService = inject(InterpretationService);
  private contentService = inject(ContentService);
  private questionHistory = inject(QuestionHistoryService);
  private activitySession = inject(ActivitySessionService);

  constructor() {
    // Automatic shuffling of questions in the group whenever it changes
    effect(() => {
      const group = this.currentGroup();
      if (group) {
        const shuffled = group.questions.map(q => this.contentService.shuffleQuestion(q));
        this.shuffledQuestions.set(shuffled);
      } else {
        this.shuffledQuestions.set([]);
      }
    }, { allowSignalWrites: true });
  }

  // View state
  viewState = signal<ViewState>('loading');
  errorMessage = signal<string | null>(null);

  // Celebration state
  showCelebration = signal(false);
  celebrationType = signal<CelebrationType>('correct');
  celebrationXP = signal(0);

  // Config state (tela inicial)
  selectedDifficulty = signal<'Fácil' | 'Médio' | 'Difícil' | 'Todas'>('Todas');
  selectedQuestionCount = signal<number>(3);

  // Activity state
  currentGroup = this.interpretationService.currentGroup;
  currentQuestionIndex = signal(0); // Índice da questão atual dentro do grupo

  // Local list of shuffled questions for the current group
  shuffledQuestions = signal<Question[]>([]);

  currentQuestion = computed(() => {
    const questions = this.activeQuestions();
    if (questions.length === 0) return null;
    return questions[this.currentQuestionIndex()];
  });

  // Questões limitadas pela configuração do usuário
  activeQuestions = computed(() => {
    const all = this.shuffledQuestions();
    const limit = this.selectedQuestionCount();
    return all.slice(0, limit);
  });

  // User answers
  selectedAnswer = signal<number | null>(null);
  hasAnswered = signal(false);
  isCorrect = signal(false);

  // Stats
  totalCorrect = signal(0);
  totalAnswered = signal(0);

  async ngOnInit() {
    try {
      await this.interpretationService.loadInterpretations();
      this.viewState.set('config');
    } catch (error) {
      console.error('Error loading interpretations:', error);
      this.errorMessage.set('Erro ao carregar textos de interpretação.');
      this.viewState.set('error');
    }
  }

  /**
   * Inicia a atividade com as configurações selecionadas
   */
  startActivity() {
    this.viewState.set('activity');
    this.resetActivity();

    // Start activity session
    this.activitySession.startSession('interpretation');
  }

  /**
   * Volta para tela de configuração
   */
  backToConfig() {
    this.viewState.set('config');
    this.resetActivity();
  }

  /**
   * Reseta toda a atividade
   */
  private resetActivity() {
    this.currentQuestionIndex.set(0);
    this.selectedAnswer.set(null);
    this.hasAnswered.set(false);
    this.totalCorrect.set(0);
    this.totalAnswered.set(0);
    this.interpretationService.goToGroup(0);
  }

  /**
   * Seleciona uma resposta
   */
  selectAnswer(optionIndex: number) {
    if (this.hasAnswered()) return;
    this.selectedAnswer.set(optionIndex);
  }

  /**
   * Verifica a resposta
   */
  verifyAnswer() {
    const question = this.currentQuestion();
    if (!question || this.selectedAnswer() === null) return;

    const correct = this.selectedAnswer() === question.correctIndex;
    this.isCorrect.set(correct);
    this.hasAnswered.set(true);
    this.totalAnswered.update(n => n + 1);

    if (correct) {
      this.totalCorrect.update(n => n + 1);
      this.contentService.updateStats(true, question.difficulty, question.subject);
    } else {
      this.contentService.updateStats(false, question.difficulty, question.subject);
    }

    // Record question in session
    this.activitySession.recordQuestion(question.difficulty);

    // Record attempt for spaced repetition with 'interpretation' context
    this.questionHistory.recordAttempt(question.id, correct, 'interpretation');
  }

  /**
   * Avança para próxima questão
   */
  nextQuestion() {
    const activeQs = this.activeQuestions();
    if (!activeQs.length) return;

    // Se ainda há questões dentro do limite escolhido
    if (this.currentQuestionIndex() < activeQs.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
      this.resetQuestionState();
    } else {
      // Todas as questões respondidas — mostrar resultado
      this.showFinalResults();
    }
  }

  /**
   * Reseta estado da questão atual
   */
  private resetQuestionState() {
    this.selectedAnswer.set(null);
    this.hasAnswered.set(false);
    this.isCorrect.set(false);
  }

  /**
   * Mostra resultados finais
   */
  private showFinalResults() {
    // Complete session and award bonus XP
    const bonusXP = this.activitySession.completeSession();
    if (bonusXP > 0) {
      console.log(`🎊 Interpretação completa! Bônus: +${bonusXP} XP`);
    }
    this.celebrationXP.set(bonusXP);
    this.viewState.set('result');
  }

  /**
   * Finaliza e retorna à config
   */
  finishAndReturn() {
    this.backToConfig();
  }

  /**
   * Verifica se opção está selecionada
   */
  isSelected(optionIndex: number): boolean {
    return this.selectedAnswer() === optionIndex;
  }

  /**
   * Verifica se é a resposta correta (após verificar)
   */
  isCorrectOption(optionIndex: number): boolean {
    if (!this.hasAnswered()) return false;
    const question = this.currentQuestion();
    return question ? question.correctIndex === optionIndex : false;
  }

  /**
   * Verifica se é a resposta errada selecionada (após verificar)
   */
  isWrongOption(optionIndex: number): boolean {
    if (!this.hasAnswered()) return false;
    return this.isSelected(optionIndex) && !this.isCorrectOption(optionIndex);
  }

  /**
   * Pode verificar a resposta
   */
  canVerify(): boolean {
    return this.selectedAnswer() !== null && !this.hasAnswered();
  }

  /**
   * Progresso atual
   */
  getProgress(): string {
    const group = this.currentGroup();
    if (!group) return '';

    const questionNum = this.currentQuestionIndex() + 1;
    const totalQuestions = group.questions.length;
    const groupNum = this.interpretationService.getCurrentIndex() + 1;
    const totalGroups = this.interpretationService.totalGroups();

    return `Grupo ${groupNum}/${totalGroups} - Questão ${questionNum}/${totalQuestions}`;
  }

  /**
   * Converte índice para letra (0 → A, 1 → B, etc.)
   */
  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
