import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, StudySession } from '../../services/content.service';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent {
  contentService = inject(ContentService);
  geminiService = inject(GeminiService);

  schedule = this.contentService.schedule;

  // Form State
  newItem = signal({
    day: 'Segunda-feira',
    subject: 'Matemática',
    topic: '',
    duration: '1h'
  });

  days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  subjects = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Atualidades'];

  isLoadingAI = signal(false);

  addManualItem() {
    if (!this.newItem().topic.trim()) return;

    this.contentService.addScheduleItem({
      day: this.newItem().day,
      subject: this.newItem().subject,
      topic: this.newItem().topic,
      duration: this.newItem().duration
    });

    // Reset topic only, keep day/subject for convenience
    this.newItem.update(v => ({ ...v, topic: '' }));
  }

  removeItem(id: string) {
    this.contentService.removeScheduleItem(id);
  }

  async generateAISchedule() {
    if (this.schedule().length > 0) {
      if (!confirm('Isso irá substituir seu cronograma atual. Deseja continuar?')) return;
    }

    this.isLoadingAI.set(true);

    try {
      const newScheduleRaw = await this.geminiService.generateStudySchedule();

      if (!newScheduleRaw || newScheduleRaw.length === 0) {
        alert("Não foi possível gerar o cronograma. Tente novamente mais tarde.");
        return;
      }

      // Add IDs to the raw response
      const formattedSchedule: StudySession[] = newScheduleRaw.map((item: any) => ({
        id: crypto.randomUUID(),
        day: item.day,
        subject: item.subject,
        topic: item.topic,
        duration: item.duration
      }));

      this.contentService.setSchedule(formattedSchedule);
    } catch (e) {
      alert("Erro ao conectar com a IA.");
    } finally {
      this.isLoadingAI.set(false);
    }
  }

  // Helper to group items by day for display
  getItemsForDay(day: string) {
    return this.schedule().filter(i => i.day === day);
  }
}