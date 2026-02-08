import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
        schedule: Array<{
            id: string;
            day: string;
            subject: string;
            topic: string;
            duration: string;
        }>;
    };
}

/**
 * Service to manage user data persistence with backend API
 */
@Injectable({
    providedIn: 'root'
})
export class UserDataService {
    private readonly API_BASE = 'http://localhost:3001/api';
    private readonly SAVE_DEBOUNCE_MS = 1000; // Wait 1 second before saving

    // Loading state
    isLoading = signal(false);
    lastSaved = signal<Date | null>(null);

    // User data cache
    private userData = signal<UserData | null>(null);
    private saveTimeout: any = null;

    /**
     * Load user data from backend
     */
    async loadUserData(): Promise<UserData> {
        this.isLoading.set(true);

        try {
            const response = await fetch(`${this.API_BASE}/user-data`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.userData.set(data);

            console.log('✅ User data loaded from backend');
            return data;
        } catch (error) {
            console.error('❌ Error loading user data:', error);

            // Return default data on error
            const defaultData: UserData = {
                version: '1.0.0',
                lastUpdated: new Date().toISOString(),
                user: {
                    stats: {
                        questionsAnswered: 0,
                        correctAnswers: 0,
                        currentStreak: 0,
                        xp: 0,
                        level: 1,
                        essaysWritten: 0
                    },
                    questionHistory: [],
                    schedule: []
                }
            };

            this.userData.set(defaultData);
            return defaultData;
        } finally {
            this.isLoading.set(false);
        }
    }

    /**
     * Save user data to backend (debounced)
     */
    saveUserData(data: UserData): void {
        // Clear existing timeout
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        // Update cache immediately
        this.userData.set(data);

        // Debounce save to backend
        this.saveTimeout = setTimeout(() => {
            this.saveUserDataImmediate(data);
        }, this.SAVE_DEBOUNCE_MS);
    }

    /**
     * Save user data immediately (no debounce)
     */
    async saveUserDataImmediate(data: UserData): Promise<void> {
        try {
            const response = await fetch(`${this.API_BASE}/user-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            this.lastSaved.set(new Date(result.lastUpdated));

            console.log('💾 User data saved to backend');
        } catch (error) {
            console.error('❌ Error saving user data:', error);
            // Still keep the data in memory even if save fails
        }
    }

    /**
     * Get current user data from cache
     */
    getUserData(): UserData | null {
        return this.userData();
    }

    /**
     * Download backup of user data
     */
    async downloadBackup(): Promise<void> {
        try {
            const response = await fetch(`${this.API_BASE}/user-data/backup`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vestbot-backup-${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            console.log('📦 Backup downloaded');
        } catch (error) {
            console.error('❌ Error downloading backup:', error);
            throw error;
        }
    }

    /**
     * Check if backend is available
     */
    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${this.API_BASE}/health`);
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Migrate data from localStorage to backend
     */
    async migrateFromLocalStorage(): Promise<void> {
        try {
            // Check if there's data in localStorage
            const statsData = localStorage.getItem('vestbot_stats');
            const historyData = localStorage.getItem('vestbot_question_history');
            const scheduleData = localStorage.getItem('vestbot_schedule');

            if (!statsData && !historyData && !scheduleData) {
                console.log('ℹ️ No localStorage data to migrate');
                return;
            }

            // Load current backend data
            const userData = await this.loadUserData();

            // Migrate stats
            if (statsData) {
                try {
                    const stats = JSON.parse(statsData);
                    userData.user.stats = stats;
                    console.log('📋 Migrated stats from localStorage');
                } catch (e) {
                    console.error('Error parsing stats from localStorage:', e);
                }
            }

            // Migrate question history
            if (historyData) {
                try {
                    const history = JSON.parse(historyData);
                    userData.user.questionHistory = history;
                    console.log('📋 Migrated question history from localStorage');
                } catch (e) {
                    console.error('Error parsing history from localStorage:', e);
                }
            }

            // Migrate schedule
            if (scheduleData) {
                try {
                    const schedule = JSON.parse(scheduleData);
                    userData.user.schedule = schedule;
                    console.log('📋 Migrated schedule from localStorage');
                } catch (e) {
                    console.error('Error parsing schedule from localStorage:', e);
                }
            }

            // Save migrated data
            await this.saveUserDataImmediate(userData);

            console.log('✅ Migration from localStorage completed');
        } catch (error) {
            console.error('❌ Error migrating from localStorage:', error);
        }
    }
}
