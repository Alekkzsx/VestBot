import { Injectable, signal } from '@angular/core';
import { Subject, debounceTime, switchMap, catchError, of } from 'rxjs';
import type { UserAchievement, UserChallenge, ActivitySession } from '../types/gamification.types';

/**
 * Interface representing the complete user data structure
 */
export interface UserData {
    version: string;
    lastUpdated: string;
    user: {
        stats: {
            questionsAnswered: number;
            correctAnswers: number;
            currentStreak: number;
            xp: number;
            level: number;
            essaysWritten: number;
        };
        questionHistory: Array<{
            questionId: number;
            timestamp: number;
            wasCorrect: boolean;
        }>;
        interpretationHistory: Array<{
            questionId: number;
            timestamp: number;
            wasCorrect: boolean;
        }>;
        resolutionsHistory: Array<{
            questionId: number;
            timestamp: number;
            viewedAt: number;
        }>;
        schedule: Array<{
            id: string;
            day: string;
            subject: string;
            topic: string;
            duration: string;
        }>;
        gamification?: {
            achievements: UserAchievement[];
            challenges: UserChallenge[];
            completedSessions: ActivitySession[];
            consecutiveCorrect: number;
            subjectStats: Array<{
                subject: string;
                answered: number;
                correct: number;
            }>;
        };
        lessonsHistory: Array<{
            lessonId: string;
            completedAt: number;
            watchedDuration: number;
            isCompleted: boolean;
        }>;
        sessions: ActivitySession[];
        frequency: {
            studyDays: string[];
        };
    };
}

const LOCAL_STORAGE_KEY = 'vestbot_davi_offline_state';
const PENDING_SYNC_KEY = 'vestbot_davi_pending_sync';

/**
 * Service to manage user data persistence with Offline-First support and MySQL Auto-Sync
 */
@Injectable({
    providedIn: 'root'
})
export class UserDataService {
    private readonly API_BASE = '/api/user/davi';

    // Status Signals
    isLoading = signal(false);
    syncStatus = signal<'synced' | 'saving' | 'offline' | 'error'>('synced');
    isServerOnline = signal(false);
    hasPendingSync = signal(false);
    lastSaved = signal<Date | null>(null);

    // User data cache (Frontend "View" of the DB)
    private userData = signal<UserData | null>(null);

    // Debounce Subjects
    private profileUpdate$ = new Subject<any>();
    private historyUpdate$ = new Subject<any[]>();
    private interpretationUpdate$ = new Subject<any[]>();
    private resolutionsUpdate$ = new Subject<any[]>();
    private scheduleUpdate$ = new Subject<any[]>();
    private gamificationUpdate$ = new Subject<any>();
    private lessonsUpdate$ = new Subject<any[]>();
    private sessionsUpdate$ = new Subject<ActivitySession[]>();
    private frequencyUpdate$ = new Subject<any>();

    private connectivityTimer: any = null;

    constructor() {
        this.restoreFromLocalStorage();
        this.setupDebouncedSaves();
        this.startConnectivityMonitor();
    }

