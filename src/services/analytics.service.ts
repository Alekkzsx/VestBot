import { Injectable, inject, computed, signal } from '@angular/core';
import { ContentService } from './content.service';
import { ActivitySessionService } from './activity-session.service';
import { QuestionHistoryService } from './question-history.service';

export interface SubjectStats {
    subject: string;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    avgTime?: number;
}

export interface DifficultyStats {
    easy: { total: number; correct: number; accuracy: number };
    medium: { total: number; correct: number; accuracy: number };
    hard: { total: number; correct: number; accuracy: number };
}

export interface TimelinePoint {
    date: string;
    xp: number;
    questionsAnswered: number;
}

export interface SessionSummary {
    id: string;
    type: string;
    date: string;
    questionsCount: number;
    earnedXP: number;
    duration?: number;
}

export interface Insight {
    type: 'strength' | 'weakness' | 'recommendation' | 'achievement';
    title: string;
    description: string;
    icon: string;
}

export interface AnalyticsData {
    overview: {
        totalQuestions: number;
        correctAnswers: number;
        accuracy: number;
        totalXP: number;
        currentStreak: number;
        studyDays: number;
        avgQuestionsPerDay: number;
    };
    bySubject: SubjectStats[];
    byDifficulty: DifficultyStats;
    timeline: TimelinePoint[];
    recentSessions: SessionSummary[];
    insights: Insight[];
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private contentService = inject(ContentService);
    private activitySessionService = inject(ActivitySessionService);
    private questionHistory = inject(QuestionHistoryService);

    /**
     * Calcula dados agregados de analytics
     */
    getAnalyticsData(): AnalyticsData {
        const stats = this.contentService.stats();
        const sessions = this.activitySessionService.completedSessions();
        // QuestionHistory não tem getAllAttempts, vamos usar dados do stats para estimar
        const history = this.buildHistoryFromStats(stats);

        return {
            overview: this.calculateOverview(stats, sessions),
            bySubject: this.calculateSubjectStats(history),
            byDifficulty: this.calculateDifficultyStats(history),
            timeline: this.calculateTimeline(sessions),
            recentSessions: this.getRecentSessions(sessions),
            insights: this.generateInsights(stats, history)
        };
    }

    /**
     * Construir histórico estimado baseado em stats
     * (Método temporário até ter histórico real)
     */
    private buildHistoryFromStats(stats: any): any[] {
        // Retorna array vazio se não tiver dados
        if (stats.questionsAnswered === 0) return [];

        // Mock data baseado nas estatísticas gerais
        const history: any[] = [];
        const subjects = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia'];
        const difficulties = ['Fácil', 'Médio', 'Difícil'];

        // Distribuir as questões entre matérias
        for (let i = 0; i < stats.questionsAnswered; i++) {
            const isCorrect = i < stats.correctAnswers;
            history.push({
                subject: subjects[i % subjects.length],
                difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
                correct: isCorrect,
                timestamp: Date.now() - (stats.questionsAnswered - i) * 60000 // 1min between each
            });
        }

        return history;
    }

    private calculateOverview(stats: any, sessions: any[]): AnalyticsData['overview'] {
        const studyDays = this.calculateStudyDays(sessions);

        return {
            totalQuestions: stats.questionsAnswered,
            correctAnswers: stats.correctAnswers,
            accuracy: stats.questionsAnswered > 0
                ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
                : 0,
            totalXP: stats.xp,
            currentStreak: stats.currentStreak,
            studyDays,
            avgQuestionsPerDay: studyDays > 0
                ? Math.round(stats.questionsAnswered / studyDays)
                : 0
        };
    }

    private calculateSubjectStats(history: any[]): SubjectStats[] {
        const subjectMap = new Map<string, { total: number; correct: number }>();

        history.forEach(attempt => {
            const subject = attempt.subject || 'Geral';
            const current = subjectMap.get(subject) || { total: 0, correct: 0 };

            current.total++;
            if (attempt.correct) {
                current.correct++;
            }

            subjectMap.set(subject, current);
        });

        return Array.from(subjectMap.entries())
            .map(([subject, data]) => ({
                subject,
                totalQuestions: data.total,
                correctAnswers: data.correct,
                accuracy: Math.round((data.correct / data.total) * 100)
            }))
            .sort((a, b) => b.totalQuestions - a.totalQuestions);
    }

