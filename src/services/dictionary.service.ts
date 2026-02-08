import { Injectable } from '@angular/core';

/**
 * Dictionary entry with word and definition
 */
export interface DictionaryEntry {
    word: string;
    definition: string;
    subject?: string;
}

/**
 * Service to provide word definitions for academic terms
 */
@Injectable({
    providedIn: 'root'
})
export class DictionaryService {

    // Academic glossary with common terms
    private glossary: DictionaryEntry[] = [
        // Ciências / Biologia
        { word: 'célula', definition: 'Unidade básica estrutural e funcional dos seres vivos.', subject: 'Biologia' },
        { word: 'fotossíntese', definition: 'Processo pelo qual plantas convertem luz solar em energia química.', subject: 'Biologia' },
        { word: 'mitose', definition: 'Divisão celular que resulta em duas células-filhas idênticas.', subject: 'Biologia' },
        { word: 'meiose', definition: 'Divisão celular que reduz o número de cromossomos pela metade.', subject: 'Biologia' },
        { word: 'DNA', definition: 'Ácido desoxirribonucleico, molécula que contém as instruções genéticas.', subject: 'Biologia' },
        { word: 'ecossistema', definition: 'Conjunto de seres vivos e o ambiente em que vivem, incluindo suas interações.', subject: 'Biologia' },
        { word: 'evolução', definition: 'Processo de mudança nas características hereditárias de populações ao longo do tempo.', subject: 'Biologia' },
        { word: 'cadeia alimentar', definition: 'Sequência de organismos onde cada um serve de alimento para o próximo.', subject: 'Biologia' },

        // Química
        { word: 'átomo', definition: 'Menor unidade de um elemento químico que mantém suas propriedades.', subject: 'Química' },
        { word: 'molécula', definition: 'Conjunto de dois ou mais átomos ligados quimicamente.', subject: 'Química' },
        { word: 'íon', definition: 'Átomo ou molécula que ganhou ou perdeu elétrons, ficando eletricamente carregado.', subject: 'Química' },
        { word: 'elemento', definition: 'Substância pura formada por átomos de um mesmo tipo.', subject: 'Química' },
        { word: 'composto', definition: 'Substância formada por dois ou mais elementos químicos diferentes.', subject: 'Química' },
        { word: 'reação', definition: 'Processo em que substâncias (reagentes) se transformam em outras (produtos).', subject: 'Química' },
        { word: 'ácido', definition: 'Substância que libera íons H+ (prótons) em solução aquosa.', subject: 'Química' },
        { word: 'base', definition: 'Substância que libera íons OH- (hidroxila) em solução aquosa.', subject: 'Química' },
        { word: 'pH', definition: 'Escala que mede a acidez ou basicidade de uma solução (0 a 14).', subject: 'Química' },

        // Física
        { word: 'energia', definition: 'Capacidade de realizar trabalho ou produzir mudanças.', subject: 'Física' },
        { word: 'força', definition: 'Interação que pode causar aceleração ou deformação em um objeto.', subject: 'Física' },
        { word: 'velocidade', definition: 'Taxa de variação da posição de um objeto no tempo.', subject: 'Física' },
        { word: 'aceleração', definition: 'Taxa de variação da velocidade no tempo.', subject: 'Física' },
        { word: 'massa', definition: 'Quantidade de matéria em um corpo.', subject: 'Física' },
        { word: 'peso', definition: 'Força com que a gravidade atrai um corpo.', subject: 'Física' },
        { word: 'inércia', definition: 'Tendência de um corpo em manter seu estado de movimento ou repouso.', subject: 'Física' },

        // Geografia
        { word: 'erosão', definition: 'Desgaste e transporte de materiais da superfície terrestre por agentes naturais.', subject: 'Geografia' },
        { word: 'clima', definition: 'Conjunto de condições atmosféricas que caracterizam uma região ao longo do tempo.', subject: 'Geografia' },
        { word: 'latitude', definition: 'Distância angular de um ponto em relação à linha do Equador (0° a 90°).', subject: 'Geografia' },
        { word: 'longitude', definition: 'Distância angular de um ponto em relação ao Meridiano de Greenwich (0° a 180°).', subject: 'Geografia' },
        { word: 'relevo', definition: 'Conjunto de formas da superfície terrestre (montanhas, planícies, planaltos).', subject: 'Geografia' },
        { word: 'bioma', definition: 'Grande área geográfica com flora, fauna e clima característicos.', subject: 'Geografia' },

        // Matemática
        { word: 'perímetro', definition: 'Soma de todos os lados de uma figura geométrica.', subject: 'Matemática' },
        { word: 'área', definition: 'Medida da superfície de uma figura plana.', subject: 'Matemática' },
        { word: 'volume', definition: 'Medida do espaço ocupado por um sólido tridimensional.', subject: 'Matemática' },
        { word: 'fração', definition: 'Número que representa uma ou mais partes de um todo dividido.', subject: 'Matemática' },
        { word: 'porcentagem', definition: 'Razão de um número para 100, representada pelo símbolo %.', subject: 'Matemática' },
        { word: 'equação', definition: 'Igualdade matemática que contém uma ou mais incógnitas.', subject: 'Matemática' },
        { word: 'variável', definition: 'Símbolo que representa um valor desconhecido ou que pode variar.', subject: 'Matemática' },

        // Português / Gramática
        { word: 'substantivo', definition: 'Palavra que nomeia seres, objetos, lugares, sentimentos.', subject: 'Português' },
        { word: 'verbo', definition: 'Palavra que indica ação, estado ou fenômeno da natureza.', subject: 'Português' },
        { word: 'adjetivo', definition: 'Palavra que caracteriza ou qualifica um substantivo.', subject: 'Português' },
        { word: 'sujeito', definition: 'Termo da oração sobre o qual se declara algo.', subject: 'Português' },
        { word: 'predicado', definition: 'Termo da oração que contém a declaração sobre o sujeito.', subject: 'Português' },
        { word: 'sintaxe', definition: 'Parte da gramática que estuda a relação entre as palavras na frase.', subject: 'Português' },
        { word: 'semântica', definition: 'Estudo do significado das palavras e frases.', subject: 'Português' },
        { word: 'metáfora', definition: 'Figura de linguagem que compara coisas sem usar conectivos (como, tal qual).', subject: 'Português' },

        // História
        { word: 'império', definition: 'Forma de governo onde um imperador governa vastos territórios.', subject: 'História' },
        { word: 'democracia', definition: 'Sistema político onde o poder é exercido pelo povo.', subject: 'História' },
        { word: 'revolução', definition: 'Mudança radical e profunda nas estruturas políticas, sociais ou econômicas.', subject: 'História' },
        { word: 'feudalismo', definition: 'Sistema político e econômico da Idade Média baseado em terras e vassalagem.', subject: 'História' },
        { word: 'absolutismo', definition: 'Sistema de governo onde o rei tem poder total e ilimitado.', subject: 'História' },
    ];

