import React, { useState } from 'react';

// --- ЛОКАЛЬНЫЕ ЗАГЛУШКИ ДЛЯ ВСЕХ ИКОНОК ---
const Icon = (emoji: string) => (props: any) =>
  (
    <span {...props} style={{ display: 'inline-block', ...props?.style }}>
      {emoji}
    </span>
  );

const Trophy = Icon('🏆');
const CalendarIcon = Icon('📅');
const Utensils = Icon('🍽️');
const Dumbbell = Icon('🏋️');
const Bot = Icon('🤖');
const Plus = Icon('➕');
const Edit = Icon('✏️');
const Trash2 = Icon('🗑️');
const CheckCircle2 = Icon('✅');
const Flame = Icon('🔥');
const ScaleIcon = Icon('⚖️');
const ChevronLeft = Icon('◀️');
const ChevronRight = Icon('▶️');
const Sparkles = Icon('✨');
const AlertCircle = Icon('⚠️');
const X = Icon('❌');
const Save = Icon('💾');
const Zap = Icon('⚡');
const Heart = Icon('❤️');
const Filter = Icon('🔍');
const ArrowUpRight = Icon('↗️');
const Send = Icon('✉️');
const RefreshCw = Icon('🔄');
const Coffee = Icon('☕');
const Smile = Icon('😊');
const FileText = Icon('📝');
const Pill = Icon('💊');
const ActivityIcon = Icon('📈');
const Moon = Icon('🌙');
const Footprints = Icon('👣');

// --- ТИПЫ И ИНТЕРФЕЙСЫ ---
export interface FoodLog {
  id: string;
  date: string;
  title: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  isCustom?: boolean;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
}

export interface DailyHealthData {
  steps: number;
  activeCalories: number;
  sleepHours: number;
  vitamins: { [key: string]: boolean };
}

export interface DailyMeta {
  coffeeCount: number;
  mood: string;
  notes: string;
  health: DailyHealthData;
}

export interface Recipe {
  id: string;
  title: string;
  category: 'Завтрак' | 'Обед' | 'Ужин' | 'Перекус' | 'Десерт';
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  prepTime: string;
  ingredients: string[];
  instructions: string;
}

export interface Workout {
  id: string;
  title: string;
  location: 'home' | 'street' | 'gym';
  duration: string;
  caloriesBurned: number;
  level: 'Легкий' | 'Средний' | 'Хард';
  exercises: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

// --- БАЗА РЕЦЕПТОВ ---
const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Овсяноблин с сыром и красной рыбой',
    category: 'Завтрак',
    calories: 380,
    protein: 26,
    fat: 14,
    carbs: 34,
    prepTime: '12 мин',
    ingredients: [
      'Овсяные хлопья 40г',
      'Яйцо 2 шт',
      'Молоко 30мл',
      'Сыр легкий 30г',
      'Слабосоленая горбуша 40г',
    ],
    instructions:
      'Взбить овсянку с яйцом и молоком, вылить на сковороду. Пожарить с двух сторон, выложить сыр и рыбу, сложить пополам.',
  },
  {
    id: 'r2',
    title: 'Творожная запеканка с ягодами',
    category: 'Завтрак',
    calories: 290,
    protein: 32,
    fat: 5,
    carbs: 24,
    prepTime: '35 мин',
    ingredients: [
      'Творог 5% 200г',
      'Яйцо 1 шт',
      'Кукурузный крахмал 15г',
      'Сахзам по вкусу',
      'Замороженная вишня 50г',
    ],
    instructions:
      'Смешать творог с яйцом, сахзамом и крахмалом блендером. Выложить в форму, сверху ягоды. Запекать 30 мин при 180°C.',
  },
  {
    id: 'r3',
    title: 'Скрембл с авокадо и тостом',
    category: 'Завтрак',
    calories: 410,
    protein: 18,
    fat: 22,
    carbs: 32,
    prepTime: '10 мин',
    ingredients: [
      'Яйца 3 шт',
      'Авокадо 50г',
      'Цельнозерновой хлеб 2 ломтика',
      'Масло сливочное 5г',
      'Зелень',
    ],
    instructions:
      'Обжарить яйца на медленном огне постоянно помешивая. Подать на подсушенном тосте с размятым авокадо.',
  },
  {
    id: 'r4',
    title: 'Куриный филе-гриль с гречкой',
    category: 'Обед',
    calories: 450,
    protein: 42,
    fat: 8,
    carbs: 50,
    prepTime: '25 мин',
    ingredients: [
      'Куриное филе 180г',
      'Гречка сухая 50г',
      'Огурец 100г',
      'Помидор 100г',
      'Оливковое масло 5мл',
    ],
    instructions:
      'Замариновать филе в специях и обжарить на гриле. Отварить гречку. Нарезать свежий салат с каплей масла.',
  },
  {
    id: 'r5',
    title: 'Запеченный лосось с брокколи',
    category: 'Обед',
    calories: 480,
    protein: 38,
    fat: 24,
    carbs: 18,
    prepTime: '20 мин',
    ingredients: [
      'Стейк лосося 160г',
      'Брокколи 200г',
      'Лимонный сок',
      'Соевый соус 10мл',
      'Чеснок',
    ],
    instructions:
      'Запечь лосось с лимоном и соевым соусом в фольге (15 мин при 200°C). Брокколи отварить на пару 5 минут.',
  },
  {
    id: 'r6',
    title: 'Паста из кабачка с креветками',
    category: 'Ужин',
    calories: 280,
    protein: 30,
    fat: 8,
    carbs: 16,
    prepTime: '15 мин',
    ingredients: [
      'Креветки очищенные 180г',
      'Цукини 250г',
      'Чеснок 2 зубчика',
      'Сливки 10% 50мл',
      'Пармезан 10г',
    ],
    instructions:
      'Нарезать цукини соломкой. Обжарить чеснок и креветки 3 мин, добавить цукини и сливки, потушить 2 мин. Посыпать сыром.',
  },
  {
    id: 'r7',
    title: 'Салат с тунцом и яйцом пашот',
    category: 'Ужин',
    calories: 310,
    protein: 34,
    fat: 14,
    carbs: 8,
    prepTime: '12 мин',
    ingredients: [
      'Тунец в с/с 130г',
      'Яйцо 1 шт',
      'Микс салата 80г',
      'Огурец 1 шт',
      'Заправка: греческий йогурт + горчица',
    ],
    instructions:
      'Выложить салатный микс и огурец, добавить тунец. Сварить яйцо пашот и выложить сверху.',
  },
  {
    id: 'r8',
    title: 'Греческий йогурт с орехами и мёдом',
    category: 'Перекус',
    calories: 210,
    protein: 15,
    fat: 9,
    carbs: 18,
    prepTime: '3 мин',
    ingredients: ['Греческий йогурт 2% 170г', 'Грецкие орехи 15г', 'Мёд 5г'],
    instructions: 'Перемешать йогурт с мёдом и посыпать измельченными орехами.',
  },
  {
    id: 'r9',
    title: 'Чиа-пудинг на манго',
    category: 'Десерт',
    calories: 220,
    protein: 6,
    fat: 8,
    carbs: 28,
    prepTime: '10 мин + ночь',
    ingredients: [
      'Семена чиа 25г',
      'Кокосовое молоко лайт 120мл',
      'Пюре манго без сахара 70г',
    ],
    instructions:
      'Залить чиа молоком, оставить на ночь в холодильнике. Утром сверху выложить манговое пюре.',
  },
];

