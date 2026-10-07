import { MealItem, WorkoutSession } from './index';

export interface ParsedVoiceInput {
  rawText: string;
  summary: string; // Текст от ассистента: "Записать: 1 латте, 40 мин прогулки?"
  confidence: 'high' | 'medium' | 'low';
  extractedData: {
    meals?: Partial<MealItem>[];
    waterMl?: number;
    caffeineMg?: number;
    steps?: number;
    workoutSession?: Partial<WorkoutSession>;
    sleepMinutes?: number;
    moodEmoji?: string;
    note?: string;
  };
}
