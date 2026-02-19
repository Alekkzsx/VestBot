import { Component, inject, signal, HostListener, ChangeDetectionStrategy, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIService } from '../../services/ai.service';

@Component({
    selector: 'app-ai-dictionary',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (isVisible()) {
      <div 
        class="ai-tooltip fixed z-[9999] animate-fade-in pointer-events-none"
        [style.top.px]="y() - 10"
        [style.left.px]="x()"
      >
        <div class="relative -translate-x-1/2 -translate-y-full bg-black text-white p-3 rounded-xl shadow-2xl border border-slate-700 max-w-[280px] pointer-events-auto">
          <!-- Arrow -->
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black"></div>
          
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between gap-4 mb-1 border-b border-white/10 pb-1">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Dicionário IA</span>
              <i class="fas fa-brain text-[8px] text-white/50"></i>
            </div>
            
            @if (isLoading()) {
              <div class="flex items-center gap-2 py-2">
                <div class="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <span class="text-[10px] font-medium text-slate-300">Definindo "{{ selectedWord() }}"...</span>
              </div>
            } @else {
               <div class="mb-1 text-xs font-black text-white tracking-tight">"{{ selectedWord() }}"</div>
               <p class="text-[11px] leading-snug text-slate-200 font-medium">
                 {{ definition() }}
               </p>
            }
          </div>
        </div>
      </div>
    }
  `,
    styles: [`
    .ai-tooltip {
      transition: opacity 0.2s ease-out;
    }
    .animate-fade-in {
      animation: fadeIn 0.15s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AIDictionaryComponent {
    private aiService = inject(AIService);

    isVisible = signal(false);
    isLoading = signal(false);
    selectedWord = signal('');
    definition = signal('');

    x = signal(0);
    y = signal(0);

    @HostListener('document:mouseup', ['$event'])
    async onMouseUp(event: MouseEvent) {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 1 && text.split(/\s+/).length <= 3) {
            // It's a valid selection (word or short phrase)
            const range = selection?.getRangeAt(0);
            const rect = range?.getBoundingClientRect();

            if (rect) {
                this.selectedWord.set(text);
                this.x.set(rect.left + rect.width / 2);
                this.y.set(rect.top + window.scrollY);
                this.isVisible.set(true);
                this.isLoading.set(true);
                this.definition.set('');

                try {
                    // Get context (nearby text)
                    const context = range?.startContainer.parentElement?.textContent?.substring(0, 200);
                    const result = await this.aiService.defineWord(text, context || undefined);
                    this.definition.set(result.definition);
                } catch (e) {
                    this.definition.set('Não foi possível carregar a definição.');
                } finally {
                    this.isLoading.set(false);
                }
            }
        } else {
            // Close if clicked elsewhere or no valid selection
            // But don't close if clicking inside the tooltip (pointer-events-auto handles interaction, but let's be safe)
            const target = event.target as HTMLElement;
            if (!target.closest('.ai-tooltip')) {
                this.isVisible.set(false);
            }
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.ai-tooltip')) {
            this.isVisible.set(false);
        }
    }
}
