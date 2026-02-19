import { Component, inject, computed, signal, output, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { AIService } from '../../services/ai.service';
import { LevelIndicatorComponent } from '../level-indicator/level-indicator.component';
import { ChallengesCardComponent } from '../challenges-card/challenges-card.component';
import { AchievementModalComponent } from '../achievement-modal/achievement-modal.component';
import { AchievementsService } from '../../services/achievements.service';
import type { Achievement } from '../../types/gamification.types';

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

  onStartQuiz() {
    this.navigate.emit('quiz');
  }

  async ngOnInit() {
    // Automatically sync with AI on load (uses 12h cache internally)
    this.syncWithAI();
  }

  async syncWithAI() {
    try {
      const data = await this.aiService.getExamCalendar();
      if (data && data.length > 0) {
        const updatedExams = data.map((exam, index) => ({
          name: exam.name,
          date: new Date(exam.date),
          color: index === 0 ? 'bg-black' : 'bg-slate-700',
          icon: index === 0 ? 'fa-graduation-cap' : 'fa-university'
        }));
        this.exams.set(updatedExams);
      }
    } catch (error) {
      console.error('Failed to sync dates via AI');
    }
  }

  // --- Exam Dates ---
  exams = signal([
    {
      name: 'ETEC 2027/1',
      date: new Date('2026-08-14'),
      color: 'bg-black',
      icon: 'fa-graduation-cap'
    },
    {
      name: 'IFSP Jundiaí',
      date: new Date('2026-08-21'),
      color: 'bg-slate-700',
      icon: 'fa-university'
    }
  ]);

  getDaysRemaining(targetDate: Date): number {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}