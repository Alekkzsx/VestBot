//cuidado com erro de looping e bugas npm run dev
import { Injectable, signal, inject, effect, untracked } from '@angular/core';
import { QuestionLoaderService } from './question-loader.service';
import { UserDataService } from './user-data.service';
import { AchievementsService } from './achievements.service';
import { ChallengesService } from './challenges.service';
import { ActivitySessionService } from './activity-session.service';

export interface Question {
  id: number;
  subject: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  imageUrl?: string;        // URL or path to question image
  supportText?: string;      // Support/reference text for context
  groupId?: number;          // Groups related questions together
  theme?: string;            // Question theme/topic
}

export interface StudySession {
  id: string;
  day: string;
  subject: string;
  topic: string;
  duration: string; // e.g. "2h" or "30min"
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private questionLoader = inject(QuestionLoaderService);
  private userDataService = inject(UserDataService);
  private achievementsService = inject(AchievementsService);
  private challengesService = inject(ChallengesService);
  private activitySessionService = inject(ActivitySessionService);

  // Local questions loaded from files
  private loadedQuestions = signal<Question[]>([]);

  // Fallback database focused on ETEC themes (kept for backward compatibility)
  private fallbackQuestions: Question[] = [
    {
      id: 90001,
      subject: 'Ciências',
      text: 'O conceito de desenvolvimento sustentável, fundamental para a preservação do meio ambiente, propõe:',
      options: [
        'A interrupção total do crescimento econômico.',
        'O uso esgotável dos recursos naturais.',
        'Atender às necessidades do presente sem comprometer as gerações futuras.',
        'A substituição de florestas por áreas agrícolas.',
        'O aumento do consumo de combustíveis fósseis.'
      ],
      correctIndex: 2,
      difficulty: 'Fácil'
    },
    {
      id: 90002,
      subject: 'Matemática',
      text: 'Para reciclar alumínio, gasta-se apenas 5% da energia necessária para produzi-lo a partir do minério. Se a produção inicial gasta 100 kWh, quanta energia é economizada ao reciclar?',
      options: ['5 kWh', '95 kWh', '50 kWh', '20 kWh', '10 kWh'],
      correctIndex: 1,
      difficulty: 'Médio'
    },
    {
      id: 90003,
      subject: 'Geografia',
      text: 'A cidadania no Brasil implica direitos e deveres. Qual das alternativas representa um dever fundamental do cidadão em relação ao meio ambiente, segundo a Constituição?',
      options: [
        'Desmatar áreas privadas para construção.',
        'Defender e preservar o meio ambiente para as presentes e futuras gerações.',
        'Ignorar a coleta seletiva de lixo.',
        'Priorizar o transporte individual motorizado.',
        'Queimar resíduos sólidos em quintais.'
      ],
      correctIndex: 1,
      difficulty: 'Fácil'
    },
    {
      id: 90004,
      subject: 'Língua Portuguesa',
      text: 'Na frase "A reciclagem é vital, PORÉM, poucos praticam", a conjunção destacada expressa ideia de:',
      options: ['Adição', 'Explicação', 'Conclusão', 'Oposição', 'Alternância'],
      correctIndex: 3,
      difficulty: 'Médio'
    },
    {
      id: 90005,
      subject: 'Ciências',
      text: 'O aquecimento global é agravado pelo efeito estufa. Qual gás é o principal responsável por esse fenômeno quando emitido em excesso pela queima de combustíveis fósseis?',
      options: ['Oxigênio (O2)', 'Nitrogênio (N2)', 'Dióxido de Carbono (CO2)', 'Hélio (He)', 'Hidrogênio (H2)'],
      correctIndex: 2,
      difficulty: 'Médio'
    },
    {
      id: 90006,
      subject: 'Atualidades',
      text: 'Qual das alternativas abaixo é uma prática recomendada para combater o desperdício de água nas cidades?',
      options: [
        'Lavar calçadas com mangueira diariamente.',
        'Banhos demorados.',
        'Reuso de água da chuva e da máquina de lavar.',
        'Deixar torneiras pingando.',
        'Não consertar vazamentos.'
      ],
      correctIndex: 2,
      difficulty: 'Fácil'
    },
    {
      id: 90007,
      subject: 'Matemática',
      text: 'Um tanque com 1000 litros de água vaza 50ml por minuto. Em quanto tempo o tanque perderá 3 litros?',
      options: ['30 minutos', '45 minutos', '60 minutos', '15 minutos', '90 minutos'],
      correctIndex: 2,
      difficulty: 'Difícil'
    },
    {
      id: 90008,
      subject: 'Geografia',
      text: 'O processo de urbanização no Brasil se intensificou a partir da década de 1950. Qual foi o principal fator impulsionador?',
      options: ['Reforma Agrária', 'Industrialização', 'Êxodo Urbano', 'Mineração', 'Turismo'],
      correctIndex: 1,
      difficulty: 'Médio'
    },
    {
      id: 90009,
      subject: 'História',
      text: 'A Revolução Industrial transformou as relações de trabalho. Qual classe social surgiu com o fortalecimento das indústrias?',
      options: ['Nobreza', 'Clero', 'Proletariado', 'Feudal', 'Escravos'],
      correctIndex: 2,
      difficulty: 'Fácil'
    },
    {
      id: 90010,
      subject: 'Matemática',
      text: 'Se um produto custa R$ 120,00 e tem um desconto de 20%, qual o valor final?',
      options: ['R$ 100,00', 'R$ 96,00', 'R$ 90,00', 'R$ 110,00', 'R$ 24,00'],
      correctIndex: 1,
      difficulty: 'Fácil'
    },
    {
      id: 90011,
      subject: 'Ciências',
      text: 'Qual é a principal função da fotossíntese para as plantas?',
      options: ['Produzir oxigênio para os humanos', 'Produzir seu próprio alimento (glicose)', 'Absorver calor', 'Proteger contra pragas', 'Consumir terra'],
      correctIndex: 1,
      difficulty: 'Médio'
    },
    {
      id: 90012,
      subject: 'Língua Portuguesa',
      text: 'Assinale a alternativa onde o uso da crase está CORRETO:',
      options: ['Vou à comprar pão.', 'Fomos à pé.', 'Chegamos à cidade.', 'Ela falou à todos.', 'Entreguei o livro à ele.'],
      correctIndex: 2,
      difficulty: 'Difícil'
    },
    {
      id: 90013,
      subject: 'Atualidades',
      text: 'Qual bioma brasileiro tem sofrido com recordes de queimadas nos últimos anos, afetando a biodiversidade do Centro-Oeste?',
      options: ['Amazônia', 'Pampas', 'Caatinga', 'Pantanal', 'Mata de Araucárias'],
      correctIndex: 3,
      difficulty: 'Médio'
    },
    {
      id: 90014,
      subject: 'Ciências',
      text: 'A energia cinética está relacionada ao:',
      options: ['Calor', 'Movimento', 'Altura', 'Som', 'Luz'],
      correctIndex: 1,
      difficulty: 'Fácil'
    },
    {
      id: 90015,
      subject: 'Ciências',
      text: 'A água é uma substância composta por dois elementos químicos. Quais são?',
      options: ['Hélio e Oxigênio', 'Hidrogênio e Nitrogênio', 'Carbono e Oxigênio', 'Hidrogênio e Oxigênio', 'Nitrogênio e Carbono'],
      correctIndex: 3,
      difficulty: 'Fácil'
    },
    {
      id: 90016,
      subject: 'Ciências',
      text: 'Qual organela celular é responsável pela respiração celular e produção de energia?',
      options: ['Ribossomo', 'Lisossomo', 'Mitocôndria', 'Complexo de Golgi', 'Núcleo'],
      correctIndex: 2,
      difficulty: 'Difícil'
    },
    {
      id: 90017,
      subject: 'História',
      text: 'Quem foi o presidente do Brasil conhecido como "Pai dos Pobres" e criador da CLT?',
      options: ['Juscelino Kubitschek', 'Getúlio Vargas', 'Marechal Deodoro', 'Dom Pedro II', 'Lula'],
      correctIndex: 1,
      difficulty: 'Médio'
    },
    {
      id: 90018,
      subject: 'Geografia',
      text: 'A Mata Atlântica é um bioma que abrange a costa brasileira. Qual sua principal característica atual?',
      options: ['Está intocada.', 'É o bioma mais preservado.', 'Resta menos de 15% da cobertura original.', 'É um deserto.', 'Só existe no sul.'],
      correctIndex: 2,
      difficulty: 'Médio'
    },
    {
      id: 90019,
      subject: 'Matemática',
      text: 'A área de um quadrado de lado 5cm é:',
      options: ['10 cm²', '20 cm²', '25 cm²', '15 cm²', '5 cm²'],
      correctIndex: 2,
      difficulty: 'Fácil'
    },
    {
      id: 90020,
      subject: 'Língua Portuguesa',
      text: 'Identifique o sujeito na frase: "Os alunos da ETEC passaram no vestibulinho."',
      options: ['Passaram', 'Vestibulinho', 'Os alunos da ETEC', 'ETEC', 'Indeterminado'],
      correctIndex: 2,
      difficulty: 'Fácil'
    }
  ];

