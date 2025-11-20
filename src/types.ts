export interface Annotation {
  box: { // Normalized coordinates (0-1)
    x: number;
    y: number;
    width: number;
    height: number;
  };
  type: 'correct' | 'incorrect' | 'info';
  comment: string;
  recognizedText: string; // The text the AI identified in the box
  commonMistakes?: string; // Optional field for common mistakes
}

export interface AnnotationData {
  summary: string;
  overallScore?: string;
  annotations: Annotation[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  imageUrl?: string;
  annotationData?: AnnotationData;
}

export interface Mistake {
  id: string;
  subject: '数学' | '语文' | '英语';
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  analysis: string;
  date: string;
}

export interface ReportData {
  summary: {
    totalQuestions: number;
    correctRate: number;
    studyTime: number; // in minutes
  };
  mastery: {
    knowledgePoint: string;
    score: number;
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}