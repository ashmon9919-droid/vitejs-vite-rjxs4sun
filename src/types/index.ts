export type MainTab =
  | 'today'
  | 'calendar'
  | 'nutrition'
  | 'recipes'
  | 'achievements'
  | 'profile';

export interface FoodItem {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  heightCm: number;
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  targetKcal: number;
  targetProtein: number;
  targetFat: number;
  targetCarbs: number;
  targetWaterL: number;
  targetSteps: number;
  caffeineLimitMg: number;
}

export interface DailyLog {
  date: string; // Формат: YYYY-MM-DD
  weightKg?: number;
  foods: FoodItem[];
  waterMl: number;
  caffeineMg: number;
  sleepHours?: number;
  sleepQualityPct?: number;
  sleepAwakenings?: number;
  steps?: number;
  workoutDone: boolean;
  workoutType?: string;
  workoutDurationMin?: number;
  workoutKcalBurned?: number;
  vitamins: { name: string; taken: boolean }[];
  moodEmoji?: string;
  energyLevel?: number; // 1-10
  stressLevel?: number; // 1-10
  wellbeingNotes?: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  prepTimeMin: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  targetGoal: 'cut' | 'maintain' | 'bulk';
  totalKcal: number;
  protein: number;
  fat: number;
  carbs: number;
  foods: Omit<FoodItem, 'id' | 'time'>[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'nutrition' | 'workout' | 'sleep' | 'water' | 'discipline';
  isUnlocked: (logs: Record<string, DailyLog>, profile: UserProfile) => boolean;
}
