import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from './content.service';
import { firstValueFrom } from 'rxjs';

interface QuestionFileFormat {
    id?: number;               // Optional - some files don't have this field
    materia: string;
    dificuldade: string;
    enunciado: string;
    alternativas: string[];
    correta: string;
    explicacao_base?: string;
    imagem?: string;           // Image path/URL
    image_id?: string;         // Alternative image field used in some files
    texto_referencia?: string; // Support/reference text
    grupo_id?: number;         // Question group identifier
    tema?: string;             // Question theme
}

export interface QuestionFile {
    name: string;
    displayName: string;
    path: string;
    loaded: boolean;
    questionCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class QuestionLoaderService {
    private http = inject(HttpClient);

    // Available question files
    availableFiles: QuestionFile[] = [
        { name: 'Padrão.txt', displayName: 'Todas as Questões', path: '/questions/Padrão.txt', loaded: false, questionCount: 0 }
    ];

    // Cache of loaded questions
    private questionCache = new Map<string, Question[]>();

    // Loading state
    isLoading = signal(false);
    loadingProgress = signal(0);

    /**
     * Load questions from a specific file
     */
    async loadQuestionsFromFile(filename: string): Promise<Question[]> {
        // Check cache first
        if (this.questionCache.has(filename)) {
            console.log(`Using cached questions for ${filename}`);
            return this.questionCache.get(filename)!;
        }

        this.isLoading.set(true);

        try {
            const file = this.availableFiles.find(f => f.name === filename);
            if (!file) {
                throw new Error(`File ${filename} not found`);
            }

            console.log(`Loading questions from ${file.path}...`);

            // Use HttpClient to fetch the file
            const text = await firstValueFrom(this.http.get(file.path, { responseType: 'text' }));
            const rawQuestions: QuestionFileFormat[] = JSON.parse(text);

            // Convert to Question format
            const questions = rawQuestions.map(q => this.convertQuestion(q));

            // Update file info
            file.loaded = true;
            file.questionCount = questions.length;

            // Cache the questions
            this.questionCache.set(filename, questions);

            console.log(`✓ Loaded ${questions.length} questions from ${filename}`);

            return questions;
        } catch (error) {
            console.error(`✗ Error loading questions from ${filename}:`, error);
            return [];
        } finally {
            this.isLoading.set(false);
        }
    }

    /**
     * Load questions from multiple files
     */
    async loadQuestionsFromFiles(filenames: string[]): Promise<Question[]> {
        this.isLoading.set(true);
        this.loadingProgress.set(0);

        const allQuestions: Question[] = [];

        for (let i = 0; i < filenames.length; i++) {
            try {
                const questions = await this.loadQuestionsFromFile(filenames[i]);
                allQuestions.push(...questions);
                this.loadingProgress.set(Math.round(((i + 1) / filenames.length) * 100));
            } catch (error) {
                console.error(`Failed to load ${filenames[i]}:`, error);
            }
        }

        this.isLoading.set(false);
        this.loadingProgress.set(0);

        console.log(`\n📊 TOTAL: ${allQuestions.length} questions loaded from ${filenames.length} files\n`);

        return allQuestions;
    }

    /**
     * Load all available question files
     */
    async loadAllQuestions(): Promise<Question[]> {
        console.log('🔄 Loading all question files...');
        const filenames = this.availableFiles.map(f => f.name);
        return this.loadQuestionsFromFiles(filenames);
    }

    /**
     * Convert question from file format to app format
     */
    private convertQuestion(q: QuestionFileFormat): Question {
        // Map difficulty
        const difficultyMap: { [key: string]: 'Fácil' | 'Médio' | 'Difícil' } = {
            'Fácil': 'Fácil',
            'Facil': 'Fácil',
            'Média': 'Médio',
            'Media': 'Médio',
            'Médio': 'Médio',
            'Medio': 'Médio',
            'Difícil': 'Difícil',
            'Dificil': 'Difícil'
        };

        const difficulty = difficultyMap[q.dificuldade] || 'Médio';

        // Find correct index by matching the correct answer text with options
        const correctIndex = q.alternativas.findIndex(alt =>
            alt.trim().toLowerCase() === q.correta.trim().toLowerCase()
        );

        // If exact match not found, try partial match
        const finalCorrectIndex = correctIndex !== -1
            ? correctIndex
            : q.alternativas.findIndex(alt =>
                alt.toLowerCase().includes(q.correta.toLowerCase()) ||
                q.correta.toLowerCase().includes(alt.toLowerCase())
            );

        // Map image_id to imageUrl if imagem is not present
        let imageUrl = q.imagem;
        if (!imageUrl && q.image_id) {
            // Check if image_id already has an extension
            if (q.image_id.includes('.')) {
                imageUrl = `/images/${q.image_id}`;
            } else {
                imageUrl = `/images/${q.image_id}.png`;
            }
        }

        // Generate ID if not present (some files lack id field)
        const questionId = q.id !== undefined ? q.id : Math.floor(Math.random() * 1000000);

        return {
            id: questionId,
            subject: q.materia,
            text: q.enunciado,
            options: q.alternativas,
            correctIndex: finalCorrectIndex !== -1 ? finalCorrectIndex : 0,
            explanation: q.explicacao_base,
            difficulty: difficulty,
            imageUrl: imageUrl,
            supportText: q.texto_referencia,
            groupId: q.grupo_id,
            theme: q.tema
        };
    }

    /**
     * Get statistics about loaded questions
     */
    getStatistics() {
        const totalQuestions = Array.from(this.questionCache.values())
            .reduce((sum, questions) => sum + questions.length, 0);

        const loadedFiles = this.availableFiles.filter(f => f.loaded).length;

        return {
            totalQuestions,
            loadedFiles,
            totalFiles: this.availableFiles.length,
            cacheSize: this.questionCache.size
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.questionCache.clear();
        this.availableFiles.forEach(f => {
            f.loaded = false;
            f.questionCount = 0;
        });
    }
}
