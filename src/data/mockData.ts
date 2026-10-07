import { Recipe, MealPlan, Achievement } from '../types';

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Белковый овсяноблин с сыром и зеленью',
    category: 'breakfast',
    kcal: 320,
    protein: 22,
    fat: 10,
    carbs: 34,
    prepTimeMin: 10,
    ingredients: [
      'Яйцо 1 шт',
      'Яичный белок 1 шт',
      'Овсяные хлопья 40г',
      'Сыр легкий 30г',
    ],
    instructions: [
      'Смешать яйцо, белок и овсянку.',
      'Вылить на сковороду.',
      'Жарить 3 мин, посыпать сыром.',
    ],
    tags: ['Высокий белок', 'Завтрак за 10 мин'],
  },
  {
    id: 'r2',
    title: 'Куриная грудка с брокколи и киноа',
    category: 'lunch',
    kcal: 420,
    protein: 42,
    fat: 8,
    carbs: 45,
    prepTimeMin: 25,
    ingredients: ['Куриное филе 180г', 'Киноа 50г', 'Брокколи 150г', 'Специи'],
    instructions: [
      'Отварить киноа.',
      'Обжарить филе без масла с брокколи.',
      'Подать всё вместе.',
    ],
    tags: ['Обед', 'Правильное питание'],
  },
  {
    id: 'r3',
    title: 'Творожно-ягодный парфе с миндалем',
    category: 'snack',
    kcal: 210,
    protein: 25,
    fat: 5,
    carbs: 16,
    prepTimeMin: 5,
    ingredients: ['Творог мягкий 200г', 'Ягоды 60г', 'Миндаль 10г'],
    instructions: ['Выложить слоями творог и ягоды.', 'Украсить орехами.'],
    tags: ['Перекус', 'Без сахара'],
  },
  {
    id: 'r4',
    title: 'Запеченный лосось со спаржей',
    category: 'dinner',
    kcal: 450,
    protein: 36,
    fat: 22,
    carbs: 12,
    prepTimeMin: 20,
    ingredients: ['Лосось 160г', 'Спаржа 100г', 'Лимон'],
    instructions: ['Запекать при 190°C в течение 15 минут.'],
    tags: ['Ужин', 'Омега-3'],
  },
];

export const INITIAL_MEAL_PLANS: MealPlan[] = [
  {
    id: 'mp1',
    title: '🔥 Экспресс-Сушка (1350 ккал)',
    description:
      'Идеальный дневной рацион для жиросжигания с высоким содержанием белка.',
    targetGoal: 'cut',
    totalKcal: 1350,
    protein: 115,
    fat: 42,
    carbs: 125,
    foods: [
      {
        name: 'Овсяноблин с сыром',
        kcal: 320,
        protein: 22,
        fat: 10,
        carbs: 34,
        mealType: 'breakfast',
      },
      {
        name: 'Яблоко зеленое',
        kcal: 80,
        protein: 0,
        fat: 0,
        carbs: 18,
        mealType: 'snack',
      },
      {
        name: 'Куриное филе с киноа и брокколи',
        kcal: 420,
        protein: 42,
        fat: 8,
        carbs: 45,
        mealType: 'lunch',
      },
      {
        name: 'Творожно-ягодный парфе',
        kcal: 210,
        protein: 25,
        fat: 5,
        carbs: 16,
        mealType: 'snack',
      },
      {
        name: 'Салат с тунцом и огурцом',
        kcal: 320,
        protein: 26,
        fat: 19,
        carbs: 12,
        mealType: 'dinner',
      },
    ],
  },
  {
    id: 'mp2',
    title: '⚖️ Баланс и Энергия (1700 ккал)',
    description: 'Рацион для поддержания формы и высокого уровня тонуса.',
    targetGoal: 'maintain',
    totalKcal: 1700,
    protein: 110,
    fat: 58,
    carbs: 180,
    foods: [
      {
        name: 'Овсянка с бананом',
        kcal: 410,
        protein: 12,
        fat: 12,
        carbs: 62,
        mealType: 'breakfast',
      },
      {
        name: 'Лосось запеченный со спаржей',
        kcal: 450,
        protein: 36,
        fat: 22,
        carbs: 12,
        mealType: 'lunch',
      },
      {
        name: 'Протеиновый батончик',
        kcal: 190,
        protein: 20,
        fat: 6,
        carbs: 15,
        mealType: 'snack',
      },
      {
        name: 'Индейка с гречкой',
        kcal: 480,
        protein: 38,
        fat: 12,
        carbs: 55,
        mealType: 'dinner',
      },
      {
        name: 'Горсть миндаля (20г)',
        kcal: 170,
        protein: 4,
        fat: 14,
        carbs: 4,
        mealType: 'snack',
      },
    ],
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'Железный старт',
    description: 'Создайте свой первый дневной лог',
    icon: '🚀',
    category: 'discipline',
    isUnlocked: (logs) => Object.keys(logs).length >= 1,
  },
  {
    id: 'a2',
    title: 'Водный баланс',
    description: 'Выпейте не менее 2 литров воды за день',
    icon: '💧',
    category: 'water',
    isUnlocked: (logs) =>
      Object.values(logs).some((l) => (l.waterMl || 0) >= 2000),
  },
  {
    id: 'a3',
    title: 'Снайпер КБЖУ',
    description: 'Попадите в норму калорий с точностью до 10%',
    icon: '🎯',
    category: 'nutrition',
    isUnlocked: (logs, profile) => {
      return Object.values(logs).some((l) => {
        const foods = l.foods || [];
        const kcal = foods.reduce((acc, f) => acc + (f.kcal || 0), 0);
        return Math.abs(kcal - profile.targetKcal) <= profile.targetKcal * 0.1;
      });
    },
  },
  {
    id: 'a4',
    title: 'Страж Сна',
    description: 'Посплите 8 и более часов за ночь',
    icon: '😴',
    category: 'sleep',
    isUnlocked: (logs) =>
      Object.values(logs).some((l) => (l.sleepHours || 0) >= 8),
  },
  {
    id: 'a5',
    title: 'Покоритель 10k шагов',
    description: 'Пройдите 10 000 шагов за один день',
    icon: '👟',
    category: 'workout',
    isUnlocked: (logs) =>
      Object.values(logs).some((l) => (l.steps || 0) >= 10000),
  },
];
