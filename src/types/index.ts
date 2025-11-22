// Enums
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PLAN = 'PLAN',
  QUIZ = 'QUIZ',
  ESSAY = 'ESSAY',
  TUTOR = 'TUTOR',
}

export enum Subject {
  MATH = 'Matemática',
  PORTUGUESE = 'Português',
  HISTORY = 'História',
  GEOGRAPHY = 'Geografia',
  SCIENCE = 'Ciências',
  ENGLISH = 'Inglês',
}

export enum ETECCourse {
  ADMINISTRATION = 'Administração',
  INFORMATICS = 'Informática',
  LOGISTICS = 'Logística',
  ACCOUNTING = 'Contabilidade',
  NURSING = 'Enfermagem',
  MECHANICS = 'Mecânica',
  ELECTRONICS = 'Eletrônica',
  BUILDINGS = 'Edificações',
  CHEMISTRY = 'Química',
  ENVIRONMENT = 'Meio Ambiente',
  OTHER = 'Outro',
}

// Interfaces

export interface Question {
  id: string;
  statement: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  details: {
    questionId: string;
    correct: boolean;
    userAnswer: number;
  }[];
}

export interface TextAnalysis {
  score: number; // 0-100
  aspects: {
    name: string;
    score: number; // 0-25
    feedback: string;
  }[];
  generalComment: string;
  strengths: string[];
  improvements: string[];
}

export interface StudyPlanDay {
  day: string;
  focus: string;
  tasks: string[];
  tips: string;
}

export interface StudyPlan {
  targetCourse: string;
  weeklySchedule: StudyPlanDay[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
