import { DailyLog, UserProfile, FoodItem } from '../types';

export function calculateTotals(meals: FoodItem[] = []) {
  return meals.reduce(
    (acc, meal) => {
      acc.calories += Number(meal.kcal || 0);
      acc.protein += Number(meal.protein || 0);
      acc.fat += Number(meal.fat || 0);
      acc.carbs += Number(meal.carbs || 0);
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

export function calculateDayQuality(
  log?: Partial<DailyLog> | null,
  profile?: Partial<UserProfile> | null
) {
  if (!log || !profile) {
    return {
      totalQuality: 0,
      nutScore: 0,
      wrkScore: 0,
      sleepScore: 0,
      vitScore: 0,
      waterScore: 0,
      caffeineScore: 0,
    };
  }

  const foods = log.foods || [];
  const totals = calculateTotals(foods);
  const totalKcal = totals.calories;

  // 1. Калории (35% веса)
  const targetKcal = profile.targetKcal || 2000;
  const kcalDiffRatio = Math.abs(totalKcal - targetKcal) / targetKcal;
  const nutScore = Math.max(
    0,
    Math.min(100, Math.round((1 - kcalDiffRatio * 0.8) * 100))
  );

  // 2. Тренировки и Шаги (20% веса)
  const steps = log.steps || 0;
  const stepScore = Math.min(
    100,
    Math.round((steps / (profile.targetSteps || 10000)) * 100)
  );
  const wrkScore = log.workoutDone ? 100 : stepScore;

  // 3. Сон (15% веса)
  const sleepHours = log.sleepHours || 0;
  const sleepScore = Math.min(100, Math.round((sleepHours / 8) * 100));

  // 4. Вода (15% веса)
  const waterL = (log.waterMl || 0) / 1000;
  const waterScore = Math.min(
    100,
    Math.round((waterL / (profile.targetWaterL || 2)) * 100)
  );

  // 5. Витамины (10% веса)
  const vits = log.vitamins || [];
  const takenVits = vits.filter((v) => v.taken).length;
  const vitScore =
    vits.length > 0 ? Math.round((takenVits / vits.length) * 100) : 100;

  // 6. Кофеин (5% веса - штраф за превышение нормы)
  const caffeineMg = log.caffeineMg || 0;
  const caffeineLimit = profile.caffeineLimitMg || 200;
  const caffeineScore =
    caffeineMg > caffeineLimit
      ? Math.max(0, 100 - (caffeineMg - caffeineLimit))
      : 100;

  const totalQuality = Math.round(
    nutScore * 0.35 +
      wrkScore * 0.2 +
      sleepScore * 0.15 +
      waterScore * 0.15 +
      vitScore * 0.1 +
      caffeineScore * 0.05
  );

  return {
    totalQuality: Math.min(100, Math.max(0, totalQuality)),
    nutScore,
    wrkScore,
    sleepScore,
    waterScore,
    vitScore,
    caffeineScore,
  };
}
