import { FoodItem } from '../types';

export interface ParseResult {
  addedFoods?: Omit<FoodItem, 'id' | 'time'>[];
  addedWaterMl?: number;
  addedCaffeineMg?: number;
  addedSteps?: number;
  workoutDone?: boolean;
  workoutType?: string;
  sleepHours?: number;
  weightKg?: number;
  vitaminsTaken?: string[];
  assistantReply: string;
}

export async function parseUserLogWithAI(text: string): Promise<ParseResult> {
  const lower = text.toLowerCase();
  const addedFoods: Omit<FoodItem, 'id' | 'time'>[] = [];
  let addedWaterMl = 0;
  let addedCaffeineMg = 0;
  let addedSteps = 0;
  let workoutDone = false;
  let workoutType: string | undefined = undefined;
  let sleepHours: number | undefined = undefined;
  let weightKg: number | undefined = undefined;
  const vitaminsTaken: string[] = [];

  // Кофеин
  if (
    lower.includes('кофе') ||
    lower.includes('эспрессо') ||
    lower.includes('капучино') ||
    lower.includes('латте')
  ) {
    addedCaffeineMg += 80;
    addedFoods.push({
      name: 'Кофе с молоком',
      kcal: 45,
      protein: 2,
      fat: 2,
      carbs: 4,
      mealType: 'snack',
    });
  }

  // Вода
  const waterMatch = lower.match(/(\d+)\s*(мл|л|стакан|стакана|стаканов)/);
  if (waterMatch) {
    const val = parseInt(waterMatch[1], 10);
    const unit = waterMatch[2];
    if (unit === 'л') addedWaterMl += val * 1000;
    else if (unit.startsWith('стакан')) addedWaterMl += val * 250;
    else addedWaterMl += val;
  } else if (lower.includes('вода') || lower.includes('попила воду')) {
    addedWaterMl += 250;
  }

  // Еда
  if (
    lower.includes('яйц') ||
    lower.includes('омлет') ||
    lower.includes('глазунья')
  ) {
    addedFoods.push({
      name: 'Яичница из 2 яиц',
      kcal: 160,
      protein: 13,
      fat: 11,
      carbs: 1,
      mealType: 'breakfast',
    });
  }
  if (
    lower.includes('куриц') ||
    lower.includes('грудка') ||
    lower.includes('филе')
  ) {
    addedFoods.push({
      name: 'Куриное филе гриль (150г)',
      kcal: 220,
      protein: 35,
      fat: 4,
      carbs: 0,
      mealType: 'lunch',
    });
  }
  if (lower.includes('салат')) {
    addedFoods.push({
      name: 'Овощной салат',
      kcal: 90,
      protein: 2,
      fat: 5,
      carbs: 8,
      mealType: 'lunch',
    });
  }
  if (lower.includes('овсянк') || lower.includes('каша')) {
    addedFoods.push({
      name: 'Овсяная каша',
      kcal: 180,
      protein: 6,
      fat: 3,
      carbs: 32,
      mealType: 'breakfast',
    });
  }
  if (lower.includes('творог')) {
    addedFoods.push({
      name: 'Творог 5% (150г)',
      kcal: 180,
      protein: 24,
      fat: 7.5,
      carbs: 4,
      mealType: 'snack',
    });
  }

  // Тренировка
  if (
    lower.includes('тренировк') ||
    lower.includes('зал') ||
    lower.includes('позанималась') ||
    lower.includes('фитнес')
  ) {
    workoutDone = true;
    workoutType = 'Силовая / Фитнес';
  }

  // Шаги
  const stepsMatch = lower.match(/(\d+)\s*шаг/);
  if (stepsMatch) {
    addedSteps = parseInt(stepsMatch[1], 10);
  }

  // Сон
  const sleepMatch = lower.match(/спал[аи]?\s*(\d+(\.\d+)?)\s*час/);
  if (sleepMatch) {
    sleepHours = parseFloat(sleepMatch[1]);
  }

  // Вес
  const weightMatch = lower.match(/вес\s*(\d+(\.\d+)?)/);
  if (weightMatch) {
    weightKg = parseFloat(weightMatch[1]);
  }

  // Витамины
  if (
    lower.includes('витамин') ||
    lower.includes('д3') ||
    lower.includes('омега') ||
    lower.includes('магний')
  ) {
    if (lower.includes('д3') || lower.includes('d3')) vitaminsTaken.push('D3');
    if (lower.includes('омега')) vitaminsTaken.push('Омега-3');
    if (lower.includes('магний')) vitaminsTaken.push('Магний B6');
  }

  if (
    addedFoods.length === 0 &&
    addedWaterMl === 0 &&
    addedCaffeineMg === 0 &&
    !workoutDone &&
    !stepsMatch &&
    !sleepHours &&
    !weightKg
  ) {
    addedFoods.push({
      name: text,
      kcal: 250,
      protein: 10,
      fat: 8,
      carbs: 30,
      mealType: 'snack',
    });
  }

  return {
    addedFoods,
    addedWaterMl,
    addedCaffeineMg,
    addedSteps,
    workoutDone,
    workoutType,
    sleepHours,
    weightKg,
    vitaminsTaken,
    assistantReply: `Распознано: "${text}"`,
  };
}