  stats = signal({
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    xp: 0,
    level: 1,
    essaysWritten: 0
  });

  schedule = signal<StudySession[]>([]);

  isInitialized = signal(false);

  constructor() {
    // Load data from backend on initialization
    this.initializeData();
    // Load questions on startup
    this.loadQuestionsFromFiles();

    // Granular Auto-saves
    // Effect to auto-save stats on change
    effect(() => {
      const stats = this.stats();
      if (!this.isInitialized()) return;
      if (stats) {
        this.userDataService.saveUserProfile(stats); // Changed from saveStats to saveUserProfile to match existing code
      }
    });

    // Effect to auto-save gamification data
    effect(() => {
      const achievements = this.achievementsService.unlockedAchievements();
      const challenges = this.challengesService.userChallenges();
      const current = untracked(() => this.userDataService.getUserData()?.user.gamification);

      if (!this.isInitialized()) return;

      // Merge with existing data to avoid overwriting stats
      this.userDataService.saveGamificationData({
        achievements: achievements.length > 0 ? achievements : (current?.achievements || []),
        challenges: challenges.length > 0 ? challenges : (current?.challenges || []),
        completedSessions: [], // Moved to sessions.json
        consecutiveCorrect: current?.consecutiveCorrect || 0,
        subjectStats: current?.subjectStats || []
      });
    });

    effect(() => {
      const currentSchedule = this.schedule();
      if (!this.isInitialized()) return;
      this.userDataService.saveUserSchedule(currentSchedule);
    });
  }

