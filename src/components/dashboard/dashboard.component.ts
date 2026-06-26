import { Component, inject, computed, signal, output, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { AIService } from '../../services/ai.service';
import { LevelIndicatorComponent } from '../level-indicator/level-indicator.component';
import { ChallengesCardComponent } from '../challenges-card/challenges-card.component';
import { AchievementModalComponent } from '../achievement-modal/achievement-modal.component';
import { AchievementsService } from '../../services/achievements.service';
import type { Achievement } from '../../types/gamification.types';
import { UserDataService } from '../../services/user-data.service';
import { ChallengesService } from '../../services/challenges.service';
import { InterpretationService } from '../../services/interpretation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LevelIndicatorComponent, ChallengesCardComponent, AchievementModalComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  contentService = inject(ContentService);
  aiService = inject(AIService);
  private achievementsService = inject(AchievementsService);
  private userDataService = inject(UserDataService);
  challengesService = inject(ChallengesService);
  private interpretationService = inject(InterpretationService);

  activeTab = signal<'resumo' | 'desafios'>('resumo');

  stats = this.contentService.stats;

  // Achievement modal state
  showAchievementModal = signal(false);
  currentAchievement = signal<Achievement | null>(null);

  // Output signal for navigation
  navigate = output<string>();

  accuracy = computed(() => {
    const total = this.stats().questionsAnswered;
    if (total === 0) return 0;
    return Math.round((this.stats().correctAnswers / total) * 100);
  });

  xpProgress = computed(() => {
    const xp = this.stats().xp;
    const level = this.stats().level;
    const xpForNextLevel = level * 1000;
    const xpForCurrentLevel = (level - 1) * 1000;

    // Calculate percentage within current level
    const currentLevelProgress = xp - xpForCurrentLevel;
    const levelRange = xpForNextLevel - xpForCurrentLevel;

    return Math.min(Math.max((currentLevelProgress / levelRange) * 100, 0), 100);
  });

  userRank = computed(() => {
    const level = this.stats().level;
    if (level < 5) return 'Aspirante ETEC';
    if (level < 10) return 'Estudante Dedicado';
    if (level < 20) return 'Veterano dos Estudos';
    return 'Mestre do Vestibulinho';
  });

  motivationalMessage = computed(() => {
    const acc = this.accuracy();
    if (this.stats().questionsAnswered === 0) return "Comece seus estudos hoje!";
    if (acc >= 80) return "Excelente! Você está no caminho certo.";
    if (acc >= 60) return "Muito bom, continue praticando para melhorar.";
    return "Não desanime! Revise os conteúdos e tente novamente.";
  });

  // --- Real Frequency Data (quiz + interpretation) ---
  frequencyData = computed(() => {
    const userData = this.userDataService.getUserData();
    if (!userData) return [];

    const quizHistory = userData.user.questionHistory || [];
    const interpretationHistory = userData.user.interpretationHistory || [];
    const allHistory = [...quizHistory, ...interpretationHistory];

    const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const result = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const count = allHistory.filter(h =>
        h.timestamp >= date.getTime() && h.timestamp < nextDate.getTime()
      ).length;
      result.push({
        label: days[date.getDay()],
        value: count,
        percentage: 0
      });
    }

    const max = Math.max(...result.map(d => d.value), 1) || 1;
    return result.map(d => ({ ...d, percentage: (d.value / (max * 1.2)) * 100 }));
  });

  // --- Real Subject Distribution (quiz + interpretation) ---
  subjectDistribution = computed(() => {
    const userData = this.userDataService.getUserData();
    if (!userData) {
        return [
            { name: 'Matemática', percentage: 0, color: 'bg-blue-600' },
            { name: 'Português', percentage: 0, color: 'bg-red-500' },
            { name: 'Ciências', percentage: 0, color: 'bg-green-500' },
            { name: 'Humanas', percentage: 0, color: 'bg-yellow-500' }
        ];
    }

    const quizHistory = userData.user.questionHistory || [];
    const interpretationHistory = userData.user.interpretationHistory || [];
    const allHistory = [...quizHistory, ...interpretationHistory];

    if (allHistory.length === 0) {
        return [
            { name: 'Matemática', percentage: 0, color: 'bg-blue-600' },
            { name: 'Português', percentage: 0, color: 'bg-red-500' },
            { name: 'Ciências', percentage: 0, color: 'bg-green-500' },
            { name: 'Humanas', percentage: 0, color: 'bg-yellow-500' }
        ];
    }

    const questions = this.contentService.getQuestions();
    const interpretationGroups = this.interpretationService.getGroups();
    const interpretationQuestions = interpretationGroups.flatMap(g => g.questions);
    const allQuestions = [...questions, ...interpretationQuestions];

    const stats: Record<string, number> = {};
    let total = 0;

    allHistory.forEach(h => {
        const q = allQuestions.find(q => q.id === h.questionId);
        if (q) {
            let cat = q.subject;
            if (cat.includes('Ciências')) cat = 'Ciências';
            if (cat === 'História' || cat === 'Geografia') cat = 'Humanas';
            if (cat === 'Língua Portuguesa') cat = 'Português';
            stats[cat] = (stats[cat] || 0) + 1;
            total++;
        }
    });

    const colors: Record<string, string> = {
        'Matemática': 'bg-blue-600',
        'Português': 'bg-red-500',
        'Ciências': 'bg-green-500',
        'Humanas': 'bg-yellow-500'
    };

    return Object.entries(stats).map(([name, count]) => ({
        name,
        percentage: Math.round((count / total) * 100),
        color: colors[name] || 'bg-slate-500'
    })).sort((a, b) => b.percentage - a.percentage);
  });

  onStartQuiz() {
    this.navigate.emit('quiz');
  }

  async ngOnInit() {
    // Automatically sync with AI on load (uses 12h cache internally)
    this.syncWithAI();
  }

  async syncWithAI(force: boolean = false) {
    try {
      const data = await this.aiService.getExamCalendar(force);
      if (data && data.length > 0) {
        const updatedExams = data.map((exam, index) => {
          let parsedDate: Date | string = exam.date;
          if (exam.date && exam.date !== 'Nada até o momento') {
            const dateObj = new Date(exam.date);
            if (!isNaN(dateObj.getTime())) {
              parsedDate = dateObj;
            }
          }
          return {
            name: exam.name,
            date: parsedDate,
            color: index === 0 ? 'bg-black' : 'bg-slate-700',
            icon: index === 0 ? 'fa-graduation-cap' : 'fa-university'
          };
        });
        this.exams.set(updatedExams as any);
      }
    } catch (error) {
      console.error('Failed to sync dates via AI');
    }
  }

  // --- Exam Dates (fallback inicial, sobrescrito pela IA) ---
  exams = signal<Array<{ name: string; date: Date | string; color: string; icon: string }>>([
    {
      name: 'ETEC 2027/1',
      date: new Date('2026-12-06'),
      color: 'bg-black',
      icon: 'fa-graduation-cap'
    },
    {
      name: 'IFSP Jundiaí',
      date: new Date('2026-12-13'),
      color: 'bg-slate-700',
      icon: 'fa-university'
    }
  ]);

  getDaysRemaining(targetDate: Date | string): number | string {
    if (typeof targetDate === 'string' || !(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
      return '-';
    }
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}