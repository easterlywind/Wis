export interface Level {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  difficulty: number;
  requiredPoints: number;
  quizzes: string[];
  progress: number;
}