import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, StudySession } from '../../services/content.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent {
  contentService = inject(ContentService);

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

  // Helper to group items by day for display
  getItemsForDay(day: string) {
    return this.schedule().filter(i => i.day === day);
  }
}