  /**
   * Initialize data from backend
   */
  private async initializeData(): Promise<void> {
    try {
      // Load data from backend
      const userData = await this.userDataService.loadUserData();

      // Update stats (This will trigger the stats effect, but UserDataService handles it)
      this.stats.set(userData.user.stats);

      // Update schedule (This will trigger the schedule effect)
      this.schedule.set(userData.user.schedule);

      // Populate completed sessions from backend
      const savedSessions = userData.user.sessions;
      if (savedSessions && savedSessions.length > 0) {
        this.activitySessionService.loadCompletedSessions(savedSessions);
      }

      console.log('✅ ContentService initialized with backend data');
      this.isInitialized.set(true);
    } catch (error) {
      console.error('❌ Error initializing data:', error);
      this.isInitialized.set(true);
    }
  }

  /**
   * Load questions from local files via HTTP
   */
  async loadQuestionsFromFiles(filenames?: string[]): Promise<void> {
    try {
      let questions: Question[];

      if (filenames && filenames.length > 0) {
        questions = await this.questionLoader.loadQuestionsFromFiles(filenames);
      } else {
        // Load all questions by default
        questions = await this.questionLoader.loadAllQuestions();
      }

      this.loadedQuestions.set(questions);
      console.log(`ContentService: Loaded ${questions.length} questions total`);
    } catch (error) {
      console.error('Error loading questions from files:', error);
      // Keep using fallback questions
    }
  }

  /**
   * Get all available questions (from files or fallback)
   */
  getQuestions(): Question[] {
    const loaded = this.loadedQuestions();
    return loaded.length > 0 ? [...loaded] : [...this.fallbackQuestions];
  }

  /**
   * Standard ETEC subjects
   */
  private readonly STANDARD_SUBJECTS = [
    'Língua Portuguesa',
    'Matemática',
    'Ciências',
    'História',
    'Geografia',
    'Atualidades',
  ];

  /**
   * Get main subjects for the ETEC vestibulinho.
   * Reflects exactly the subjects present in the question dataset.
   */
  getSubjects(): string[] {
    return [
      'Língua Portuguesa',
      'Matemática',
      'Ciências — Biologia',
      'Ciências — Química',
      'Ciências — Física',
      'História',
      'Geografia'
    ];
  }

  /**
   * Get available question files
   */
  getAvailableFiles() {
    return this.questionLoader.availableFiles;
  }

  /**
   * Get question loading state
   */
  isLoadingQuestions() {
    return this.questionLoader.isLoading();
  }

  /**
   * Get loading progress
   */
  getLoadingProgress() {
    return this.questionLoader.loadingProgress();
  }

