import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  private readonly MODEL_TEXT = 'gemini-2.5-flash';
  private offlineMode = false;

  constructor() {
    try {
      this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
    } catch (error) {
      console.warn('Gemini API not configured, running in offline mode');
      this.offlineMode = true;
    }
  }

  // Thinking config for complex tasks
  private get modelConfig() {
    return {
      thinkingConfig: { thinkingBudget: 2048 }
    };
  }

  async getExplanation(question: string, context: string): Promise<string> {
    if (this.offlineMode) {
      return "Modo offline: Explicação via IA não disponível. Verifique se a questão possui explicação pré-carregada.";
    }

    try {
      const prompt = `Você é um professor expert no vestibulinho da ETEC. O aluno errou ou tem dúvida na seguinte questão sobre "${context}": "${question}". Explique de forma didática, curta e direta (máximo 3 parágrafos) qual é a resposta certa e o raciocínio.`;

      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: this.MODEL_TEXT,
        contents: prompt,
        config: this.modelConfig
      });

      return response.text || "Desculpe, não consegui gerar uma explicação no momento.";
    } catch (error) {
      console.error('Error fetching explanation:', error);
      return "Erro ao conectar com o tutor IA. Verifique sua conexão com a internet.";
    }
  }

  async chatWithTutor(message: string, history: any[]): Promise<string> {
    try {
      // Construct conversation history
      const contents = [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await this.ai.models.generateContent({
        model: this.MODEL_TEXT,
        contents: contents,
        config: {
          systemInstruction: "Você é o EtecBot, um tutor virtual especializado no Vestibulinho ETEC. Seu objetivo é ajudar estudantes com dúvidas sobre matérias (Português, Matemática, Ciências, História, Geografia), dar dicas de estudo e motivá-los. Seja didático, paciente e use uma linguagem jovem e acessível, mas correta. Mantenha as respostas concisas.",
        }
      });

      return response.text || "Desculpe, não entendi. Pode repetir?";
    } catch (error) {
      console.error('Chat error:', error);
      return "Estou com dificuldades de conexão no momento.";
    }
  }

  async generateInterpretationActivity(): Promise<any> {
    try {
      const prompt = "Gere um texto curto (estilo notícia, crônica ou artigo de opinião) adequado para o Vestibulinho ETEC, focado em temas como Cidadania, Meio Ambiente ou Tecnologia. Em seguida, crie 3 questões de interpretação de texto de múltipla escolha sobre ele.";

      const response = await this.ai.models.generateContent({
        model: this.MODEL_TEXT,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              textContent: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    statement: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctIndex: { type: Type.NUMBER },
                    explanation: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      return this.parseJSON(response.text);
    } catch (error) {
      console.error('Interpretation gen error:', error);
      return null;
    }
  }

  async generateStudySchedule(availableTime: string = "2 horas por dia"): Promise<any[]> {
    try {
      const prompt = `Crie um cronograma de estudos semanal (Segunda a Sexta) focado exclusivamente no Vestibulinho ETEC.
      Matérias: Português, Matemática, Ciências, História, Geografia.
      Tempo disponível: ${availableTime}.
      Distribua tópicos recorrentes (Regra de três, Porcentagem, Ecologia, Brasil República, etc).
      Retorne apenas o JSON.`;

      const response = await this.ai.models.generateContent({
        model: this.MODEL_TEXT,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                duration: { type: Type.STRING }
              }
            }
          }
        }
      });

      const result = this.parseJSON(response.text);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Schedule Gen Error", error);
      return [];
    }
  }

  async generateQuizQuestions(subjects: string[], count: number, difficulty: string): Promise<any[]> {
    try {
      // Limit count per request to ensure quality and speed, max 20 at a time usually safe for Flash
      const safeCount = Math.min(count, 30);

      const prompt = `Gere ${safeCount} questões de múltipla escolha inéditas estilo Vestibulinho ETEC.
      Matérias permitidas: ${subjects.join(', ')}.
      Nível de dificuldade: ${difficulty}.
      As questões devem ser variadas entre as matérias solicitadas.
      Estrutura JSON obrigatória.`;

      const response = await this.ai.models.generateContent({
        model: this.MODEL_TEXT,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING, description: "Matéria da questão (ex: Matemática)" },
                text: { type: Type.STRING, description: "Enunciado da questão" },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 alternativas" },
                correctIndex: { type: Type.NUMBER, description: "Índice da resposta correta (0-4)" },
                explanation: { type: Type.STRING, description: "Breve explicação da resposta" },
                difficulty: { type: Type.STRING }
              }
            }
          }
        }
      });

      const result = this.parseJSON(response.text);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Quiz Gen Error", error);
      return [];
    }
  }

  async correctEssay(theme: string, text: string): Promise<string> {
    try {
      const prompt = `Corrija a seguinte redação com o tema "${theme}".
      Texto do aluno: "${text}".
      
      Aja como um corretor oficial do Vestibulinho ETEC.
      Avalie:
      1. Ortografia e Gramática.
      2. Coerência e Coesão.
      3. Adequação ao Tema.
      4. Argumentação.
      
      Dê uma nota de 0 a 50 (padrão ETEC simplificado para treino) e forneça um feedback construtivo e detalhado, apontando pontos fortes e o que melhorar.`;

      const response = await this.ai.models.generateContent({
        model: this.MODEL_TEXT,
        contents: prompt,
        config: this.modelConfig
      });

      return response.text || "Não foi possível corrigir a redação no momento.";
    } catch (error) {
      console.error('Essay correction error:', error);
      return "Erro ao processar a correção.";
    }
  }

  private parseJSON(text: string): any {
    try {
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("JSON Parse Error", e);
      return null;
    }
  }
}