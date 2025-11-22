import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, TextAnalysis, StudyPlan, Subject, ETECCourse } from "../types";

// Initialize Gemini Client
const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
  throw new Error('VITE_API_KEY não encontrada. Configure o arquivo .env.local com VITE_API_KEY=sua_chave');
}
const ai = new GoogleGenAI({ apiKey });

// --- Helper for JSON parsing ---
const cleanAndParseJSON = (text: string) => {
  try {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", e);
    throw new Error("Invalid response format from AI");
  }
};

// --- QUIZ GENERATION ---
export const generateQuiz = async (subject: Subject, count: number = 5): Promise<Question[]> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            statement: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
          },
          required: ["id", "statement", "options", "correctIndex", "explanation"],
        },
      },
    },
    required: ["questions"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere ${count} questões de múltipla escolha sobre ${subject} no estilo do Vestibulinho ETEC. As questões devem ser apropriadas para alunos do 9º ano do Ensino Fundamental e abordar conteúdos do Ensino Fundamental II. Use linguagem clara e contextualizada.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "Você é um professor especialista no Vestibulinho ETEC e no currículo do Ensino Fundamental II brasileiro.",
      },
    });

    const data = cleanAndParseJSON(response.text || "{}");
    return data.questions || [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

// --- TEXT ANALYSIS ---
export const analyzeText = async (text: string, theme: string): Promise<TextAnalysis> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER },
      aspects: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
          },
          required: ["name", "score", "feedback"],
        },
      },
      generalComment: { type: Type.STRING },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["score", "aspects", "generalComment", "strengths", "improvements"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Tema: ${theme}\n\nTexto:\n${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "Você é um professor de Português especializado em textos dissertativos para alunos do Ensino Fundamental II. Avalie o texto em 4 aspectos: Coesão (0-25), Coerência (0-25), Gramática (0-25) e Estrutura (0-25). A nota total (0-100) é a soma dos aspectos. Forneça feedback construtivo e adequado para estudantes do 9º ano.",
      },
    });

    return cleanAndParseJSON(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
};

// --- STUDY PLAN GENERATION ---
export const generateStudyPlan = async (targetCourse: string, hoursPerDay: number, weakSubjects: string[]): Promise<StudyPlan> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      targetCourse: { type: Type.STRING },
      weeklySchedule: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            focus: { type: Type.STRING },
            tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.STRING },
          },
          required: ["day", "focus", "tasks", "tips"],
        },
      },
    },
    required: ["targetCourse", "weeklySchedule"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Crie um plano de estudos semanal para um aluno do 9º ano que quer passar no Vestibulinho ETEC para o curso de ${targetCourse}. O aluno tem ${hoursPerDay} horas por dia para estudar. As matérias de maior dificuldade são: ${weakSubjects.join(", ")}. Foque nessas matérias mas mantenha o equilíbrio com todas as disciplinas do Ensino Fundamental II (Matemática, Português, História, Geografia, Ciências e Inglês).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    return cleanAndParseJSON(response.text || "{}");
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

// --- TUTOR CHAT ---
// Using streaming for better UX in chat
export const createTutorChat = () => {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "Você é o ETEC Tutor, um tutor particular especializado em preparar alunos do 9º ano para o Vestibulinho ETEC. Você é paciente, didático e encorajador. Explique conceitos do Ensino Fundamental II de forma simples, use analogias adequadas para a idade e dê exemplos práticos. Se o aluno perguntar a resposta de uma questão, ajude-o a raciocinar, não dê a resposta direta imediatamente. Foque em conteúdos de Matemática, Português, História, Geografia, Ciências e Inglês.",
    }
  });
};
