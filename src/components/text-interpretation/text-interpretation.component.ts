import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-interpretation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-interpretation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInterpretationComponent {
  // Componente mantido para futuras implementações
}