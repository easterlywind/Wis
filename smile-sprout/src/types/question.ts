export type QuestionType = 'image' | 'video' | 'audio' | 'text';

export type AnswerChoice = "A" | "B" | "C" | "D";

export interface Question {
  id: string;
  quizId: string;
  emotionId: string;
  content: string;
  questionType: QuestionType;
  mediaUrl?: string;
  optionA: string;
  optionB: string;
  optionC?: string | null;
  optionD?: string | null;

  hintText?: string | null;
  hintMediaUrl?: string | null;
  correctAnswer: AnswerChoice;
}