// --- БАЗА ТРЕНИРОВОК (30 ПРОГРАММ) ---
const INITIAL_WORKOUTS: Workout[] = [
  // 🏡 ДОМ
  {
    id: 'w1',
    title: 'Домашний жиросжигающий HIIT',
    location: 'home',
    duration: '25 мин',
    caloriesBurned: 280,
    level: 'Средний',
    exercises: [
      'Jumping Jacks - 45 сек',
      'Приседания с выпрыгиванием - 45 сек',
      'Отжимания - 45 сек',
      'Скалолаз - 45 сек',
      'Планка - 60 сек',
    ],
  },
  {
    id: 'w2',
    title: 'Утренний экспресс-тонус',
    location: 'home',
    duration: '15 мин',
    caloriesBurned: 130,
    level: 'Легкий',
    exercises: [
      'Приседания без веса - 20 раз',
      'Выпады назад - по 12 раз',
      'Ягодичный мостик - 25 раз',
      'Отжимания с колен - 12 раз',
    ],
  },
  {
    id: 'w3',
    title: 'Стальной пресс & Кор',
    location: 'home',
    duration: '20 мин',
    caloriesBurned: 180,
    level: 'Средний',
    exercises: [
      'Скручивания - 3х20',
      'Велосипед - 3х45 сек',
      'Подъем ног лежа - 3х15',
      'Боковая планка - по 30 сек',
    ],
  },
  {
    id: 'w4',
    title: 'Ягодицы & Ноги (без инвентаря)',
    location: 'home',
    duration: '30 мин',
    caloriesBurned: 250,
    level: 'Средний',
    exercises: [
      'Приседания плие - 4х20',
      'Выпады в реверанс - 3х15',
      'Махи ногой на четвереньках - 4х20',
      'Ягодичный мост на одной ноге - 3х12',
    ],
  },
  {
    id: 'w5',
    title: 'Домашний хардкор с резинками',
    location: 'home',
    duration: '35 мин',
    caloriesBurned: 310,
    level: 'Хард',
    exercises: [
      'Шаги с резинкой в полуприседе - 4х20',
      'Тяга резинки к поясу - 4х15',
      'Жим резинки вверх - 3х15',
      'Румынская тяга с резинкой - 4х15',
    ],
  },
  {
    id: 'w6',
    title: 'Верх тела & Красивые руки',
    location: 'home',
    duration: '20 мин',
    caloriesBurned: 200,
    level: 'Средний',
    exercises: [
      'Отжимания широким хватом - 3х12',
      'Обратные отжимания от стула - 3х15',
      'Планка с касанием плеч - 3х40 сек',
      'Супермен (спина) - 3х15',
    ],
  },
  {
    id: 'w7',
    title: 'Мягкая растяжка & Пилатес',
    location: 'home',
    duration: '25 мин',
    caloriesBurned: 110,
    level: 'Легкий',
    exercises: [
      'Растяжка бицепса бедра - 2 мин',
      'Кошка-собака для позвоночника - 15 раз',
      'Собака мордой вниз - 1 мин',
      'Растяжка ягодиц лежа - по 1.5 мин',
    ],
  },
  {
    id: 'w8',
    title: 'Табата 4х4 на всё тело',
    location: 'home',
    duration: '20 мин',
    caloriesBurned: 260,
    level: 'Хард',
    exercises: [
      'Берпи (20 сек работа / 10 сек отдых)',
      'Приседы с выпрыгиванием',
      'Отжимания',
      'Альпинист (Mountain Climbers)',
    ],
  },
  {
    id: 'w9',
    title: 'Калистеника: Силовой баланс',
    location: 'home',
    duration: '40 мин',
    caloriesBurned: 340,
    level: 'Хард',
    exercises: [
      'Отжимания «домиком» (на плечи) - 4х10',
      'Приседания на одной ноге (пистолетик) - 3х6',
      'Планка на одной руке - 4х30 сек',
      'Лодочка динамическая - 4х15',
    ],
  },
  {
    id: 'w10',
    title: 'Вечерняя релакс-йога и мобильность',
    location: 'home',
    duration: '20 мин',
    caloriesBurned: 90,
    level: 'Легкий',
    exercises: [
      'Суставная гимнастика - 5 мин',
      'Поза ребенка - 2 мин',
      'Скручивания позвоночника лежа - по 1 мин',
      'Медитативная дыхательная заминка - 5 мин',
    ],
  },

  // 🌳 УЛИЦА
  {
    id: 'w11',
    title: 'Интервальный бег + Лестница',
    location: 'street',
    duration: '30 мин',
    caloriesBurned: 320,
    level: 'Средний',
    exercises: [
      'Легкий бег - 5 мин',
      'Спринт - 30 сек (8 повторов)',
      'Забег по лестнице - 5 пролетов',
      'Заминка шагом - 5 мин',
    ],
  },
  {
    id: 'w12',
    title: 'Уличный воркаут на турниках',
    location: 'street',
    duration: '40 мин',
    caloriesBurned: 380,
    level: 'Хард',
    exercises: [
      'Подтягивания средним хватом - 4х8',
      'Отжимания на брусьях - 4х12',
      'Подъем ног к перекладине - 3х10',
      'Австралийские подтягивания - 3х15',
    ],
  },
  {
    id: 'w13',
    title: 'Кардио-прогулка с ускорениями',
    location: 'street',
    duration: '45 мин',
    caloriesBurned: 240,
    level: 'Легкий',
    exercises: [
      'Быстрая ходьба - 10 мин',
      'Интервал бега трусцой - 3х5 мин',
      'Выпады на прогулке - 50 шагов',
      'Растяжка на скамейке - 5 мин',
    ],
  },
  {
    id: 'w14',
    title: 'Парковый функциональный тренинг',
    location: 'street',
    duration: '35 мин',
    caloriesBurned: 310,
    level: 'Средний',
    exercises: [
      'Запрыгивания на скамью - 3х15',
      'Отжимания от скамьи - 3х15',
      'Выпады в движении - 3х20 шагов',
      'Бег с высоким подниманием бедра - 4х30 сек',
    ],
  },
  {
    id: 'w15',
    title: 'Воркаут на пресс и статику',
    location: 'street',
    duration: '25 мин',
    caloriesBurned: 210,
    level: 'Средний',
    exercises: [
      'Уголок на брусьях - 4х20 сек',
      'Подъем коленей в висе - 4х15',
      'Планка на траве - 3х60 сек',
      'Скручивания на скамье - 3х20',
    ],
  },
  {
    id: 'w16',
    title: 'Спринтерский HIIT на стадионе',
    location: 'street',
    duration: '25 мин',
    caloriesBurned: 350,
    level: 'Хард',
    exercises: [
      'Разминка 400м - 1 круг',
      'Спринт 100м на максимуме - 6 раз',
      'Берпи между спринтами - 10 раз',
      'Заминка 400м пешком',
    ],
  },
  {
    id: 'w17',
    title: 'Легкий восстановительный кросс',
    location: 'street',
    duration: '30 мин',
    caloriesBurned: 220,
    level: 'Легкий',
    exercises: [
      'Непрерывный бег в комфортном темпе - 25 мин',
      'Динамическая растяжка на свежем воздухе - 5 мин',
    ],
  },
  {
    id: 'w18',
    title: 'Уличная Табата с собственным весом',
    location: 'street',
    duration: '20 мин',
    caloriesBurned: 270,
    level: 'Хард',
    exercises: [
      'Приседания с выпрыгиванием',
      'Отжимания с хлопком/обычные',
      'Челночный бег 10м',
      'Планка с прыжком',
    ],
  },
  {
    id: 'w19',
    title: 'Кроссфит-комплекс "На площадке"',
    location: 'street',
    duration: '45 мин',
    caloriesBurned: 420,
    level: 'Хард',
    exercises: [
      '5 кругов на время:',
      'Подтягивания - 10 раз',
      'Отжимания - 20 раз',
      'Приседания - 30 раз',
      'Бег 200м',
    ],
  },
  {
    id: 'w20',
    title: 'Зарядка на воздухе + суставы',
    location: 'street',
    duration: '20 мин',
    caloriesBurned: 140,
    level: 'Легкий',
    exercises: [
      'Махи руками и ногами - 5 мин',
      'Наклоны и вращения тазом - 5 мин',
      'Легкие приседания и выпады - 5 мин',
      'Дыхательные упражнения - 5 мин',
    ],
  },

  // 🏋️‍♀️ ЗАЛ
  {
    id: 'w21',
    title: 'Ягодицы & Бицепс бедра (Leg Day)',
    location: 'gym',
    duration: '60 мин',
    caloriesBurned: 420,
    level: 'Хард',
    exercises: [
      'Ягодичный мост со штангой - 4х12',
      'Румынская тяга с гантелями - 4х10',
      'Жим ногами (высокая постановка) - 3х15',
      'Сгибание ног в тренажере - 4х12',
      'Гиперэкстензия с акцентом на ягодицы - 3х15',
    ],
  },
  {
    id: 'w22',
    title: 'Верх тела: Спина, плечи, грудь',
    location: 'gym',
    duration: '50 мин',
    caloriesBurned: 340,
    level: 'Средний',
    exercises: [
      'Тяга верхнего блока к груди - 4х12',
      'Жим гантелей на наклоне - 3х10',
      'Махи гантелями в стороны - 4х15',
      'Тяга горизонтального блока - 3х12',
      'Пуловер с гантелью - 3х12',
    ],
  },
  {
    id: 'w23',
    title: 'Мощные квадрицепсы & Икры',
    location: 'gym',
    duration: '55 мин',
    caloriesBurned: 400,
    level: 'Хард',
    exercises: [
      'Приседания со штангой на плечах - 4х8',
      'Разгибание ног в тренажере - 4х15',
      'Гакк-приседания - 3х10',
      'Подъем на носки стоя - 4х20',
    ],
  },
  {
    id: 'w24',
    title: 'Силовая спина & Дельты',
    location: 'gym',
    duration: '50 мин',
    caloriesBurned: 360,
    level: 'Хард',
    exercises: [
      'Тяга штанги в наклоне - 4х10',
      'Армейский жим стоя - 4х8',
      'Тяга Т-грифа - 3х10',
      'L-отведения на заднюю дельту - 4х15',
      'Шраги с гантелями - 3х15',
    ],
  },
  {
    id: 'w25',
    title: 'Грудь & Руки (Бицепс + Трицепс)',
    location: 'gym',
    duration: '50 мин',
    caloriesBurned: 350,
    level: 'Средний',
    exercises: [
      'Жим штанги лежа - 4х10',
      'Сведение рук в кроссовере - 3х15',
      'Сгибание рук со штангой на бицепс - 4х12',
      'Разгибание рук на блоке (трицепс) - 4х12',
      'Молотки с гантелями - 3х12',
    ],
  },
  {
    id: 'w26',
    title: 'Функционал с гирями & TRX',
    location: 'gym',
    duration: '40 мин',
    caloriesBurned: 330,
    level: 'Средний',
    exercises: [
      'Махи гирей (Kettlebell Swings) - 4х20',
      'Отжимания на петлях TRX - 3х12',
      'Тяга TRX к поясу - 3х15',
      'Присед Гоблет с гирей - 4х12',
      'Пресс с роликом - 3х10',
    ],
  },
  {
    id: 'w27',
    title: 'Эллипс / Степпер & Пресс (Кардио-день)',
    location: 'gym',
    duration: '45 мин',
    caloriesBurned: 380,
    level: 'Легкий',
    exercises: [
      'Интервальный эллипсоид - 30 мин',
      'Подъем ног в тренажере "Капитанское кресло" - 4х15',
      'Молитва на блоке (скручивания) - 4х15',
      'Растяжка - 5 мин',
    ],
  },
  {
    id: 'w28',
    title: 'Пауэрлифтинг: Становая & Жим',
    location: 'gym',
    duration: '65 мин',
    caloriesBurned: 450,
    level: 'Хард',
    exercises: [
      'Становая тяга классика - 5х5',
      'Жим лежа тяжелый - 5х5',
      'Подтягивания с отягощением - 4х6',
      'Гиперэкстензия с блином - 3х12',
    ],
  },
  {
    id: 'w29',
    title: 'Фуллбоди круговая со свободными весами',
    location: 'gym',
    duration: '45 мин',
    caloriesBurned: 370,
    level: 'Средний',
    exercises: [
      '3 круга:',
      'Выпады с гантелями - 12 раз',
      'Жим гантелей сидя - 12 раз',
      'Тяга гантели одной рукой - 12 раз',
      'Плавание в кроссовере - 15 раз',
    ],
  },
  {
    id: 'w30',
    title: 'Экспресс-сет в зале (когда мало времени)',
    location: 'gym',
    duration: '30 мин',
    caloriesBurned: 250,
    level: 'Средний',
    exercises: [
      'Суперсет: Приседания + Жим лежа - 4х10',
      'Суперсет: Тяга блока + Махи гантелями - 4х12',
      'Планка с блином на спине - 3х45 сек',
    ],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'scales' | 'calendar' | 'recipes' | 'workouts' | 'ai'
  >('scales');

  const [startWeight, setStartWeight] = useState<number>(78);
  const [targetWeight, setTargetWeight] = useState<number>(62);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState<number>(1650);

  const [targetProtein, setTargetProtein] = useState<number>(120);
  const [targetFat, setTargetFat] = useState<number>(55);
  const [targetCarbs, setTargetCarbs] = useState<number>(170);

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([
    { id: 'w-1', date: '2026-10-01', weight: 78.0 },
    { id: 'w-2', date: '2026-10-03', weight: 76.5 },
    { id: 'w-3', date: '2026-10-05', weight: 75.2 },
    { id: 'w-4', date: '2026-10-07', weight: 74.1 },
  ]);

  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([
    {
      id: 'f-1',
      date: '2026-10-07',
      title: 'Овсяноблин с сыром',
      calories: 380,
      protein: 26,
      fat: 14,
      carbs: 34,
    },
    {
      id: 'f-2',
      date: '2026-10-07',
      title: 'Курица с гречкой',
      calories: 450,
      protein: 42,
      fat: 8,
      carbs: 50,
    },
    {
      id: 'f-3',
      date: '2026-10-07',
      title: 'Чиа-пудинг',
      calories: 220,
      protein: 6,
      fat: 8,
      carbs: 28,
    },
  ]);

  // Метаданные дня (включая шаги, сон, витамины из здоровья)
  const [dailyMetaMap, setDailyMetaMap] = useState<{
    [date: string]: DailyMeta;
  }>({
    '2026-10-07': {
      coffeeCount: 2,
      mood: '🔥',
      notes: 'Отличная тренировка утром!',
      health: {
        steps: 8450,
        activeCalories: 420,
        sleepHours: 7.5,
        vitamins: { 'Витамин D3': true, 'Омега-3': true, 'Магний B6': false },
      },
    },
  });

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-07');
  const [newWeightInput, setNewWeightInput] = useState<string>('');

  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [workouts] = useState<Workout[]>(INITIAL_WORKOUTS);

  const [recipeCategory, setRecipeCategory] = useState<string>('Все');
  const [workoutLocation, setWorkoutLocation] = useState<
    'home' | 'street' | 'gym'
  >('home');

  const [showCustomFoodModal, setShowCustomFoodModal] =
    useState<boolean>(false);
  const [customFoodTitle, setCustomFoodTitle] = useState<string>('');
  const [customFoodCals, setCustomFoodCals] = useState<string>('');
  const [customFoodP, setCustomFoodP] = useState<string>('');
  const [customFoodF, setCustomFoodF] = useState<string>('');
  const [customFoodC, setCustomFoodC] = useState<string>('');

  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Привет! Я твой фитнес-ассистент. Синхронизировал данные здоровья, калории, сон и БЖУ!',
      timestamp: '19:00',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  const sortedWeightLogs = [...weightLogs].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const currentWeight =
    sortedWeightLogs.length > 0 ? sortedWeightLogs[0].weight : startWeight;

  const totalWeightLostKg = Math.max(
    0,
    Number((startWeight - currentWeight).toFixed(1))
  );
  const totalWeightToLose = startWeight - targetWeight;
  const progressPercentage =
    totalWeightToLose > 0
      ? Math.min(
          100,
          Math.max(0, Math.round((totalWeightLostKg / totalWeightToLose) * 100))
        )
      : 0;

  const caloriesByDate: { [key: string]: number } = {};
  foodLogs.forEach((log) => {
    caloriesByDate[log.date] = (caloriesByDate[log.date] || 0) + log.calories;
  });

  let totalExcessCalories = 0;
  Object.keys(caloriesByDate).forEach((date) => {
    if (caloriesByDate[date] > dailyCalorieTarget) {
      totalExcessCalories += caloriesByDate[date] - dailyCalorieTarget;
    }
  });

  const selectedDateFoodLogs = foodLogs.filter((f) => f.date === selectedDate);
  const selectedDateCals = selectedDateFoodLogs.reduce(
    (acc, curr) => acc + curr.calories,
    0
  );
  const selectedDateProtein = selectedDateFoodLogs.reduce(
    (acc, curr) => acc + curr.protein,
    0
  );
  const selectedDateFat = selectedDateFoodLogs.reduce(
    (acc, curr) => acc + curr.fat,
    0
  );
  const selectedDateCarbs = selectedDateFoodLogs.reduce(
    (acc, curr) => acc + curr.carbs,
    0
  );
  const selectedDateWeight = weightLogs.find(
    (w) => w.date === selectedDate
  )?.weight;

  // Мета выбранного дня по умолчанию
  const currentDailyMeta: DailyMeta = dailyMetaMap[selectedDate] || {
    coffeeCount: 0,
    mood: '😊',
    notes: '',
    health: {
      steps: 6000,
      activeCalories: 300,
      sleepHours: 8,
      vitamins: { 'Витамин D3': false, 'Омега-3': false, 'Магний B6': false },
    },
  };

  const updateDailyMeta = (patch: Partial<DailyMeta>) => {
    setDailyMetaMap((prev) => ({
      ...prev,
      [selectedDate]: { ...currentDailyMeta, ...patch },
    }));
  };

  const updateHealthData = (patch: Partial<DailyHealthData>) => {
    setDailyMetaMap((prev) => ({
      ...prev,
      [selectedDate]: {
        ...currentDailyMeta,
        health: { ...currentDailyMeta.health, ...patch },
      },
    }));
  };

  const toggleVitamin = (vitaminName: string) => {
    const currentVitamins = currentDailyMeta.health.vitamins || {};
    updateHealthData({
      vitamins: {
        ...currentVitamins,
        [vitaminName]: !currentVitamins[vitaminName],
      },
    });
  };

  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFoodTitle || !customFoodCals) return;

    const newLog: FoodLog = {
      id: Date.now().toString(),
      date: selectedDate,
      title: customFoodTitle,
      calories: Number(customFoodCals),
      protein: Number(customFoodP) || 0,
      fat: Number(customFoodF) || 0,
      carbs: Number(customFoodC) || 0,
      isCustom: true,
    };

    setFoodLogs([...foodLogs, newLog]);
    setCustomFoodTitle('');
    setCustomFoodCals('');
    setCustomFoodP('');
    setCustomFoodF('');
    setCustomFoodC('');
    setShowCustomFoodModal(false);
  };

  const handleAddRecipeToLog = (recipe: Recipe) => {
    const newLog: FoodLog = {
      id: Date.now().toString(),
      date: selectedDate,
      title: recipe.title,
      calories: recipe.calories,
      protein: recipe.protein,
      fat: recipe.fat,
      carbs: recipe.carbs,
    };
    setFoodLogs([...foodLogs, newLog]);
    alert(`«${recipe.title}» добавлено в дневник за ${selectedDate}!`);
  };

  const handleSaveEditedRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipe) return;

    setRecipes(
      recipes.map((r) => (r.id === editingRecipe.id ? editingRecipe : r))
    );
    setEditingRecipe(null);
  };

  const handleAddWeightLog = () => {
    if (!newWeightInput) return;
    const val = Number(newWeightInput);
    if (isNaN(val) || val <= 0) return;

    const existing = weightLogs.find((w) => w.date === selectedDate);
    if (existing) {
      setWeightLogs(
        weightLogs.map((w) =>
          w.date === selectedDate ? { ...w, weight: val } : w
        )
      );
    } else {
      setWeightLogs([
        ...weightLogs,
        { id: Date.now().toString(), date: selectedDate, weight: val },
      ]);
    }
    setNewWeightInput('');
  };

  const handleDeleteFoodLog = (id: string) => {
    setFoodLogs(foodLogs.filter((f) => f.id !== id));
  };

  const handleSendMessage = (textToSend?: string) => {
    const msgText = textToSend || inputMessage;
    if (!msgText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    setTimeout(() => {
      let aiReply =
        'Я проанализировал твои показатели здоровья, сна и БЖУ. Всё идет по плану!';
      const lower = msgText.toLowerCase();

      if (
        lower.includes('анализ') ||
        lower.includes('прогресс') ||
        lower.includes('здоров')
      ) {
        aiReply = `Вес: ${currentWeight} кг. За ${selectedDate}: шагов ${currentDailyMeta.health.steps}, сон ${currentDailyMeta.health.sleepHours}ч, съедено ${selectedDateCals} ккал. День оценивается как здоровый и сбалансированный!`;
      } else if (lower.includes('ужин') || lower.includes('поесть')) {
        aiReply =
          "На ужин отлично подойдет: 'Паста из кабачка с креветками' (280 ккал) или 'Салат с тунцом' (310 ккал).";
      } else if (lower.includes('срыв')) {
        aiReply =
          'Не переживай! Зафиксируй калории и сделай небольшую разминку из раздела тренировок.';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 700);
  };

  const filteredRecipes =
    recipeCategory === 'Все'
      ? recipes
      : recipes.filter((r) => r.category === recipeCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pb-24 md:pb-6">
      {/* ВЕРХНЯЯ ШАПКА */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-pink-500 to-rose-500 p-2 rounded-xl shadow-lg shadow-pink-500/20">
            <Flame className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-white">
              Steel Discipline
            </h1>
            <p className="text-xs text-slate-400">
              PWA Fitness & Health Tracker
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/50 text-xs">
          <ScaleIcon />
          <span>
            Вес: <strong className="text-white">{currentWeight} кг</strong>
          </span>
          <span className="text-emerald-400 font-bold">
            (-{totalWeightLostKg} кг)
          </span>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 space-y-6">
        {/* ВКЛАДКА 1: 3 ШКАЛЫ И АЧИВКИ */}
        {activeTab === 'scales' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Trophy /> Система Прогресса & Ачивок
                </h2>
                <p className="text-sm text-slate-400">
                  Сбрасывай вес, получай награды и контролируй дисциплину!
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block">Старт:</span>
                  <input
                    type="number"
                    value={startWeight}
                    onChange={(e) => setStartWeight(Number(e.target.value))}
                    className="w-12 bg-slate-800 border border-slate-600 rounded px-1 text-center font-bold text-white"
                  />{' '}
                  кг
                </div>
                <div className="border-r border-slate-700 h-7"></div>
                <div>
                  <span className="text-slate-400 block">Цель:</span>
                  <input
                    type="number"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(Number(e.target.value))}
                    className="w-12 bg-slate-800 border border-slate-600 rounded px-1 text-center font-bold text-white"
                  />{' '}
                  кг
                </div>
                <div className="border-r border-slate-700 h-7"></div>
                <div>
                  <span className="text-slate-400 block">Ккал/день:</span>
                  <input
                    type="number"
                    value={dailyCalorieTarget}
                    onChange={(e) =>
                      setDailyCalorieTarget(Number(e.target.value))
                    }
                    className="w-16 bg-slate-800 border border-slate-600 rounded px-1 text-center font-bold text-white"
                  />
                </div>
              </div>
            </div>

            {/* ШКАЛА 1: СНИЖЕНИЕ ВЕСА (КАЛЬЯН) */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                    💨
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-purple-300">
                      Шкала 1: Сброшенные килограммы
                    </h3>
                    <p className="text-xs text-slate-400">
                      Награда за победу над весом — релакс с кальяном!
                    </p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  {totalWeightLostKg} кг сброшено
                </span>
              </div>

              <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-400 h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (totalWeightLostKg / 13) * 100)}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {[
                  { target: 3, label: '3 кг', reward: 'Кальян легкий 💨' },
                  { target: 5, label: '5 кг', reward: 'Кальян премиум 🍏' },
                  {
                    target: 7,
                    label: '7 кг',
                    reward: 'Кальян на грейпфруте 🍊',
                  },
                  { target: 10, label: '10 кг', reward: 'Кальян в лаунже 🏛️' },
                  { target: 13, label: '13 кг', reward: 'VIP Кальян сет 🎉' },
                ].map((item) => {
                  const unlocked = totalWeightLostKg >= item.target;
                  return (
                    <div
                      key={item.target}
                      className={`p-3 rounded-xl border text-center transition ${
                        unlocked
                          ? 'bg-purple-900/40 border-purple-500/60 text-white'
                          : 'bg-slate-900/40 border-slate-700/40 text-slate-500'
                      }`}
                    >
                      <div className="flex justify-center mb-1">
                        {unlocked ? (
                          <CheckCircle2 />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600" />
                        )}
                      </div>
                      <div className="font-extrabold text-sm">{item.label}</div>
                      <div className="text-[11px] mt-1 leading-tight">
                        {item.reward}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ШКАЛА 2: % ОТ ЦЕЛИ (ЧИТМИЛЫ) */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                    🍕
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-amber-300">
                      Шкала 2: % выполнения цели веса
                    </h3>
                    <p className="text-xs text-slate-400">
                      Прогресс от начального до целевого веса — Читмилы!
                    </p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {progressPercentage}% выполнено
                </span>
              </div>

              <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 h-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  {
                    pct: 30,
                    reward: 'Шоколадка 🍫',
                    desc: 'Плитка Ritter Sport',
                  },
                  {
                    pct: 50,
                    reward: 'Сочная Шаурма 🌯',
                    desc: 'Экватор цели!',
                  },
                  {
                    pct: 70,
                    reward: 'Итальянская Пицца 🍕',
                    desc: 'Большая пицца',
                  },
                  {
                    pct: 100,
                    reward: 'Бургер Сет + Фри 🍔',
                    desc: 'Финальный триумф!',
                  },
                ].map((item) => {
                  const unlocked = progressPercentage >= item.pct;
                  return (
                    <div
                      key={item.pct}
                      className={`p-3.5 rounded-xl border transition ${
                        unlocked
                          ? 'bg-amber-900/40 border-amber-500/60 text-white'
                          : 'bg-slate-900/40 border-slate-700/40 text-slate-500'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-xs text-amber-400">
                          {item.pct}%
                        </span>
                        {unlocked && <Sparkles />}
                      </div>
                      <div className="font-bold text-sm text-white">
                        {item.reward}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {item.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ШКАЛА 3: ПЕРЕБОР КАЛОРИЙ (НАКАЗАНИЯ) */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-rose-500/30 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                    ⚡
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-rose-300">
                      Шкала 3: Суммарный перебор калорий
                    </h3>
                    <p className="text-xs text-slate-400">
                      Накопленный излишек калорий за историю — Отработай!
                    </p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                  +{totalExcessCalories} ккал
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                  {
                    limit: 1000,
                    punishment: '50 отжиманий + 100 приседаний 🏋️‍♀️',
                    label: '1 000 ккал',
                  },
                  {
                    limit: 3000,
                    punishment: '2 часа на беговой дорожке 🏃‍♀️',
                    label: '3 000 ккал',
                  },
                  {
                    limit: 5000,
                    punishment: '150 берпи + 1 час планки 💥',
                    label: '5 000 ккал',
                  },
                  {
                    limit: 10000,
                    punishment: 'Марафон: 3ч кардио + 200 берпи ☠️',
                    label: '10 000 ккал',
                  },
                ].map((item) => {
                  const activePenalty = totalExcessCalories >= item.limit;
                  return (
                    <div
                      key={item.limit}
                      className={`p-3.5 rounded-xl border transition ${
                        activePenalty
                          ? 'bg-rose-950/50 border-rose-500/60 text-white'
                          : 'bg-slate-900/40 border-slate-700/40 text-slate-500'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className={`text-xs font-bold ${
                            activePenalty ? 'text-rose-400' : 'text-slate-500'
                          }`}
                        >
                          {item.label}
                        </span>
                        {activePenalty && <AlertCircle />}
                      </div>
                      <div className="font-semibold text-xs mt-1 text-slate-200">
                        {item.punishment}
                      </div>
                      <div className="mt-2 text-[10px] font-mono">
                        {activePenalty ? (
                          <span className="text-rose-400 font-bold">
                            ⚠️ ТРЕБУЕТ ОТРАБОТКИ
                          </span>
                        ) : (
                          <span className="text-slate-500">Чисто</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ВКЛАДКА 2: КАЛЕНДАРЬ, ЗДОРОВЬЕ (ШАГИ, СОН, КАЛ), ВИТАМИНЫ, БЖУ */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 p-5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CalendarIcon /> Календарь & Здоровье Дня
                </h2>
                <p className="text-sm text-slate-400">
                  Вес, питание, шаги, сон, витамины и оценка дня
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 pl-1">Дата:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-slate-800 text-white border border-slate-600 rounded-lg px-2 py-1 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Левая колонка: Ввод параметров, Здоровье, Витамины, Кофе */}
              <div className="space-y-4">
                {/* 🍏 Интеграция Здоровья (Шаги, Сон, Активные ккал) */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <ActivityIcon /> Apple Health / Google Fit
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                      {currentDailyMeta.health.steps >= 8000 &&
                      currentDailyMeta.health.sleepHours >= 7
                        ? '🟢 Здоровый день'
                        : '⚠️ Есть просадки'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    {/* Шаги */}
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700">
                      <span className="text-[9px] text-slate-400 flex items-center justify-center gap-0.5">
                        <Footprints /> Шаги
                      </span>
                      <input
                        type="number"
                        value={currentDailyMeta.health.steps}
                        onChange={(e) =>
                          updateHealthData({ steps: Number(e.target.value) })
                        }
                        className="w-full bg-slate-800 text-white text-xs font-bold text-center rounded mt-1 py-0.5"
                      />
                    </div>
                    {/* Сон */}
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700">
                      <span className="text-[9px] text-slate-400 flex items-center justify-center gap-0.5">
                        <Moon /> Сон (ч)
                      </span>
                      <input
                        type="number"
                        step="0.5"
                        value={currentDailyMeta.health.sleepHours}
                        onChange={(e) =>
                          updateHealthData({
                            sleepHours: Number(e.target.value),
                          })
                        }
                        className="w-full bg-slate-800 text-white text-xs font-bold text-center rounded mt-1 py-0.5"
                      />
                    </div>
                    {/* Активные ккал */}
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700">
                      <span className="text-[9px] text-slate-400 flex items-center justify-center gap-0.5">
                        <Flame /> Актив ккал
                      </span>
                      <input
                        type="number"
                        value={currentDailyMeta.health.activeCalories}
                        onChange={(e) =>
                          updateHealthData({
                            activeCalories: Number(e.target.value),
                          })
                        }
                        className="w-full bg-slate-800 text-white text-xs font-bold text-center rounded mt-1 py-0.5"
                      />
                    </div>
                  </div>
                </div>

                {/* 💊 Трекер Витаминов и БАДов */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2.5">
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                    <Pill /> Витамины и БАДы
                  </span>
                  <div className="space-y-1.5 pt-1">
                    {['Витамин D3', 'Омега-3', 'Магний B6'].map((vit) => {
                      const isTaken =
                        currentDailyMeta.health.vitamins?.[vit] || false;
                      return (
                        <button
                          key={vit}
                          onClick={() => toggleVitamin(vit)}
                          className={`w-full p-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition ${
                            isTaken
                              ? 'bg-purple-900/40 border-purple-500/60 text-purple-200'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          <span>{vit}</span>
                          <span className="flex items-center gap-1">
                            {isTaken ? 'Принято ✅' : 'Выпить ⭕'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ввод веса */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Вес на дату:</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {selectedDateWeight
                        ? `${selectedDateWeight} кг`
                        : 'Не указан'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Записать вес (кг)"
                      value={newWeightInput}
                      onChange={(e) => setNewWeightInput(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white flex-1 focus:outline-none"
                    />
                    <button
                      onClick={handleAddWeightLog}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition"
                    >
                      Сохранить
                    </button>
                  </div>
                </div>

                {/* Виджет КБЖУ */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">
                      Калории дня
                    </span>
                    <span
                      className={`font-bold ${
                        selectedDateCals > dailyCalorieTarget
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedDateCals} / {dailyCalorieTarget} ккал
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className={`h-full ${
                        selectedDateCals > dailyCalorieTarget
                          ? 'bg-rose-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (selectedDateCals / dailyCalorieTarget) * 100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/50">
                      <span className="text-[10px] text-blue-400 font-bold block">
                        Белки
                      </span>
                      <span className="font-bold text-xs text-white">
                        {selectedDateProtein}г / {targetProtein}г
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/50">
                      <span className="text-[10px] text-amber-400 font-bold block">
                        Жиры
                      </span>
                      <span className="font-bold text-xs text-white">
                        {selectedDateFat}г / {targetFat}г
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/50">
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        Углеводы
                      </span>
                      <span className="font-bold text-xs text-white">
                        {selectedDateCarbs}г / {targetCarbs}г
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCustomFoodModal(true)}
                    className="w-full mt-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white py-2 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1 transition"
                  >
                    <Plus /> + Свой прием еды
                  </button>
                </div>

                {/* ☕ Трекер Кофе */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Coffee /> Выпито кофе
                    </span>
                    <span className="font-bold text-white">
                      {currentDailyMeta.coffeeCount} чашек
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateDailyMeta({
                          coffeeCount: Math.max(
                            0,
                            currentDailyMeta.coffeeCount - 1
                          ),
                        })
                      }
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-xs text-white"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center text-sm">
                      {'☕'.repeat(currentDailyMeta.coffeeCount) || (
                        <span className="text-xs text-slate-500">
                          Без кофе сегодня
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        updateDailyMeta({
                          coffeeCount: currentDailyMeta.coffeeCount + 1,
                        })
                      }
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold text-xs text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 😊 Настроение */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                    <Smile /> Настроение дня
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {['🔥', '😊', '😐', '😴', '😔'].map((emo) => (
                      <button
                        key={emo}
                        onClick={() => updateDailyMeta({ mood: emo })}
                        className={`p-2 rounded-xl text-lg text-center transition ${
                          currentDailyMeta.mood === emo
                            ? 'bg-indigo-600/40 border border-indigo-500 scale-105'
                            : 'bg-slate-900 border border-slate-700'
                        }`}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 📝 Заметки */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <FileText /> Заметки и мысли
                  </span>
                  <textarea
                    rows={2}
                    value={currentDailyMeta.notes}
                    onChange={(e) => updateDailyMeta({ notes: e.target.value })}
                    placeholder="Как прошел день?..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Правая колонка: Еда */}
              <div className="md:col-span-2 bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                  <h3 className="font-bold text-base text-slate-200">
                    Приемы пищи ({selectedDateFoodLogs.length})
                  </h3>
                  <span className="text-xs text-slate-400">
                    Всего за день:{' '}
                    <strong className="text-white">
                      {selectedDateCals} ккал
                    </strong>
                  </span>
                </div>

                {selectedDateFoodLogs.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    На эту дату записи отсутствуют. Добавьте свой прием еды или
                    выберите из базы рецептов!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                    {selectedDateFoodLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                            {log.title}
                            {log.isCustom && (
                              <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                                Свой
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Б: {log.protein}г | Ж: {log.fat}г | У: {log.carbs}г
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-extrabold text-sm text-pink-400">
                            {log.calories} ккал
                          </span>
                          <button
                            onClick={() => handleDeleteFoodLog(log.id)}
                            className="text-slate-500 hover:text-rose-400 transition"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ВКЛАДКА 3: РЕЦЕПТЫ */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 p-5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Utensils /> База ПП-Рецептов
                </h2>
                <p className="text-sm text-slate-400">
                  Вкусные блюда с просчитанным БЖУ. Нажмите "+ В дневник" или
                  "Редактировать".
                </p>
              </div>

              <button
                onClick={() => setShowCustomFoodModal(true)}
                className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition"
              >
                <Plus /> Свой прием еды
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Все', 'Завтрак', 'Обед', 'Ужин', 'Перекус', 'Десерт'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setRecipeCategory(cat)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      recipeCategory === cat
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-slate-800 rounded-2xl border border-slate-700/80 p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold bg-slate-700 text-emerald-400 px-2 py-0.5 rounded-md">
                        {recipe.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {recipe.prepTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-100 mt-2">
                      {recipe.title}
                    </h3>

                    <div className="grid grid-cols-4 gap-1 bg-slate-900/60 p-2 rounded-xl mt-3 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          Ккал
                        </span>
                        <span className="font-extrabold text-pink-400">
                          {recipe.calories}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          Белки
                        </span>
                        <span className="font-bold text-slate-200">
                          {recipe.protein}г
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          Жиры
                        </span>
                        <span className="font-bold text-slate-200">
                          {recipe.fat}г
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          Угл
                        </span>
                        <span className="font-bold text-slate-200">
                          {recipe.carbs}г
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-[11px] font-bold text-slate-400">
                        Ингредиенты:
                      </span>
                      <ul className="text-xs text-slate-300 list-disc list-inside mt-1 space-y-0.5">
                        {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                          <li key={idx} className="truncate">
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingRecipe(recipe)}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <Edit /> Изменить
                    </button>

                    <button
                      onClick={() => handleAddRecipeToLog(recipe)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <Plus /> В дневник
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ВКЛАДКА 4: ТРЕНИРОВКИ (30 ПРОГРАММ) */}
        {activeTab === 'workouts' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Dumbbell /> Программы Тренировок (30 Комплексов)
              </h2>
              <p className="text-sm text-slate-400">
                Выберите локацию для занятий: Дом, Улица или Спортивный зал
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: 'home',
                  label: '🏡 Дом (10)',
                  color: 'from-amber-600 to-orange-600',
                },
                {
                  id: 'street',
                  label: '🌳 Улица (10)',
                  color: 'from-emerald-600 to-teal-600',
                },
                {
                  id: 'gym',
                  label: '🏋️‍♀️ Зал (10)',
                  color: 'from-purple-600 to-indigo-600',
                },
              ].map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setWorkoutLocation(loc.id as any)}
                  className={`py-3 rounded-2xl font-bold text-sm transition ${
                    workoutLocation === loc.id
                      ? `bg-gradient-to-r ${loc.color} text-white shadow-lg`
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workouts
                .filter((w) => w.location === workoutLocation)
                .map((workout) => (
                  <div
                    key={workout.id}
                    className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          workout.level === 'Хард'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-sky-500/20 text-sky-400'
                        }`}
                      >
                        {workout.level}
                      </span>
                      <span className="text-xs text-slate-400">
                        ⏱️ {workout.duration} | 🔥 {workout.caloriesBurned} ккал
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-100">
                      {workout.title}
                    </h3>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                      <span className="text-xs font-bold text-slate-400 block mb-1">
                        Упражнения:
                      </span>
                      <ul className="space-y-1">
                        {workout.exercises.map((ex, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-300 flex items-center gap-1.5"
                          >
                            <span className="text-sky-400 font-bold">•</span>{' '}
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() =>
                        alert(
                          `Тренировка «${workout.title}» зачтена! Потрачено ${workout.caloriesBurned} ккал.`
                        )
                      }
                      className="w-full bg-slate-700 hover:bg-sky-600 text-white py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 /> Выполнить
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ВКЛАДКА 5: ИИ АССИСТЕНТ */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-600 rounded-xl">
                  <Bot />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white">
                    Персональный ИИ-Ассистент
                  </h2>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>{' '}
                    Синхронизирован со здоровьем
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 h-[420px] flex flex-col p-4">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-pink-600 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-700 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[9px] opacity-60 block text-right mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 my-2 overflow-x-auto pb-1 text-[11px]">
                {[
                  'Анализ здоровья и шагов',
                  'Что съесть на ужин?',
                  'Как отработать срыв?',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1 rounded-full whitespace-nowrap transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-700">
                <input
                  type="text"
                  placeholder="Задать вопрос ИИ..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="bg-pink-600 hover:bg-pink-500 text-white p-2.5 rounded-xl transition"
                >
                  <Send />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* МОДАЛЬНОЕ ОКНО: СВОЙ ПРИЕМ ЕДЫ */}
      {showCustomFoodModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="font-bold text-base text-white">
                Добавить свой прием еды
              </h3>
              <button
                onClick={() => setShowCustomFoodModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleAddCustomFood} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Название блюда *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Сэндвич с индейкой"
                  value={customFoodTitle}
                  onChange={(e) => setCustomFoodTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Калории (ккал) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="350"
                    value={customFoodCals}
                    onChange={(e) => setCustomFoodCals(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Белки (г)
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    value={customFoodP}
                    onChange={(e) => setCustomFoodP(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Жиры (г)
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    value={customFoodF}
                    onChange={(e) => setCustomFoodF(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Углеводы (г)
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    value={customFoodC}
                    onChange={(e) => setCustomFoodC(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomFoodModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-xl font-bold text-xs"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 hover:bg-pink-500 text-white py-2 rounded-xl font-bold text-xs"
                >
                  Записать в дневник
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* МОДАЛЬНОЕ ОКНО: РЕДАКТИРОВАНИЕ РЕЦЕПТА */}
      {editingRecipe && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="font-bold text-base text-white">
                Редактировать рецепт
              </h3>
              <button
                onClick={() => setEditingRecipe(null)}
                className="text-slate-400 hover:text-white"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSaveEditedRecipe} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Название
                </label>
                <input
                  type="text"
                  value={editingRecipe.title}
                  onChange={(e) =>
                    setEditingRecipe({
                      ...editingRecipe,
                      title: e.target.value,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Ккал
                  </label>
                  <input
                    type="number"
                    value={editingRecipe.calories}
                    onChange={(e) =>
                      setEditingRecipe({
                        ...editingRecipe,
                        calories: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Белки
                  </label>
                  <input
                    type="number"
                    value={editingRecipe.protein}
                    onChange={(e) =>
                      setEditingRecipe({
                        ...editingRecipe,
                        protein: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Жиры
                  </label>
                  <input
                    type="number"
                    value={editingRecipe.fat}
                    onChange={(e) =>
                      setEditingRecipe({
                        ...editingRecipe,
                        fat: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Углев
                  </label>
                  <input
                    type="number"
                    value={editingRecipe.carbs}
                    onChange={(e) =>
                      setEditingRecipe({
                        ...editingRecipe,
                        carbs: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Ингредиенты (через запятую)
                </label>
                <textarea
                  rows={2}
                  value={editingRecipe.ingredients.join(', ')}
                  onChange={(e) =>
                    setEditingRecipe({
                      ...editingRecipe,
                      ingredients: e.target.value
                        .split(',')
                        .map((s) => s.trim()),
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRecipe(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-xl font-bold text-xs"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl font-bold text-xs"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* НИЖНЕЕ МЕНЮ НАВИГАЦИИ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-lg border-t border-slate-700 z-40 px-2 py-2">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {[
            { id: 'scales', label: 'Шкалы', icon: Trophy },
            { id: 'calendar', label: 'Календарь', icon: CalendarIcon },
            { id: 'recipes', label: 'Рецепты', icon: Utensils },
            { id: 'workouts', label: 'Тренинг', icon: Dumbbell },
            { id: 'ai', label: 'ИИ Бот', icon: Bot },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                  isActive
                    ? 'text-pink-400 scale-105 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <IconComp />
                <span className="text-[10px] mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