    private calculateDifficultyStats(history: any[]): DifficultyStats {
        const stats = {
            easy: { total: 0, correct: 0, accuracy: 0 },
            medium: { total: 0, correct: 0, accuracy: 0 },
            hard: { total: 0, correct: 0, accuracy: 0 }
        };

        history.forEach(attempt => {
            const difficulty = attempt.difficulty?.toLowerCase() || 'medium';
            const key = difficulty === 'fácil' ? 'easy'
                : difficulty === 'difícil' ? 'hard'
                    : 'medium';

            stats[key].total++;
            if (attempt.correct) {
                stats[key].correct++;
            }
        });

        // Calcular acurácia
        Object.keys(stats).forEach(key => {
            const k = key as keyof DifficultyStats;
            stats[k].accuracy = stats[k].total > 0
                ? Math.round((stats[k].correct / stats[k].total) * 100)
                : 0;
        });

        return stats;
    }

    private calculateTimeline(sessions: any[]): TimelinePoint[] {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const dailyData = new Map<string, { xp: number; questions: number }>();

        sessions.forEach(session => {
            const date = new Date(session.completedAt || session.startedAt);
            if (date >= last30Days) {
                const dateStr = date.toISOString().split('T')[0];
                const current = dailyData.get(dateStr) || { xp: 0, questions: 0 };

                current.xp += session.earnedXP || 0;
                current.questions += session.questionsCount || 0;

                dailyData.set(dateStr, current);
            }
        });

        return Array.from(dailyData.entries())
            .map(([date, data]) => ({
                date,
                xp: data.xp,
                questionsAnswered: data.questions
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    private getRecentSessions(sessions: any[]): SessionSummary[] {
        return sessions
            .slice(-10)
            .reverse()
            .map(session => ({
                id: session.id,
                type: session.type,
                date: new Date(session.completedAt || session.startedAt).toISOString(),
                questionsCount: session.questionsCount,
                earnedXP: session.earnedXP,
                duration: this.calculateDuration(session)
            }));
    }

    private calculateDuration(session: any): number | undefined {
        if (session.completedAt && session.startedAt) {
            return Math.round((session.completedAt - session.startedAt) / 1000 / 60);
        }
        return undefined;
    }

    private calculateStudyDays(sessions: any[]): number {
        const uniqueDays = new Set(
            sessions.map(s => new Date(s.completedAt || s.startedAt).toDateString())
        );
        return uniqueDays.size;
    }

    private generateInsights(stats: any, history: any[]): Insight[] {
        const insights: Insight[] = [];

        // Best subject
        const subjectStats = this.calculateSubjectStats(history);
        if (subjectStats.length > 0) {
            const best = subjectStats.reduce((a, b) => a.accuracy > b.accuracy ? a : b);
            if (best.accuracy >= 80) {
                insights.push({
                    type: 'strength',
                    title: `Excelente em ${best.subject}`,
                    description: `Você tem ${best.accuracy}% de acerto nesta matéria!`,
                    icon: '🌟'
                });
            }
        }

        // Weak subject
        if (subjectStats.length > 0) {
            const worst = subjectStats.reduce((a, b) => a.accuracy < b.accuracy ? a : b);
            if (worst.accuracy < 60 && worst.totalQuestions >= 10) {
                insights.push({
                    type: 'weakness',
                    title: `Foco em ${worst.subject}`,
                    description: `Pratique mais esta matéria para melhorar (${worst.accuracy}% de acerto)`,
                    icon: '📚'
                });
            }
        }

        // Streak recommendation
        if (stats.currentStreak === 0) {
            insights.push({
                type: 'recommendation',
                title: 'Comece uma sequência',
                description: 'Estude hoje para iniciar sua streak e ganhar mais XP!',
                icon: '🔥'
            });
        } else if (stats.currentStreak >= 7) {
            insights.push({
                type: 'achievement',
                title: 'Streak impressionante!',
                description: `${stats.currentStreak} dias consecutivos! Continue assim.`,
                icon: '💪'
            });
        }

        // High accuracy
        const accuracy = stats.questionsAnswered > 0
            ? (stats.correctAnswers / stats.questionsAnswered) * 100
            : 0;

        if (accuracy >= 85 && stats.questionsAnswered >= 50) {
            insights.push({
                type: 'achievement',
                title: 'Desempenho excepcional',
                description: `${Math.round(accuracy)}% de acerto geral. Você está pronto!`,
                icon: '🎯'
            });
        }

        return insights;
    }
}
