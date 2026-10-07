export interface Ingredient {
  name: string;
  amount: number;
  unit: 'г' | 'мл' | 'шт' | 'ст. л.' | 'ч. л.';
}

export interface Recipe {
  id: string;
  title: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTimeMinutes: number;
  servings: number;
  calories: number;
  proteinG: number;
  fatsG: number;
  carbsG: number;
  fiberG: number;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[]; // e.g. ['высокобелковое', 'быстро', 'без сахара']
}

export interface MealSlot {
  label: string; // "Завтрак", "Обед", "Перекус", "Ужин"
  recipe: Recipe;
}

export interface DailyCombo {
  id: string;
  title: string;
  description: string;
  breakfast: Recipe;
  lunch: Recipe;
  snack: Recipe;
  dinner: Recipe;
  totals: {
    calories: number;
    proteinG: number;
    fatsG: number;
    carbsG: number;
    fiberG: number;
  };
}
