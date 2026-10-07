import { ParsedVoiceInput } from '../types/assistant';

// Системный промпт для подключенного LLM API (OpenAI GPT-4o / Claude)
export const ASSISTANT_SYSTEM_PROMPT = `
Ты — персональный спортивный ассистент и тренер ("Брат"). 
Твоя задача — извлечь факты из естественной речи пользователя и вернуть JSON строго по схеме.

Правила:
1. Если указана еда: оцени калории, БЖУ и клетчатку. Если вес не указан точно, помечай isApproximate: true.
2. Не стыди за еду, не предлагай отрабатывать калории.
3. Различай обычную ходьбу/бытовую активность от полноценных тренировок.
4. Отдельно извлекай воду (мл), кофеин (мг), сон (минуты), шаги, витамины и настроение.

Формат ответа JSON:
{
  "summary": "Краткая прямолинейная сводка на понятном языке",
  "confidence": "high" | "medium" | "low",
  "extractedData": {
    "meals": [{"name": "...", "calories": 350, "proteinG": 15, "fatsG": 10, "carbsG": 40, "fiberG": 3, "isApproximate": true}],
    "waterMl": 250,
    "caffeineMg": 80,
    "steps": 4000,
    "workoutSession": {"type": "Прогулка", "category": "other", "isStructuredWorkout": false, "durationMinutes": 40, "estimatedCaloriesBurned": 120},
    "sleepMinutes": 420,
    "moodEmoji": "🙂",
    "note": "..."
  }
}
`;

/**
 * Локальный гибридный парсер (Офлайн-режим на регулярках + эвристиках)
 * Позволяет приложению полностью работать даже без ключа API!
 */
export async function parseUserInput(
  text: string,
  apiKey?: string
): Promise<ParsedVoiceInput> {
  const cleanText = text.toLowerCase().trim();

  // Если передан API key, отправляем запрос в LLM API (структурированный вызов)
  if (apiKey) {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: ASSISTANT_SYSTEM_PROMPT },
              { role: 'user', content: text },
            ],
          }),
        }
      );
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.warn(
        'API call failed, falling back to local heuristic parser',
        e
      );
    }
  }

  // --- Офлайн Эвристический Парсер (Fallback Engine) ---
  const extracted: ParsedVoiceInput['extractedData'] = {};
  const detectedItems: string[] = [];

  // 1. Кофеин / Кофе
  if (
    cleanText.includes('кофе') ||
    cleanText.includes('латте') ||
    cleanText.includes('капучино') ||
    cleanText.includes('эспрессо')
  ) {
    extracted.caffeineMg = cleanText.includes('двойной') ? 160 : 80;
    detectedItems.push(`Кофеин ≈ ${extracted.caffeineMg} мг`);
  }

  // 2. Вода
  const waterMatch = cleanText.match(/(\d+)\ (мл|литр|л|стакан)/);
  if (waterMatch) {
    let ml = parseInt(waterMatch[1], 10);
    if (waterMatch[2].startsWith('л')) ml *= 1000;
    if (waterMatch[2] === 'стакан') ml = 250;
    extracted.waterMl = ml;
    detectedItems.push(`Вода: ${ml} мл`);
  } else if (
    cleanText.includes('стакан воды') ||
    cleanText.includes('выпила воду')
  ) {
    extracted.waterMl = 250;
    detectedItems.push('Вода: 250 мл');
  }

  // 3. Шаги & Прогулка
  const stepsMatch = cleanText.match(/(\d+[\s\d]*)\ (шаг|шагов)/);
  if (stepsMatch) {
    const stepsCount = parseInt(stepsMatch[1].replace(/\s/g, ''), 10);
    extracted.steps = stepsCount;
    detectedItems.push(`Шаги: ${stepsCount}`);
  }

  const walkMatch = cleanText.match(
    /(\d+)\ (минут|мин).*(гулял|погулял|прогулка|ходьба)/
  );
  if (walkMatch) {
    const mins = parseInt(walkMatch[1], 10);
    extracted.workoutSession = {
      type: 'Прогулка',
      category: 'other',
      isStructuredWorkout: false,
      durationMinutes: mins,
      estimatedCaloriesBurned: mins * 3.5,
    };
    detectedItems.push(`Бытовая активность: Прогулка ${mins} мин`);
  }

  // 4. Сон
  const sleepMatch = cleanText.match(
    /спал[а]?\ (несколько|\d+)\ (час|часов|ч)/
  );
  if (sleepMatch) {
    const hours = parseInt(sleepMatch[1], 10) || 7;
    extracted.sleepMinutes = hours * 60;
    detectedItems.push(`Сон: ${hours} ч`);
  }

  // 5. Популярная еда (демо-база)
  const mealsList = [];
  if (cleanText.includes('омлет')) {
    mealsList.push({
      name: 'Омлет',
      calories: 250,
      proteinG: 18,
      fatsG: 16,
      carbsG: 2,
      fiberG: 0,
      isApproximate: true,
    });
  }
  if (cleanText.includes('творог')) {
    mealsList.push({
      name: 'Творог',
      calories: 160,
      proteinG: 24,
      fatsG: 5,
      carbsG: 4,
      fiberG: 0,
      isApproximate: true,
    });
  }
  if (cleanText.includes('торт') || cleanText.includes('пирожное')) {
    mealsList.push({
      name: 'Торт / Десерт',
      calories: 380,
      proteinG: 4,
      fatsG: 18,
      carbsG: 48,
      fiberG: 1,
      isApproximate: true,
    });
  }
  if (cleanText.includes('овсяноблин')) {
    mealsList.push({
      name: 'Овсяноблин',
      calories: 280,
      proteinG: 14,
      fatsG: 8,
      carbsG: 32,
      fiberG: 4,
      isApproximate: true,
    });
  }

  if (mealsList.length > 0) {
    extracted.meals = mealsList;
    detectedItems.push(
      `Приёмы пищи: ${mealsList.map((m) => m.name).join(', ')}`
    );
  }

  const summary =
    detectedItems.length > 0
      ? `Брат, вот что я извлёк из твоих слов:\n• ${detectedItems.join('\n• ')}`
      : `Брат, текст записан в заметки, но конкретных цифр еды/активности я не распознал.`;

  return {
    rawText: text,
    summary,
    confidence: detectedItems.length > 0 ? 'high' : 'low',
    extractedData: extracted,
  };
}
