import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIService } from '../../../services/ai.service';

interface LessonSummary {
  type: string;
  query: string;
  intro: string;
  keyPoints: string[];
  memorizeTip: string;
  sources: { title: string; url: string; source: string }[];
}

@Component({
  selector: 'app-web-research',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in-up">

      <!-- Header -->
      <div class="flex items-center gap-6 mb-12">
        <div class="w-14 h-14 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 text-xl shadow-sm">
          <i class="fas fa-brain"></i>
        </div>
        <div>
          <h2 class="text-3xl font-black text-slate-900">Resumo Inteligente</h2>
          <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Gerado por IA · Fontes Acadêmicas</p>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="flex flex-col items-center justify-center py-24 animate-fade-in">
          <div class="relative mb-8">
            <div class="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <i class="fas fa-sparkles text-blue-400 text-xs"></i>
            </div>
          </div>
          <p class="text-slate-400 font-bold text-sm animate-pulse">Pesquisando e sintetizando...</p>
          <p class="text-slate-600 text-xs mt-2">Pode levar alguns segundos</p>
        </div>
      }

      <!-- Error State -->
      @if (errorMessage() && !isLoading()) {
        <div class="bg-red-50 border border-red-200 rounded-[2rem] p-10 text-center animate-fade-in shadow-sm">
          <i class="fas fa-triangle-exclamation text-red-500 text-3xl mb-4 block"></i>
          <p class="text-red-700 font-bold mb-6">{{ errorMessage() }}</p>
          <button (click)="generate()"
            class="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm border border-red-700 shadow-sm">
            <i class="fas fa-redo mr-2"></i> Tentar Novamente
          </button>
        </div>
      }

      <!-- Summary Content -->
      @if (summary() && !isLoading()) {
        <div class="space-y-8 animate-fade-in">

          <!-- Intro Card -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-[2rem] p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-8 h-8 rounded-xl bg-blue-200 flex items-center justify-center">
                <i class="fas fa-book-open text-blue-600 text-xs"></i>
              </div>
              <span class="text-blue-700 font-black text-xs uppercase tracking-widest">Introdução</span>
            </div>
            <p class="text-slate-700 leading-relaxed text-base">{{ summary()!.intro }}</p>
          </div>

          <!-- Key Points -->
          <div class="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                <i class="fas fa-list-check text-amber-600 text-xs"></i>
              </div>
              <span class="text-amber-700 font-black text-xs uppercase tracking-widest">Pontos-Chave</span>
            </div>
            <ul class="space-y-4">
              @for (point of summary()!.keyPoints; track $index) {
                <li class="flex items-start gap-4 group">
                  <div class="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-200 transition-colors">
                    <span class="text-amber-600 text-[10px] font-black">{{ $index + 1 }}</span>
                  </div>
                  <p class="text-slate-700 leading-relaxed text-sm">{{ point }}</p>
                </li>
              }
            </ul>
          </div>

          <!-- Memorize Tip -->
          @if (summary()!.memorizeTip) {
            <div class="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-[2rem] p-10 shadow-sm">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-8 h-8 rounded-xl bg-emerald-200 flex items-center justify-center">
                  <i class="fas fa-lightbulb text-emerald-600 text-xs"></i>
                </div>
                <span class="text-emerald-700 font-black text-xs uppercase tracking-widest">Para a Prova</span>
              </div>
              <p class="text-emerald-800 leading-relaxed font-medium">{{ summary()!.memorizeTip }}</p>
            </div>
          }

          <!-- Sources -->
          @if (summary()!.sources.length > 0) {
            <div>
              <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Fontes Consultadas</p>
              <div class="flex flex-wrap gap-3">
                @for (source of summary()!.sources; track source.url) {
                  <a [href]="source.url" target="_blank"
                    class="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-bold px-4 py-2 rounded-full transition-all shadow-sm">
                    <i class="fas fa-external-link-alt text-[9px]"></i>
                    {{ source.source }}
                  </a>
                }
              </div>
            </div>
          }

          <!-- Regenerate -->
          <div class="flex justify-end pt-4">
            <button (click)="regenerate()"
              class="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors">
              <i class="fas fa-rotate-right"></i> Gerar novamente
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class WebResearchComponent implements OnInit {
  @Input({ required: true }) lessonTitle!: string;
  @Input({ required: true }) lessonSubject!: string;
  @Input({ required: true }) lessonId!: string;
  @Output() loadingState = new EventEmitter<boolean>();

  summary = signal<LessonSummary | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private aiService: AIService) { }

  ngOnInit() {
    this.generate();
  }

  async generate() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.loadingState.emit(true);

    try {
      const response = await this.aiService.getLessonSummary(
        this.lessonTitle,
        this.lessonSubject,
        this.lessonId
      );

      if (response?.type === 'lesson_summary') {
        this.summary.set(response as LessonSummary);
      } else {
        this.errorMessage.set(response?.message || 'Nenhum resultado encontrado.');
      }
    } catch (e) {
      console.error('Research failed', e);
      this.errorMessage.set('Falha na conexão com o serviço de pesquisa.');
    } finally {
      this.isLoading.set(false);
      this.loadingState.emit(false);
    }
  }

  async regenerate() {
    // Limpar cache para forçar re-geração
    const cacheKey = this.lessonId
      ? `vestbot_lesson_summary_v1_${this.lessonId}`
      : `vestbot_lesson_summary_v1_${btoa(this.lessonTitle)}`;
    localStorage.removeItem(cacheKey);
    this.summary.set(null);
    await this.generate();
  }
}
