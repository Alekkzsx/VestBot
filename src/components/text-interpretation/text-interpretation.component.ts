import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../services/gemini.service';
import { ContentService } from '../../services/content.service';

interface Question {
  statement: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Activity {
  title: string;
  textContent: string;
  questions: Question[];
}

@Component({
  selector: 'app-text-interpretation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-interpretation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInterpretationComponent {
  geminiService = inject(GeminiService);
  contentService = inject(ContentService);

  activity = signal<Activity | null>(null);
  loading = signal(false);

  // Answers state
  selectedOptions = signal<Record<number, number>>({});
  showResults = signal(false);
  score = signal(0);

  async generateActivity() {
    this.loading.set(true);
    this.activity.set(null);
    this.selectedOptions.set({});
    this.showResults.set(false);
    this.score.set(0);

    const result = await this.geminiService.generateInterpretationActivity();

    if (result) {
      this.activity.set(result);
    } else {
      alert("Não foi possível gerar o texto. Tente novamente.");
    }
    this.loading.set(false);
  }

  selectOption(qIndex: number, optionIndex: number) {
    if (this.showResults()) return;
    this.selectedOptions.update(curr => ({ ...curr, [qIndex]: optionIndex }));
  }

  checkAnswers() {
    const act = this.activity();
    if (!act) return;

    let correctCount = 0;
    act.questions.forEach((q, idx) => {
      const selected = this.selectedOptions()[idx];
      if (selected === q.correctIndex) {
        correctCount++;
        this.contentService.updateStats(true); // Grant XP for each correct answer
      } else {
        this.contentService.updateStats(false); // Small XP for effort
      }
    });

    this.score.set(correctCount);
    this.showResults.set(true);
  }

  isQuestionAnswered(index: number): boolean {
    return this.selectedOptions()[index] !== undefined;
  }

  allAnswered(): boolean {
    const act = this.activity();
    if (!act) return false;
    return act.questions.every((_, idx) => this.isQuestionAnswered(idx));
  }
}