    // Cache de palavras normalizadas
    private normalizedCache = new Map<string, DictionaryEntry[]>();

    constructor() {
        this.buildCache();
    }

    /**
     * Build cache with normalized words for faster lookup
     */
    private buildCache(): void {
        this.glossary.forEach(entry => {
            const normalized = this.normalizeWord(entry.word);
            if (!this.normalizedCache.has(normalized)) {
                this.normalizedCache.set(normalized, []);
            }
            this.normalizedCache.get(normalized)!.push(entry);
        });
    }

    /**
     * Normalize word by removing accents, converting to lowercase, and removing plurals
     */
    private normalizeWord(word: string): string {
        return word
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/s$/, ''); // Remove plural 's'
    }

    /**
     * Get definition(s) for a word
     */
    getDefinition(word: string): DictionaryEntry[] | null {
        const normalized = this.normalizeWord(word.trim());

        if (this.normalizedCache.has(normalized)) {
            return this.normalizedCache.get(normalized)!;
        }

        return null;
    }

    /**
     * Check if a word exists in the glossary
     */
    hasDefinition(word: string): boolean {
        const normalized = this.normalizeWord(word.trim());
        return this.normalizedCache.has(normalized);
    }

    /**
     * Get all entries for a specific subject
     */
    getEntriesBySubject(subject: string): DictionaryEntry[] {
        return this.glossary.filter(entry => entry.subject === subject);
    }

    /**
     * Get statistics about the glossary
     */
    getStatistics() {
        const subjects = new Set(this.glossary.map(e => e.subject).filter(s => s));
        return {
            totalEntries: this.glossary.length,
            subjects: Array.from(subjects),
            entriesBySubject: Array.from(subjects).map(subject => ({
                subject,
                count: this.glossary.filter(e => e.subject === subject).length
            }))
        };
    }
}
