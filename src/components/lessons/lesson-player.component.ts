import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from './player/video-player.component';

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent],
  templateUrl: './lesson-player.component.html',
  styleUrl: './lesson-player.component.css'
})
export class LessonPlayerComponent {
  @Input({ required: true }) lesson!: any;
  @Output() close = new EventEmitter<void>();
  @Output() completed = new EventEmitter<string>();

  canComplete = signal(false);


  onVideoEnded() {
    this.canComplete.set(true);
    console.log('✅ Video concluded. XP unlocked.');
  }

  markAsCompleted() {
    if (!this.canComplete()) return;
    this.completed.emit(this.lesson.id);
    this.close.emit();
  }
}
