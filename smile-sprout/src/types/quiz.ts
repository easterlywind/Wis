import { Question } from './question';

export interface Quiz {
  id: string;
  title: string;
  levelId: string;
  maxScore: number;
  attemptCounts: number;
  questions: Question[];
}