    /**
     * Restaura os dados salvos localmente no navegador do Davi
     */
    private restoreFromLocalStorage(): void {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                const parsed: UserData = JSON.parse(saved);
                this.userData.set(parsed);
            }
            const pending = localStorage.getItem(PENDING_SYNC_KEY);
            if (pending === 'true') {
                this.hasPendingSync.set(true);
            }
        } catch (e) {
            console.warn('Erro ao ler do localStorage:', e);
        }
    }

    /**
     * Salva o estado atual no localStorage com segurança
     */
    private persistToLocalStorage(data: UserData, markPending = true): void {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            if (markPending) {
                this.hasPendingSync.set(true);
                localStorage.setItem(PENDING_SYNC_KEY, 'true');
            }
        } catch (e) {
            console.warn('Erro ao salvar no localStorage:', e);
        }
    }

    /**
     * Inicia o monitor de conectividade para detectar quando o computador do servidor for ligado
     */
    private startConnectivityMonitor(): void {
        this.checkServerAndSync();
        // Polling a cada 12 segundos
        this.connectivityTimer = setInterval(() => {
            this.checkServerAndSync();
        }, 12000);
    }

    /**
     * Testa se o servidor está online e dispara a sincronização se houver pendências
     */
    async checkServerAndSync(): Promise<boolean> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch('/api/health', { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const wasOffline = !this.isServerOnline();
                this.isServerOnline.set(true);

                // Se o servidor acabou de ligar ou há alterações locais pendentes, dispara a sincronização!
                if (wasOffline || this.hasPendingSync()) {
                    await this.triggerAutoSync();
                } else if (this.syncStatus() === 'offline') {
                    this.syncStatus.set('synced');
                }
                return true;
            } else {
                this.isServerOnline.set(false);
                this.syncStatus.set('offline');
                return false;
            }
        } catch {
            this.isServerOnline.set(false);
            this.syncStatus.set('offline');
            return false;
        }
    }

    /**
     * Sincronização em Massa (Bundle):
     * Envia todo o progresso acumulado no navegador do Davi para o MySQL neste computador.
     */
    async triggerAutoSync(): Promise<void> {
        const currentData = this.userData();
        if (!currentData) return;

        this.syncStatus.set('saving');
        console.log('🔄 [Auto-Sync] Enviando progresso do Davi para o servidor MySQL...');

        try {
            const bundlePayload = {
                stats: currentData.user.stats,
                questionHistory: currentData.user.questionHistory,
                interpretationHistory: currentData.user.interpretationHistory,
                resolutionsHistory: currentData.user.resolutionsHistory,
                schedule: currentData.user.schedule,
                gamification: currentData.user.gamification,
                lessonsHistory: currentData.user.lessonsHistory,
                sessions: currentData.user.sessions,
                frequency: currentData.user.frequency
            };

            const response = await fetch(`${this.API_BASE}/sync-bundle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bundlePayload)
            });

            if (response.ok) {
                this.hasPendingSync.set(false);
                localStorage.removeItem(PENDING_SYNC_KEY);
                this.syncStatus.set('synced');
                this.lastSaved.set(new Date());
                console.log('✅ [Auto-Sync] Progresso do Davi gravado com sucesso no MySQL!');
            } else {
                throw new Error('Falha na resposta do servidor');
            }
        } catch (err) {
            console.warn('⚠️ [Auto-Sync] Servidor offline ou ocupado. Dados mantidos em segurança no navegador.');
            this.syncStatus.set('offline');
        }
    }

    /**
     * Set up debounced auto-saves using RxJS
     */
    private setupDebouncedSaves() {
        const createSaver = (stream: Subject<any>, endpoint: string, bodyTransform: (d: any) => any) => {
            stream.pipe(
                debounceTime(1500),
                switchMap(data => {
                    this.syncStatus.set('saving');
                    return fetch(`${this.API_BASE}/${endpoint}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bodyTransform(data))
                    }).then(res => {
                        if (!res.ok) throw new Error('Network error');
                        return res.json();
                    });
                }),
                catchError(() => {
                    this.syncStatus.set('offline');
                    return of(null);
                })
            ).subscribe(res => {
                if (res) {
                    this.syncStatus.set('synced');
                    this.lastSaved.set(new Date());
                }
            });
        };

        createSaver(this.profileUpdate$, 'profile', stats => ({ stats }));
        createSaver(this.historyUpdate$, 'history', h => h);
        createSaver(this.interpretationUpdate$, 'interpretation', h => h);
        createSaver(this.resolutionsUpdate$, 'resolutions', h => h);
        createSaver(this.scheduleUpdate$, 'schedule', s => s);
        createSaver(this.gamificationUpdate$, 'gamification', g => g);
        createSaver(this.lessonsUpdate$, 'lessons', l => l);
        createSaver(this.sessionsUpdate$, 'sessions', s => s);
        createSaver(this.frequencyUpdate$, 'frequency', f => f);
    }

    /**
     * Force immediate save of history, bypassing debounce
     */
    async forceSaveHistory(history: any[]): Promise<void> {
        this.saveUserHistory(history);
        try {
            await fetch(`${this.API_BASE}/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(history)
            });
            this.syncStatus.set('synced');
            this.lastSaved.set(new Date());
        } catch {
            this.syncStatus.set('offline');
        }
    }

    /**
     * Load full user data (MySQL first, fallback to LocalStorage/Defaults)
     */
    async loadUserData(): Promise<UserData> {
        this.isLoading.set(true);

        try {
            const response = await fetch(`${this.API_BASE}/full`);
            if (!response.ok) throw new Error('Server unreachable');

            const serverData: UserData = await response.json();
            this.isServerOnline.set(true);

            // Se o navegador tinha pendências offline locais que o servidor não tem, sincronizar!
            if (this.hasPendingSync()) {
                console.log('🔄 Sincronizando dados pendentes salvos no navegador com o servidor...');
                await this.triggerAutoSync();
            } else {
                this.userData.set(serverData);
                this.persistToLocalStorage(serverData, false);
                this.syncStatus.set('synced');
            }

            console.log('✅ Dados do usuário Davi carregados do Servidor MySQL');
            return this.userData() || serverData;
        } catch (error) {
            console.log('ℹ️ Servidor offline ou computador desligado. Usando modo Offline do navegador do Davi.');
            this.isServerOnline.set(false);
            this.syncStatus.set('offline');

            const current = this.userData();
            if (current) {
                return current;
            }

            const empty = this.createDefaultData();
            this.userData.set(empty);
            this.persistToLocalStorage(empty, false);
            return empty;
        } finally {
            this.isLoading.set(false);
        }
    }

    /**
     * Save PROFILE (Stats/XP/Level)
     */
    saveUserProfile(stats: any): void {
        this.userData.update(current => {
            const updated = current
                ? { ...current, user: { ...current.user, stats: stats.stats || stats } }
                : this.createDefaultData();
            this.persistToLocalStorage(updated, true);
            return updated;
        });
        this.profileUpdate$.next(stats);
    }

    /**
     * Save HISTORY
     */
    saveUserHistory(history: any[]): void {
        this.userData.update(current => {
            const updated = current
                ? { ...current, user: { ...current.user, questionHistory: history } }
                : this.createDefaultData();
            this.persistToLocalStorage(updated, true);
            return updated;
        });
        this.historyUpdate$.next(history);
    }

    /**
     * Save SCHEDULE
     */
    saveUserSchedule(schedule: any[]): void {
        this.userData.update(current => {
            const updated = current
                ? { ...current, user: { ...current.user, schedule: schedule } }
                : this.createDefaultData();
            this.persistToLocalStorage(updated, true);
            return updated;
        });
        this.scheduleUpdate$.next(schedule);
    }

    /**
     * Save Interpretation HISTORY
     */
    saveUserInterpretationHistory(history: any[]): void {
        this.userData.update(current => {
            const updated = current
                ? { ...current, user: { ...current.user, interpretationHistory: history } }
                : this.createDefaultData();
            this.persistToLocalStorage(updated, true);
            return updated;
        });
        this.interpretationUpdate$.next(history);
    }

    /**
     * Save Resolutions HISTORY
     */
    saveUserResolutionsHistory(history: any[]): void {
        this.userData.update(current => {
            const updated = current
                ? { ...current, user: { ...current.user, resolutionsHistory: history } }
                : this.createDefaultData();
            this.persistToLocalStorage(updated, true);
            return updated;
        });
        this.resolutionsUpdate$.next(history);
    }

    /**
     * Save GAMIFICATION data
     */
    saveGamificationData(gamification: any): void {
        this.userData.update(current => {
            const updated = current
                ? { ...current, user: { ...current.user, gamification } }
                : this.createDefaultData();
            this.persistToLocalStorage(updated, true);
            return updated;
        });
        this.gamificationUpdate$.next(gamification);
    }

    /**
     * Save Lessons HISTORY
     */
    saveUserLessonsHistory(history: any[]): void {
        this.userData.update(current => {
            const updated = current
                ? { ...current, user: { ...current.user, lessonsHistory: history } }
                : this.createDefaultData();
            this.persistToLocalStorage(updated, true);
            return updated;
        });
        this.lessonsUpdate$.next(history);
    }

    /**
     * Save Activity SESSIONS
     */
    saveUserSessions(sessions: ActivitySession[]): void {
        this.userData.update(current => {
            const updated = current
                ? { ...current, user: { ...current.user, sessions } }
                : this.createDefaultData();
            this.persistToLocalStorage(updated, true);
            return updated;
        });
        this.sessionsUpdate$.next(sessions);
    }

    /**
     * Save FREQUENCY (Streak days)
     */
    saveUserFrequency(frequency: { studyDays: string[] }): void {
        this.userData.update(current => {
            const updated = current
                ? { ...current, user: { ...current.user, frequency } }
                : this.createDefaultData();
            this.persistToLocalStorage(updated, true);
            return updated;
        });
        this.frequencyUpdate$.next(frequency);
    }

    getUserData(): UserData | null {
        return this.userData();
    }

    private createDefaultData(): UserData {
        return {
            version: '4.0.0',
            lastUpdated: new Date().toISOString(),
            user: {
                stats: { questionsAnswered: 0, correctAnswers: 0, currentStreak: 0, xp: 0, level: 1, essaysWritten: 0 },
                questionHistory: [],
                interpretationHistory: [],
                resolutionsHistory: [],
                schedule: [],
                gamification: {
                    achievements: [],
                    challenges: [],
                    completedSessions: [],
                    consecutiveCorrect: 0,
                    subjectStats: [],
                },
                lessonsHistory: [],
                sessions: [],
                frequency: { studyDays: [] }
            }
        };
    }
}
