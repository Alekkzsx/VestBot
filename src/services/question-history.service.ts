import { Injectable, inject } from '@angular/core';
import { UserDataService } from './user-data.service';
import { ContentService } from './content.service';

/**
 * Context where the question was attempted
 */
export type QuestionContext = 'quiz' | 'interpretation' | 'resolution';

/**
 * Represents a single attempt at answering a question
 */
export interface QuestionAttempt {
    questionId: number;
    timestamp: number;      // Unix timestamp in milliseconds
    wasCorrect: boolean;
    context?: QuestionContext; // Optional for backwards compatibility
}

/**
 * Service to manage question history and spaced repetition logic
 * 
 * Regras:
 * - Se ACERTOU: a questão só volta para o jogo no dia seguinte.
 * - Se ERROU: a questão só volta após 30 minutos.
 */
@Injectable({
    providedIn: 'root'
})
export class QuestionHistoryService {
    private userDataService = inject(UserDataService);
    private contentService = inject(ContentService);

    // Tempo de bloqueio em caso de erro: exatamente 30 minutos
    private readonly INCORRECT_BLOCK_TIME = 30 * 60 * 1000; // 30 minutos

    constructor() {
        // Preserva o histórico completo para métricas de desempenho e persistência no MySQL.
    }

    /**
     * Verifica se o momento atual já é o dia seguinte (ou posterior) em relação à data da tentativa
     */
    private isNextDayOrLater(attemptTimestamp: number): boolean {
        const attemptDate = new Date(attemptTimestamp);
        const now = new Date();

        const attemptDayStart = new Date(
            attemptDate.getFullYear(),
            attemptDate.getMonth(),
            attemptDate.getDate()
        ).getTime();

        const todayStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        ).getTime();

        // Se hoje é estritamente posterior ao dia da tentativa, já é o dia seguinte!
        return todayStart > attemptDayStart;
    }

    /**
     * Record a question attempt
     * 
     * @param questionId - ID of the question
     * @param wasCorrect - Whether the answer was correct
     * @param context - Context where the question was attempted ('quiz', 'interpretation', or 'resolution')
     */
    recordAttempt(questionId: number, wasCorrect: boolean, context: QuestionContext = 'quiz'): void {
        const history = this.getHistory();

        const attempt: QuestionAttempt = {
            questionId,
            timestamp: Date.now(),
            wasCorrect,
            context
        };

        // Add new attempt maintaining complete history for analytics and sync
        history.push(attempt);

        // Save via UserDataService (saves to localStorage and syncs with MySQL)
        this.saveHistory(history);

        const contextLabel = context === 'quiz' ? 'quiz' : context === 'interpretation' ? 'interpretation' : 'resolution';
        console.log(`📝 Recorded ${wasCorrect ? 'correct' : 'incorrect'} attempt for question ${questionId} [${contextLabel}]`);
    }

    /**
     * Check if a question can be shown to the user:
     * - ACERTOU: só volta no dia seguinte!
     * - ERROU: volta após 30 minutos!
     */
    canShowQuestion(questionId: number): boolean {
        const history = this.getHistory();
        const lastAttempt = [...history].reverse().find(h => h.questionId === questionId);

        // Se nunca foi respondida, pode mostrar
        if (!lastAttempt) {
            return true;
        }

        // Se ACERTOU: só no dia seguinte aquela questão volta para o jogo!
        if (lastAttempt.wasCorrect) {
            return this.isNextDayOrLater(lastAttempt.timestamp);
        }

        // Se ERROU: só depois de 30 minutos ela volta!
        const timeSinceAttempt = Date.now() - lastAttempt.timestamp;
        return timeSinceAttempt >= this.INCORRECT_BLOCK_TIME;
    }

    /**
     * Retorna o tempo restante de bloqueio em milissegundos
     */
    getBlockedTimeRemaining(questionId: number): number | null {
        const history = this.getHistory();
        const lastAttempt = [...history].reverse().find(h => h.questionId === questionId);

        if (!lastAttempt) {
            return null;
        }

        const now = Date.now();

        if (lastAttempt.wasCorrect) {
            // Se já é o dia seguinte, não está bloqueada
            if (this.isNextDayOrLater(lastAttempt.timestamp)) {
                return null;
            }

            // Tempo restante até a meia-noite do dia seguinte
            const attemptDate = new Date(lastAttempt.timestamp);
            const nextDayMidnight = new Date(
                attemptDate.getFullYear(),
                attemptDate.getMonth(),
                attemptDate.getDate() + 1,
                0, 0, 0, 0
            ).getTime();

            const remaining = nextDayMidnight - now;
            return remaining > 0 ? remaining : null;
        } else {
            // Se errou: 30 minutos a partir da tentativa
            const remaining = this.INCORRECT_BLOCK_TIME - (now - lastAttempt.timestamp);
            return remaining > 0 ? remaining : null;
        }
    }

    /**
     * Get all attempts for a specific question
     */
    getQuestionHistory(questionId: number): QuestionAttempt | undefined {
        const history = this.getHistory();
        return [...history].reverse().find(h => h.questionId === questionId);
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
     * Clear all history
     */
    clearHistory(): void {
        this.saveHistory([]);
        // Also clear interpretation history
        this.userDataService.saveUserInterpretationHistory([]);
        // Also reset profile stats
        this.contentService.resetStats();
        console.log('🗑️ Question history cleared');
    }

    /**
     * Get all history from Unified User Data
     */
    private getHistory(): QuestionAttempt[] {
        const userData = this.userDataService.getUserData();
        if (userData && userData.user.questionHistory) {
            return userData.user.questionHistory;
        }
        return [];
    }

    /**
     * Save history to Unified User Data (V4: Specific Endpoint)
     */
    private saveHistory(history: QuestionAttempt[]): void {
        // Update via the dedicated history endpoint for granular saving
        this.userDataService.saveUserHistory(history);
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
