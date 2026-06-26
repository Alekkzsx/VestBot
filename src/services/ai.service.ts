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
    private apiUrl = '/api/ai';
    private ytUrl = '/api/yt';

    isLoading = signal(false);
    lastSync = signal<number | null>(null);

    private readonly CACHE_KEY = 'vestbot_exam_calendar_cache';
    private readonly CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours in ms
    private pendingRequest: Promise<ExamDate[]> | null = null;

    private cacheKey(prefix: string, parts: Array<string | undefined | null>): string {
        const raw = parts.filter(Boolean).join('|');
        return `${prefix}_${btoa(encodeURIComponent(raw)).replace(/[=+/]/g, '')}`;
    }

    /**
     * Fetches the official exam calendar from the IA with 12h caching
     */
    async getExamCalendar(forceRefresh: boolean = false): Promise<ExamDate[]> {
        // 1. Check Cache (skip if forceRefresh is true)
        if (!forceRefresh) {
            const cached = localStorage.getItem(this.CACHE_KEY);
            if (cached) {
                try {
                    const { data, timestamp } = JSON.parse(cached);
                    const age = Date.now() - timestamp;

                    if (age < this.CACHE_TTL) {
                        console.log('🤖 AI Calendar: Using 12h cache');
                        this.lastSync.set(timestamp);
                        return data;
                    }
                } catch (e) {
                    localStorage.removeItem(this.CACHE_KEY);
                }
            }
        }

        // 2. Deduplicate concurrent requests
        if (this.pendingRequest) {
            return this.pendingRequest;
        }

        // 3. Fetch from AI if no cache or expired
        this.isLoading.set(true);
        this.pendingRequest = firstValueFrom(
            this.http.get<ExamDate[]>(
                forceRefresh
                    ? `${this.apiUrl}/exam-calendar?refresh=1`
                    : `${this.apiUrl}/exam-calendar`
            )
        ).then(data => {
            const now = Date.now();
            localStorage.setItem(this.CACHE_KEY, JSON.stringify({ data, timestamp: now }));
            this.lastSync.set(now);
            return data;
        }).catch(error => {
            console.error('Failed to sync with AI:', error);
            throw error;
        }).finally(() => {
            this.isLoading.set(false);
            this.pendingRequest = null;
        });

        return this.pendingRequest;
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
     * Searches for educational videos using AI (with cache)
     */
    async searchEducationalVideos(query: string, subject?: string): Promise<any[]> {
        const CACHE_KEY = this.cacheKey('vestbot_yt_search_v2', [query, subject || '']);
        const cached = localStorage.getItem(CACHE_KEY);

        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log('🤖 AI YT: Using cached search results');
                    return parsed;
                }
            } catch {
                localStorage.removeItem(CACHE_KEY);
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
     * Dedicated endpoint for programmatic YT Search (fallback)
     */
    async getVideosInfo(ids: string[]): Promise<any[]> {
        if (!ids.length) return [];
        try {
            const videos = await firstValueFrom(
                this.http.post<any[]>(`${this.ytUrl}/get-videos-info`, { ids })
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
                this.http.post<any[]>(`${this.ytUrl}/fallback-search`, { query })
            );
            return videos;
        } catch (error) {
            console.error('Direct YT search failed:', error);
            return [];
        }
    }
}
