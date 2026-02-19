import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIService } from '../../../services/ai.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in-up">
       @if (exercises().length > 0 && !quizFinished()) {
          <!-- Question Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-tighter">Questão {{ currentQuestionIndex() + 1 }} de 5</span>
                <span class="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-tighter">{{ exerciseSource() }}</span>
              </div>
              <h2 class="text-3xl font-black text-white">Prática Ativa</h2>
            </div>

            <div class="flex items-center gap-2">
              @for (dot of [0,1,2,3,4]; track $index) {
                <div class="w-10 h-1.5 rounded-full transition-all duration-500" 
                     [class.bg-blue-500]="currentQuestionIndex() === $index" 
                     [class.bg-blue-500/40]="$index < currentQuestionIndex()"
                     [class.bg-white/5]="$index > currentQuestionIndex()"></div>
              }
            </div>
          </div>

          <!-- Question Card -->
          <div class="bg-[#020617]/50 border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
             <div class="relative z-10">
               <p class="text-xl md:text-2xl text-slate-200 leading-relaxed font-medium mb-12">{{ exercises()[currentQuestionIndex()]?.question }}</p>

               <div class="grid grid-cols-1 gap-4">
                 @for (opt of exercises()[currentQuestionIndex()]?.options; track $index) {
                   <button (click)="submitAnswer($index)" 
                           [disabled]="answered()"
                           class="group flex items-center gap-6 p-6 rounded-2xl border transition-all text-left"
                           [class.bg-blue-500/10]="selectedOption() === $index && !answered()"
                           [class.border-blue-500/30]="selectedOption() === $index && !answered()"
                           [class.bg-emerald-500/10]="answered() && $index === exercises()[currentQuestionIndex()]?.correct"
                           [class.border-emerald-500/30]="answered() && $index === exercises()[currentQuestionIndex()]?.correct"
                           [class.bg-red-500/10]="answered() && selectedOption() === $index && $index !== exercises()[currentQuestionIndex()]?.correct"
                           [class.border-red-500/30]="answered() && selectedOption() === $index && $index !== exercises()[currentQuestionIndex()]?.correct"
                           [class.border-white/5]="selectedOption() !== $index && (!answered() || $index !== exercises()[currentQuestionIndex()]?.correct)"
                           [class.hover:border-white/20]="!answered()">
                      
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all shadow-lg"
                           [class.bg-blue-500]="selectedOption() === $index && !answered()"
                           [class.bg-emerald-500]="answered() && $index === exercises()[currentQuestionIndex()]?.correct"
                           [class.bg-red-500]="answered() && selectedOption() === $index && $index !== exercises()[currentQuestionIndex()]?.correct"
                           [class.bg-white/10]="selectedOption() !== $index && (!answered() || $index !== exercises()[currentQuestionIndex()]?.correct)">
                        {{ ['A','B','C','D','E'][$index] }}
                      </div>

                      <span class="text-slate-300 font-medium">{{ opt }}</span>

                      @if (answered() && $index === exercises()[currentQuestionIndex()]?.correct) {
                         <i class="fas fa-check-circle text-emerald-500 ml-auto animate-bounce-subtle"></i>
                      }
                   </button>
                 }
               </div>

               @if (answered()) {
                  <div class="mt-12 p-8 rounded-3xl bg-white/5 border border-white/5 animate-fade-in">
                    <h4 class="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">Explicação do Especialista</h4>
                    <p class="text-slate-400 leading-relaxed italic">"{{ exercises()[currentQuestionIndex()]?.explanation }}"</p>
                    
                    <button (click)="next()" 
                            class="mt-8 w-full py-5 rounded-2xl bg-white text-[#020617] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95">
                      {{ currentQuestionIndex() === 4 ? 'Finalizar Prática' : 'Próxima Questão' }}
                    </button>
                  </div>
               }
             </div>
          </div>
       } @else if (quizFinished()) {
          <!-- Quiz Results / Celebration -->
          <div class="bg-white/5 rounded-[3rem] p-24 text-center border border-white/5 animate-scale-in">
             <div class="w-24 h-24 rounded-[2.5rem] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-10 text-emerald-400 text-4xl shadow-[0_0_50px_rgba(16,185,129,0.2)]">
               <i class="fas fa-award"></i>
             </div>
             <h3 class="text-white font-black text-4xl mb-4">Missão Cumprida!</h3>
             <p class="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">Você concluiu os exercícios de fixação. Seu conhecimento foi consolidado com sucesso!</p>
             
             <div class="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
                <button (click)="reset()" class="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all">Refazer Teste</button>
                <button (click)="onFinish.emit()" class="px-10 py-5 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20">Continuar Jornada</button>
             </div>
          </div>
       }
    </div>
  `
})
export class QuizComponent implements OnInit {
  @Input({ required: true }) lessonTitle!: string;
  @Output() onFinish = new EventEmitter<void>();
  @Output() loadingState = new EventEmitter<boolean>();

  exercises = signal<any[]>([]);
  exerciseSource = signal('');
  isLoading = signal(false);
  currentQuestionIndex = signal(0);
  selectedOption = signal<number | null>(null);
  answered = signal(false);
  quizFinished = signal(false);

  constructor(private aiService: AIService) { }

  ngOnInit() {
    this.generate();
  }

  async generate() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.loadingState.emit(true);
    this.quizFinished.set(false);
    this.currentQuestionIndex.set(0);

    try {
      const resp = await this.aiService.getWebExercises(this.lessonTitle);
      if (resp && resp.type === 'exercises') {
        this.exercises.set(resp.results);
        this.exerciseSource.set(resp.source);
      } else {
        alert('Não foi possível carregar exercícios.');
      }
    } catch (e) {
      console.error('Quiz loading failed', e);
      alert('Falha na conexão ao carregar exercícios.');
    } finally {
      this.isLoading.set(false);
      this.loadingState.emit(false);
    }
  }

  submitAnswer(index: number) {
    if (this.answered()) return;
    this.selectedOption.set(index);
    this.answered.set(true);
  }

  next() {
    if (this.currentQuestionIndex() < 4) {
      this.currentQuestionIndex.update(i => i + 1);
      this.answered.set(false);
      this.selectedOption.set(null);
    } else {
      this.quizFinished.set(true);
    }
  }

  reset() {
    this.currentQuestionIndex.set(0);
    this.answered.set(false);
    this.selectedOption.set(null);
    this.quizFinished.set(false);
    this.generate(); // Re-fetch on reset
  }

  clear() {
    this.exercises.set([]);
  }
}
