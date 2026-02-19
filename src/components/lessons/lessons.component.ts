import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../services/ai.service';
import { AnalyticsService } from '../../services/analytics.service';
import { UserDataService } from '../../services/user-data.service';
import { LessonPlayerComponent } from './lesson-player.component';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  subject: string;
  thumbnail: string;
  isLocked: boolean;
}

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, FormsModule, LessonPlayerComponent],
  template: `
    <div class="animate-fade-in font-sans pb-10">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 class="text-3xl font-bold text-slate-900 mb-1">Videoaulas</h2>
          <p class="text-slate-500 text-sm">Aprenda a teoria com os melhores especialistas.</p>
        </div>

        <div class="relative max-w-md w-full flex gap-2">
          <div class="relative flex-1">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
              placeholder="O que você quer aprender hoje?"
              class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
            >
            @if (isSearching()) {
              <div class="absolute right-4 top-1/2 -translate-y-1/2">
                <i class="fas fa-circle-notch animate-spin text-slate-400"></i>
              </div>
            }
          </div>
          <button 
            (click)="onSearch()"
            class="bg-black text-white px-6 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center">
            Buscar
          </button>
        </div>
      </header>

      <!-- AI Recommendations -->
      @if (recommendedLessons().length > 0 && !searchQuery()) {
        <div class="mb-10 animate-fade-in">
          <div class="flex items-center gap-2 mb-4">
            <span class="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm flex items-center gap-1.2">
              <i class="fas fa-sparkles text-[8px]"></i> Sugestão IA
            </span>
            <span class="text-xs font-bold text-slate-500">Aulas ideais para reforçar seus pontos fracos</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (lesson of recommendedLessons(); track lesson.id) {
              <div 
                (click)="selectedLesson.set(lesson)"
                class="bg-white border border-slate-200 rounded-3xl p-4 flex items-center gap-4 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer transition-all group overflow-hidden relative">
                
                <div class="w-24 aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs overflow-hidden relative shrink-0 shadow-sm">
                   @if (lesson.thumbnail) {
                       <img [src]="lesson.thumbnail" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                   } @else {
                       <i class="fas fa-play text-slate-500"></i>
                   }
                   <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                   <div [style.width.%]="getLessonProgress(lesson.id)" class="absolute bottom-0 left-0 h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <span class="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1 block">{{ lesson.subject }}</span>
                  <h4 class="font-bold text-sm text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate">{{ lesson.title }}</h4>
                  <p class="text-[10px] text-slate-400 mt-1 font-medium">{{ lesson.duration }} • Assistir agora</p>
                </div>
                
                <div class="p-2 mr-1 rounded-full bg-slate-50 text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all flex items-center justify-center">
                  <i class="fas fa-chevron-right text-[10px]"></i>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- My Discoveries (Saved Searches) -->
      @if (discoveredLessons().length > 0 && !searchQuery()) {
        <div class="mb-10 animate-fade-in">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm flex items-center gap-1.2">
                <i class="fas fa-compass text-[8px]"></i> Minhas Descobertas
              </span>
              <span class="text-xs font-bold text-slate-500">Aulas encontradas por você</span>
            </div>
            <button (click)="clearDiscoveries()" class="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors">
              <i class="fas fa-trash-alt mr-1"></i> LIMPAR TUDO
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (lesson of discoveredLessons(); track lesson.id) {
               <div 
                (click)="selectedLesson.set(lesson)"
                class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-black transition-all group cursor-pointer relative">
                
                @if (isLessonCompleted(lesson.id)) {
                  <div class="absolute top-2 left-2 z-20 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-md animate-fade-in">
                    <i class="fas fa-check mr-1"></i> CONCLUÍDA
                  </div>
                }

                <div class="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                    @if (lesson.thumbnail) {
                        <img [src]="lesson.thumbnail" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    } @else {
                        <i class="fas fa-video text-slate-300 text-3xl"></i>
                    }
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black">
                            <i class="fas fa-play ml-1"></i>
                        </div>
                    </div>
                </div>
                <div class="p-4">
                  <span class="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-1">{{ lesson.subject }}</span>
                  <h4 class="font-bold text-sm text-slate-900 group-hover:text-black transition-colors truncate">{{ lesson.title }}</h4>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Featured Lesson (Keep only if no search) -->
      @if (!searchQuery()) {
        <div class="bg-black rounded-3xl p-8 mb-10 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-1/2 h-full bg-slate-800 opacity-20 blur-3xl rounded-full translate-x-1/2"></div>
          
          <div class="relative z-10 max-w-2xl">
            <span class="bg-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Destaque do Dia</span>
            <h3 class="text-4xl font-bold text-white mb-4 leading-tight">Matemática: Geometria Espacial para ETEC</h3>
            <p class="text-slate-400 mb-8 text-lg leading-relaxed">
              Aprenda a calcular volumes e áreas de prismas e pirâmides, um dos temas mais recorrentes no vestibulinho.
            </p>
          
          <div class="flex items-center gap-6 mb-8">
            <div class="flex items-center text-slate-300">
              <i class="far fa-clock mr-2 text-white"></i>
              <span class="text-sm font-medium">45 minutos</span>
            </div>
            <div class="flex items-center text-slate-300">
              <i class="far fa-play-circle mr-2 text-white"></i>
              <span class="text-sm font-medium">Videoaula + Material</span>
            </div>
          </div>

          <button 
            (click)="selectedLesson.set(filteredLessons()[0] ?? lessons()[0])"
            class="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center group/btn shadow-lg">
            Assistir Agora <i class="fas fa-play ml-3 text-xs group-hover/btn:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
      }

      <!-- Categories -->
      <div class="flex items-center gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
        @for (cat of categories(); track cat) {
          <button 
            (click)="selectedCategory.set(cat)"
            [class]="'px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ' + 
                     (selectedCategory() === cat ? 'bg-black text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-black')">
            {{ cat }}
          </button>
        }
      </div>

      <!-- Lesson Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (lesson of filteredLessons(); track lesson.id) {
          <div 
            (click)="selectedLesson.set(lesson)"
            class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-black transition-all group cursor-pointer relative">
            
            @if (isLessonCompleted(lesson.id)) {
              <div class="absolute top-2 left-2 z-20 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-md animate-fade-in">
                <i class="fas fa-check mr-1"></i> CONCLUÍDA
              </div>
            }

            <div class="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                @if (lesson.thumbnail) {
                    <img [src]="lesson.thumbnail" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                } @else {
                    <i class="fas fa-video text-slate-300 text-3xl"></i>
                }
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black">
                        <i class="fas fa-play ml-1"></i>
                    </div>
                </div>
                <div class="absolute bottom-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">
                    {{ lesson.duration }}
                </div>
                
                <!-- Progress Bar -->
                <div class="absolute bottom-0 left-0 h-1 bg-black/10 w-full z-10">
                   <div [style.width.%]="getLessonProgress(lesson.id)" class="h-full bg-black transition-all duration-1000"></div>
                </div>
            </div>
            <div class="p-5">
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-black text-black uppercase tracking-widest">{{ lesson.subject }}</span>
                @if (lesson.isLocked) {
                    <i class="fas fa-lock text-slate-300 text-xs"></i>
                }
              </div>
              <h4 class="font-bold text-slate-900 group-hover:text-black transition-colors">{{ lesson.title }}</h4>
            </div>
          </div>
        }
      </div>

      <!-- Video Player Modal -->
      @if (selectedLesson()) {
        <app-lesson-player 
          [lesson]="selectedLesson()!" 
          (close)="selectedLesson.set(null)"
          (completed)="onLessonCompleted($event)"
        />
      }
    </div>
    `,
  styles: [`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonsComponent implements OnInit {
  private aiService = inject(AIService);
  private analyticsService = inject(AnalyticsService);
  private userDataService = inject(UserDataService);

  categories = signal(['Todos', 'Matemática', 'Português', 'Humanas', 'Ciências']);
  selectedCategory = signal('Todos');
  searchQuery = signal('');
  isSearching = signal(false);
  recommendedLessonIds = signal<string[]>([]);
  searchResults = signal<Lesson[]>([]);
  discoveredLessons = signal<Lesson[]>([]);
  selectedLesson = signal<Lesson | null>(null);

  private readonly DISCOVERED_KEY = 'vestbot_discovered_lessons';

  lessons = signal<Lesson[]>([
    { id: '1Tf-K4jGv-M', title: 'Regra de Três Composta', duration: '22:15', subject: 'Matemática', thumbnail: 'https://i.ytimg.com/vi/1Tf-K4jGv-M/mqdefault.jpg', isLocked: false },
    { id: 'WpY5Y_WkI4A', title: 'Figuras de Linguagem: Metáfora e Ironia', duration: '15:40', subject: 'Português', thumbnail: 'https://i.ytimg.com/vi/WpY5Y_WkI4A/mqdefault.jpg', isLocked: false },
    { id: 'm6_KIsW8P3g', title: 'Era Vargas e o Estado Novo', duration: '30:00', subject: 'Humanas', thumbnail: 'https://i.ytimg.com/vi/m6_KIsW8P3g/mqdefault.jpg', isLocked: false },
    { id: 'D5V46_A9c0k', title: 'Ecossistemas e Cadeia Alimentar', duration: '18:20', subject: 'Ciências', thumbnail: 'https://i.ytimg.com/vi/D5V46_A9c0k/mqdefault.jpg', isLocked: false },
    { id: 'v_K7l7Y_C9s', title: 'Química: Tabela Periódica Simplificada', duration: '25:10', subject: 'Ciências', thumbnail: 'https://i.ytimg.com/vi/v_K7l7Y_C9s/mqdefault.jpg', isLocked: false },
    { id: 'fS9eW6h9T8A', title: 'Interpretação de Gráficos e Tabelas', duration: '12:45', subject: 'Matemática', thumbnail: 'https://i.ytimg.com/vi/fS9eW6h9T8A/mqdefault.jpg', isLocked: false },
  ]);

  filteredLessons = computed(() => {
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase();
    const searchRes = this.searchResults();
    const discovered = this.discoveredLessons();
    const base = this.lessons();

    // Prioridade: Busca Real > Descobertas + Base
    let source = query.length >= 3 ? searchRes : [...base, ...discovered];

    // Remover duplicatas
    source = Array.from(new Map(source.map(item => [item['id'], item])).values());

    return source.filter(l => {
      const matchesCategory = cat === 'Todos' || l.subject === cat;
      const matchesQuery = !query || l.title.toLowerCase().includes(query) || l.subject.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  });

  recommendedLessons = computed(() => {
    const ids = this.recommendedLessonIds();
    const all = [...this.lessons(), ...this.searchResults(), ...this.discoveredLessons()];
    const unique = Array.from(new Map(all.map(item => [item['id'], item])).values());
    return unique.filter(l => ids.includes(l.id));
  });

  async ngOnInit() {
    // Carregar aulas descobertas salvas
    const saved = localStorage.getItem(this.DISCOVERED_KEY);
    if (saved) {
      this.discoveredLessons.set(JSON.parse(saved));
    }

    const analytics = this.analyticsService.getAnalyticsData();
    const weakSubjects = analytics.bySubject
      .filter(s => s.accuracy < 65)
      .map(s => s.subject);

    if (weakSubjects.length > 0) {
      const stats = {
        accuracy: analytics.overview.accuracy,
        correctAnswers: analytics.overview.correctAnswers,
        weakSubjects
      };

      const recs = await this.aiService.getRecommendedLessons(stats, this.lessons());
      this.recommendedLessonIds.set(recs);

      // Otimização: Busca os metadados reais para os IDs recomendados
      const missingIds = recs.filter(id => !this.lessons().some(l => l.id === id) && !this.discoveredLessons().some(l => l.id === id));
      if (missingIds.length > 0) {
        const meta = await this.aiService.getVideosInfo(missingIds);
        this.searchResults.update(current => [...current, ...meta]);
      }
    }
  }

  async onSearch() {
    const query = this.searchQuery().trim();
    if (query.length < 3) {
      this.searchResults.set([]);
      return;
    }

    this.isSearching.set(true);
    try {
      const results = await this.aiService.searchEducationalVideos(query, this.selectedCategory() === 'Todos' ? undefined : this.selectedCategory());

      if (results.length === 0) {
        const fallbackResults = await (this.aiService as any).searchYoutubeDirect(query);
        this.processSearchResults(fallbackResults);
      } else {
        this.processSearchResults(results);
      }
    } catch (e) {
      const fallbackResults = await (this.aiService as any).searchYoutubeDirect(query);
      this.processSearchResults(fallbackResults);
    } finally {
      this.isSearching.set(false);
    }
  }

  private processSearchResults(results: Lesson[]) {
    this.searchResults.set(results);

    // Persistir novas descobertas permanentemente
    const currentDiscovered = this.discoveredLessons();
    const newDiscovered = [...currentDiscovered];

    results.forEach(res => {
      // Verifica se já não existe no catálogo base ou nas descobertas atuais
      if (!newDiscovered.some(d => d.id === res.id) && !this.lessons().some(l => l.id === res.id)) {
        newDiscovered.push(res);
      }
    });

    if (newDiscovered.length !== currentDiscovered.length) {
      this.discoveredLessons.set(newDiscovered);
      localStorage.setItem(this.DISCOVERED_KEY, JSON.stringify(newDiscovered));
    }
  }

  clearDiscoveries() {
    if (confirm('Deseja limpar seu histórico de aulas encontradas?')) {
      this.discoveredLessons.set([]);
      localStorage.removeItem(this.DISCOVERED_KEY);
    }
  }

  getLessonProgress(lessonId: string): number {
    const history = this.userDataService.getUserData()?.user.lessonsHistory || [];
    const entry = history.find(h => h.lessonId === lessonId);
    if (!entry) return 0;
    return entry.isCompleted ? 100 : entry.watchedDuration;
  }

  isLessonCompleted(lessonId: string): boolean {
    const history = this.userDataService.getUserData()?.user.lessonsHistory || [];
    return history.some(h => h.lessonId === lessonId && h.isCompleted);
  }

  onLessonCompleted(lessonId: string) {
    const history = [...(this.userDataService.getUserData()?.user.lessonsHistory || [])];
    const existing = history.find(h => h.lessonId === lessonId);

    if (existing) {
      existing.isCompleted = true;
      existing.completedAt = Date.now();
    } else {
      history.push({
        lessonId,
        completedAt: Date.now(),
        watchedDuration: 100,
        isCompleted: true
      });
    }

    this.userDataService.saveUserLessonsHistory(history);

    // Add XP
    const stats = { ...this.userDataService.getUserData()!.user.stats };
    stats.xp += 500; // XP por aula concluída
    this.userDataService.saveUserProfile(stats);
  }
}
