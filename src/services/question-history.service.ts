import { Injectable, inject } from '@angular/core';
import { UserDataService } from './user-data.service';

/**
 * Represents a single attempt at answering a question
 */
export interface QuestionAttempt {
    questionId: number;
    timestamp: number;      // Unix timestamp in milliseconds
    wasCorrect: boolean;
}

/**
 * Service to manage question history and spaced repetition logic
 * 
 * Rules:
 * - Correctly answered questions are blocked for 3 days (72 hours)
 * - Incorrectly answered questions are blocked for 8 hours
 * - Never answered questions are always available
 */
@Injectable({
    providedIn: 'root'
})
export class QuestionHistoryService {
    private readonly STORAGE_KEY = 'vestbot_question_history';
    private userDataService = inject(UserDataService);

    // Time intervals in milliseconds
    private readonly CORRECT_BLOCK_TIME = 3 * 24 * 60 * 60 * 1000;  // 3 days
    private readonly INCORRECT_BLOCK_TIME = 8 * 60 * 60 * 1000;     // 8 hours

    constructor() {
        this.cleanupOldEntries();
    }

    /**
     * Record a question attempt
     */
    recordAttempt(questionId: number, wasCorrect: boolean): void {
        const history = this.getHistory();

        const attempt: QuestionAttempt = {
            questionId,
            timestamp: Date.now(),
            wasCorrect
        };

        // Remove previous attempts for this question
        const filtered = history.filter(h => h.questionId !== questionId);

        // Add new attempt
        filtered.push(attempt);

        // Save to localStorage
        this.saveHistory(filtered);

        console.log(`📝 Recorded ${wasCorrect ? 'correct' : 'incorrect'} attempt for question ${questionId}`);
    }

    /**
     * Check if a question can be shown to the user
     */
    canShowQuestion(questionId: number): boolean {
        const history = this.getHistory();
        const lastAttempt = history.find(h => h.questionId === questionId);

        // If never attempted, always show
        if (!lastAttempt) {
            return true;
        }

        const now = Date.now();
        const timeSinceAttempt = now - lastAttempt.timestamp;

        // Check if enough time has passed based on correctness
        if (lastAttempt.wasCorrect) {
            return timeSinceAttempt >= this.CORRECT_BLOCK_TIME;
        } else {
            return timeSinceAttempt >= this.INCORRECT_BLOCK_TIME;
        }
    }

    /**
     * Get the block status for a question
     * Returns null if question is available, or remaining time in ms if blocked
     */
    getBlockedTimeRemaining(questionId: number): number | null {
        const history = this.getHistory();
        const lastAttempt = history.find(h => h.questionId === questionId);

        if (!lastAttempt) {
            return null;
        }

        const now = Date.now();
        const timeSinceAttempt = now - lastAttempt.timestamp;
        const blockTime = lastAttempt.wasCorrect ? this.CORRECT_BLOCK_TIME : this.INCORRECT_BLOCK_TIME;

        const remaining = blockTime - timeSinceAttempt;
        return remaining > 0 ? remaining : null;
    }

    /**
     * Get all attempts for a specific question
     */
    getQuestionHistory(questionId: number): QuestionAttempt | undefined {
        const history = this.getHistory();
        return history.find(h => h.questionId === questionId);
    }

    /**
     * Get statistics about the question history
     */
    getStatistics() {
        const history = this.getHistory();
        const correct = history.filter(h => h.wasCorrect).length;
        const incorrect = history.filter(h => !h.wasCorrect).length;

        return {
            totalAttempts: history.length,
            correctAnswers: correct,
            incorrectAnswers: incorrect,
            accuracy: history.length > 0 ? (correct / history.length) * 100 : 0
        };
    }

    /**
     * Clear all history (useful for testing or reset)
     */
    clearHistory(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('🗑️ Question history cleared');
    }

    /**
     * Get all history from localStorage or backend
     */
    private getHistory(): QuestionAttempt[] {
        try {
            // Try to get from backend first
            const userData = this.userDataService.getUserData();

            if (userData && userData.user.questionHistory) {
                return userData.user.questionHistory;
            }

            // Fallback to localStorage
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) {
                return [];
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading question history:', error);
            return [];
        }
    }

    /**
     * Save history to backend and localStorage
     */
    private saveHistory(history: QuestionAttempt[]): void {
        try {
            // Save to localStorage as backup
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));

            // Save to backend
            const userData = this.userDataService.getUserData();
            if (userData) {
                userData.user.questionHistory = history;
                this.userDataService.saveUserData(userData);
            }
        } catch (error) {
            console.error('Error saving question history:', error);
        }
    }

    /**
     * Clean up old entries that are past the block time
     * This prevents the localStorage from growing indefinitely
     */
    private cleanupOldEntries(): void {
        const history = this.getHistory();
        const now = Date.now();

        // Keep only entries that are still within block time
        const filtered = history.filter(h => {
            const age = now - h.timestamp;
            const blockTime = h.wasCorrect ? this.CORRECT_BLOCK_TIME : this.INCORRECT_BLOCK_TIME;
            return age < blockTime * 2; // Keep for 2x block time for historical data
        });

        if (filtered.length < history.length) {
            this.saveHistory(filtered);
            console.log(`🧹 Cleaned up ${history.length - filtered.length} old history entries`);
        }
    }

    /**
     * Get formatted time remaining for a blocked question
     */
    getFormattedBlockTime(questionId: number): string | null {
        const remaining = this.getBlockedTimeRemaining(questionId);

        if (!remaining) {
            return null;
        }

        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

        if (hours >= 24) {
            const days = Math.floor(hours / 24);
            return `${days} dia${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} hora${hours > 1 ? 's' : ''}`;
        } else {
            return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
        }
    }
}
