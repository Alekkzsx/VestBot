import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryEntry } from '../../services/dictionary.service';

@Component({
    selector: 'app-word-popup',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './word-popup.component.html',
    styleUrl: './word-popup.component.css'
})
export class WordPopupComponent {
    @Input() word: string = '';
    @Input() definitions: DictionaryEntry[] | null = null;
    @Input() position: { x: number, y: number } = { x: 0, y: 0 };
    @Input() visible: boolean = false;

    @Output() close = new EventEmitter<void>();

    // Signal for visibility animation
    isAnimating = signal(false);

    constructor() {
        // Trigger animation when visibility changes
        effect(() => {
            if (this.visible) {
                this.isAnimating.set(true);
            } else {
                this.isAnimating.set(false);
            }
        });
    }

    closePopup() {
        this.close.emit();
    }

    getPopupStyle() {
        return {
            position: 'fixed',
            left: `${this.position.x}px`,
            top: `${this.position.y}px`,
            transform: 'translate(-50%, -110%)'
        };
    }
}