  updateStats(isCorrect: boolean, difficulty: string = 'Médio', subject?: string) {
    // 1. Calculate and update Daily Frequency Streak
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const userData = this.userDataService.getUserData();
    let frequency = userData?.user.frequency?.studyDays || [];
    
    if (!frequency.includes(today)) {
        frequency = [...frequency, today];
        this.userDataService.saveUserFrequency({ studyDays: frequency });
    }

    // Calculate actual daily streak
    let calculatedDailyStreak = 0;
    const sortedDays = [...frequency].sort((a, b) => b.localeCompare(a));
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    
    // Check if user studied today or yesterday to maintain streak
    if (sortedDays.length > 0) {
        const lastStudyDate = new Date(sortedDays[0]);
        lastStudyDate.setHours(0,0,0,0);
        
        const diffTime = Math.abs(currentDate.getTime() - lastStudyDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) {
            calculatedDailyStreak = 1;
            // Count backwards
            for (let i = 0; i < sortedDays.length - 1; i++) {
                const d1 = new Date(sortedDays[i]);
                const d2 = new Date(sortedDays[i+1]);
                d1.setHours(0,0,0,0);
                d2.setHours(0,0,0,0);
                const diff = Math.round(Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
                if (diff === 1) {
                    calculatedDailyStreak++;
                } else {
                    break;
                }
            }
        }
    }

    this.stats.update(val => {
      // Cálculo de XP: Máximo 20 XP por acerto, dependendo da dificuldade
      let earnedXp = 0;
      if (isCorrect) {
        if (difficulty === 'Fácil') earnedXp = 10;
        else if (difficulty === 'Médio') earnedXp = 15;
        else if (difficulty === 'Difícil') earnedXp = 20;
        else earnedXp = 15;
      } else {
        // XP de esforço ao errar
        if (difficulty === 'Fácil') earnedXp = 2;
        else if (difficulty === 'Médio') earnedXp = 3;
        else if (difficulty === 'Difícil') earnedXp = 5;
        else earnedXp = 3;
      }

      const newXp = val.xp + earnedXp;

      // Level Calculation: 1000 XP per level
      const newLevel = Math.floor(newXp / 1000) + 1;

      // Note: we update currentStreak to be the REAL daily streak now!
      const newStats = {
        ...val,
        questionsAnswered: val.questionsAnswered + 1,
        correctAnswers: isCorrect ? val.correctAnswers + 1 : val.correctAnswers,
        currentStreak: calculatedDailyStreak,
        xp: newXp,
        level: newLevel
      };

      // Update challenges
      this.challengesService.updateProgress('daily_questions', 1);
      if (isCorrect) {
        this.challengesService.updateProgress('daily_correct', 1);
      }
      if (subject) {
        this.challengesService.updateProgress(`daily_subject_${subject}`, 1);
      }

      // Check for achievements
      this.achievementsService.checkAchievements(newStats);

      return newStats;
    });

    // Auto-save is triggered by effect
  }

  /**
   * Adiciona XP extra (bônus de conclusão de sessão) sem incrementar contagem de questões.
   */
  addBonusXP(amount: number) {
    if (amount <= 0) return;
    this.stats.update(val => {
      const newXp = val.xp + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;
      return { ...val, xp: newXp, level: newLevel };
    });
  }

  incrementEssayCount() {
    this.stats.update(val => {
      // XP for essay: 100 XP
      const earnedXp = 100;
      const newXp = val.xp + earnedXp;
      const newLevel = Math.floor(newXp / 1000) + 1;

      return {
        ...val,
        essaysWritten: (val.essaysWritten || 0) + 1,
        xp: newXp,
        level: newLevel
      };
    });

    // Auto-save is triggered by effect
  }

  resetStats() {
    this.stats.update(val => ({
      ...val,
      questionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0
    }));
  }

  addScheduleItem(item: Omit<StudySession, 'id'>) {
    this.schedule.update(items => [...items, { ...item, id: crypto.randomUUID() }]);
  }

  removeScheduleItem(id: string) {
    this.schedule.update(items => items.filter(i => i.id !== id));
  }

  setSchedule(items: StudySession[]) {
    this.schedule.set(items);
  }

  /**
   * Shuffles the options of a question and updates the correctIndex
   */
  shuffleQuestion(question: Question): Question {
    if (!question || !question.options || question.options.length === 0) {
      return question;
    }

    const options = [...question.options];
    const correctOptionText = options[question.correctIndex];

    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    const newCorrectIndex = options.indexOf(correctOptionText);

    return {
      ...question,
      options,
      correctIndex: newCorrectIndex !== -1 ? newCorrectIndex : question.correctIndex
    };
  }
}