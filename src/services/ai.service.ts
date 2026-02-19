import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ExamDate {
    name: string;
    date: string;
    modality: string;
}

@Injectable({
    providedIn: 'root'
})
export class AIService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3001/api/ai';

    isLoading = signal(false);
    lastSync = signal<Date | null>(null);

    private readonly CACHE_KEY = 'vestbot_exam_calendar_cache';
    private readonly CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours in ms

    /**
     * Fetches the official exam calendar from the IA with 12h caching
     */
    async getExamCalendar(): Promise<ExamDate[]> {
        // 1. Check Cache
        const cached = localStorage.getItem(this.CACHE_KEY);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                const age = Date.now() - timestamp;

                if (age < this.CACHE_TTL) {
                    console.log('🤖 AI Calendar: Using 12h cache');
                    this.lastSync.set(new Date(timestamp));
                    return data;
                }
            } catch (e) {
                localStorage.removeItem(this.CACHE_KEY);
            }
        }

        // 2. Fetch from AI if no cache or expired
        this.isLoading.set(true);
        try {
            const data = await firstValueFrom(
                this.http.get<ExamDate[]>(`${this.apiUrl}/exam-calendar`)
            );

            const now = Date.now();
            localStorage.setItem(this.CACHE_KEY, JSON.stringify({
                data,
                timestamp: now
            }));

            this.lastSync.set(new Date(now));
            return data;
        } catch (error) {
            console.error('Failed to sync with AI:', error);
            throw error;
        } finally {
            this.isLoading.set(false);
        }
    }

    /**
     * Fetches a definition for a specific word and context
     */
    async defineWord(word: string, context?: string): Promise<{ word: string, definition: string }> {
        try {
            let url = `${this.apiUrl}/dictionary?word=${encodeURIComponent(word)}`;
            if (context) url += `&context=${encodeURIComponent(context)}`;

            const data = await firstValueFrom(
                this.http.get<{ word: string, definition: string }>(url)
            );
            return data;
        } catch (error) {
            console.error('Failed to fetch definition:', error);
            return { word, definition: 'Não foi possível encontrar o significado.' };
        }
    }

    /**
     * Gets AI recommended lessons based on performance stats (with permanent cache)
     */
    async getRecommendedLessons(stats: any, lessons: any[]): Promise<string[]> {
        const CACHE_KEY = 'vestbot_ai_recommendations';
        const cached = localStorage.getItem(CACHE_KEY);

        const statsHash = btoa(JSON.stringify({ accuracy: stats.accuracy, correctAnswers: stats.correctAnswers }));
        if (cached) {
            const { hash, recommendations } = JSON.parse(cached);
            if (hash === statsHash) {
                console.log('🤖 AI Lessons: Using cached recommendations');
                return recommendations;
            }
        }

        try {
            const prompt = `
        Com base nestas estatísticas do aluno (Acurácia: ${stats.accuracy}%, Matérias com erro: ${JSON.stringify(stats.weakSubjects)}), 
        recomende até 2 IDs das seguintes aulas que ele DEVE assistir primeiro:
        ${JSON.stringify(lessons.map(l => ({ id: l.id, title: l.title, subject: l.subject })))}
        
        Retorne APENAS um JSON array com os IDs: ["id1", "id2"]
      `;

            const aiResponse = await this.callGeminiRaw(prompt);
            const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
            const recommendations = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);

            localStorage.setItem(CACHE_KEY, JSON.stringify({ hash: statsHash, recommendations }));
            return recommendations;
        } catch (e) {
            return [];
        }
    }

    /**
     * Searches for educational videos using AI (with cache)
     */
    async searchEducationalVideos(query: string, subject?: string): Promise<any[]> {
        const CACHE_KEY = `vestbot_yt_search_${query}_${subject || ''}`;
        const cached = localStorage.getItem(CACHE_KEY);

        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.length > 0) {
                console.log('🤖 AI YT: Using cached search results');
                return parsed;
            }
        }

        try {
            const videos = await firstValueFrom(
                this.http.post<any[]>(`${this.apiUrl}/search-videos`, { query, subject })
            );

            localStorage.setItem(CACHE_KEY, JSON.stringify(videos));
            return videos;
        } catch (error) {
            console.error('Failed to search videos:', error);
            return [];
        }
    }

    /**
     * Generates a web-based summary or fetches search results (Persistent Cache)
     */
    async getWebSummary(query: string, subject?: string, lessonId?: string): Promise<any> {
        // We use lessonId if available for more specific caching
        const cacheKey = lessonId ? `vestbot_summary_v2_${lessonId}` : `vestbot_summary_v2_${query}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            console.log('🤖 AI Summary: Using persistent cache for', lessonId || query);
            return JSON.parse(cached);
        }

        try {
            const response = await firstValueFrom(
                this.http.post<any>(`${this.apiUrl}/search-web-summary`, { query, subject })
            );

            localStorage.setItem(cacheKey, JSON.stringify(response));
            return response;
        } catch (error) {
            console.error('Failed to get web summary:', error);
            return { type: 'error', result: 'Não foi possível buscar resultados web.' };
        }
    }

    /**
     * Generates a full structured lesson summary using web scraping + Gemini synthesis
     */
    async getLessonSummary(lessonTitle: string, subject?: string, lessonId?: string): Promise<any> {
        const cacheKey = lessonId
            ? `vestbot_lesson_summary_v1_${lessonId}`
            : `vestbot_lesson_summary_v1_${btoa(lessonTitle)}`;

        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            console.log('📚 Lesson Summary: Using cached summary for', lessonTitle);
            return JSON.parse(cached);
        }

        try {
            const response = await firstValueFrom(
                this.http.post<any>(`${this.apiUrl}/lesson-summary`, { lessonTitle, subject })
            );

            if (response?.type === 'lesson_summary') {
                localStorage.setItem(cacheKey, JSON.stringify(response));
            }

            return response;
        } catch (error) {
            console.error('Failed to get lesson summary:', error);
            return { type: 'error', message: 'Não foi possível gerar o resumo.' };
        }
    }

    /**
     * Scrapes educational exercises from the web
     */
    async getWebExercises(query: string): Promise<any> {
        const cacheKey = `vestbot_exercises_v1_${query}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) return JSON.parse(cached);

        try {
            const response = await firstValueFrom(
                this.http.post<any>(`${this.apiUrl}/scrape-exercises`, { query })
            );

            localStorage.setItem(cacheKey, JSON.stringify(response));
            return response;
        } catch (error) {
            console.error('Failed to get exercises:', error);
            return { type: 'error', result: 'Não foi possível buscar exercícios.' };
        }
    }

    /**
     * Dedicated endpoint for programmatic YT Search (fallback)
     */
    async getVideosInfo(ids: string[]): Promise<any[]> {
        if (!ids.length) return [];
        try {
            const videos = await firstValueFrom(
                this.http.post<any[]>(`${this.apiUrl.replace('/ai', '/yt')}/get-videos-info`, { ids })
            );
            return videos;
        } catch (error) {
            console.error('Failed to get video info:', error);
            return [];
        }
    }

    /**
     * Dedicated endpoint for programmatic YT Search (fallback)
     */
    async searchYoutubeDirect(query: string): Promise<any[]> {
        try {
            const videos = await firstValueFrom(
                this.http.post<any[]>(`${this.apiUrl.replace('/ai', '/yt')}/fallback-search`, { query })
            );
            return videos;
        } catch (error) {
            console.error('Direct YT search failed:', error);
            return [];
        }
    }

    private async callGeminiRaw(prompt: string): Promise<string> {
        const url = `${this.apiUrl}/generic-call`;
        const response = await firstValueFrom(
            this.http.post<{ result: string }>(url, { prompt })
        );
        return response.result;
    }
}
