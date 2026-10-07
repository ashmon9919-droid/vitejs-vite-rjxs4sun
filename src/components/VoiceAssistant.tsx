import React, { useState } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { parseUserInput } from '../services/nlpParser';
import { ParsedVoiceInput } from '../types/assistant';
import { DayRecord } from '../types';

interface VoiceAssistantProps {
  currentRecord: DayRecord;
  onApplyUpdate: (updatedRecord: DayRecord) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  currentRecord,
  onApplyUpdate,
}) => {
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition();

  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedVoiceInput | null>(
    null
  );

  const handleProcessText = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;
    setIsProcessing(true);

    // Запускаем NLP парсинг
    const result = await parseUserInput(textToProcess);
    setParsedResult(result);
    setIsProcessing(false);
  };

  const handleConfirmAndSave = () => {
    if (!parsedResult) return;

    const data = parsedResult.extractedData;
    const updated: DayRecord = {
      ...currentRecord,
      updatedAt: new Date().toISOString(),
    };

    // 1. Еда
    if (data.meals && data.meals.length > 0) {
      data.meals.forEach((m) => {
        const fullMeal = {
          id: String(Date.now() + Math.random()),
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          name: m.name || 'Приём пищи',
          calories: m.calories || 0,
          proteinG: m.proteinG || 0,
          fatsG: m.fatsG || 0,
          carbsG: m.carbsG || 0,
          fiberG: m.fiberG || 0,
          isApproximate: m.isApproximate ?? true,
          source: 'voice' as const,
        };
        updated.nutrition.meals.push(fullMeal);
        updated.nutrition.calories += fullMeal.calories;
        updated.nutrition.proteinG += fullMeal.proteinG;
        updated.nutrition.fatsG += fullMeal.fatsG;
        updated.nutrition.carbsG += fullMeal.carbsG;
        updated.nutrition.fiberG += fullMeal.fiberG;
      });
    }

    // 2. Вода
    if (data.waterMl) {
      updated.nutrition.waterMl += data.waterMl;
    }

    // 3. Кофеин
    if (data.caffeineMg) {
      updated.nutrition.caffeineMg += data.caffeineMg;
    }

    // 4. Шаги
    if (data.steps) {
      updated.workout.steps += data.steps;
    }

    // 5. Сон
    if (data.sleepMinutes) {
      updated.sleep.durationMinutes = data.sleepMinutes;
    }

    // 6. Заметка
    if (parsedResult.rawText) {
      updated.wellbeing.note = updated.wellbeing.note
        ? `${updated.wellbeing.note} | ${parsedResult.rawText}`
        : parsedResult.rawText;
    }

    // Применяем обновленный день
    onApplyUpdate(updated);

    // Сброс
    setParsedResult(null);
    setTextInput('');
    resetTranscript();
  };

  return (
    <div className="b-card" style={{ backgroundColor: '#ffffff' }}>
      <div
        className="b-title"
        style={{ fontSize: '15px', marginBottom: '12px' }}
      >
        🎙️ Голосовой ассистент
      </div>

      {/* Кнопка записи микрофона */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className="b-button"
          style={{
            backgroundColor: isListening ? '#E52323' : '#111111',
            borderRadius: '50%',
            width: '54px',
            height: '54px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: isListening
              ? '0 0 12px #E52323'
              : '3px 3px 0px 0px #111111',
          }}
          disabled={!isSupported}
        >
          {isListening ? '⏹️' : '🎙️'}
        </button>

        <div style={{ flex: 1, fontSize: '13px', color: 'var(--text-muted)' }}>
          {isListening ? (
            <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
              Слушаю... Говори свободно!
            </span>
          ) : (
            'Нажми микрофон или введи текст ниже'
          )}
        </div>
      </div>

      {/* Текстовое поле */}
      <textarea
        value={isListening ? transcript : textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Например: «Утром выпила латте, съела омлет и погуляла 40 минут»"
        rows={3}
        style={{
          width: '100%',
          padding: '10px',
          border: '2px solid var(--text-dark)',
          boxSizing: 'border-box',
          fontSize: '13px',
          fontFamily: 'inherit',
          resize: 'none',
        }}
      />

      <button
        onClick={() => handleProcessText(isListening ? transcript : textInput)}
        className="b-button"
        style={{ width: '100%', marginTop: '8px' }}
        disabled={isProcessing || (!textInput && !transcript)}
      >
        {isProcessing ? 'Анализирую...' : 'Разобрать запись'}
      </button>

      {/* Модальное окно / карточка подтверждения результатов */}
      {parsedResult && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            border: '2px solid var(--text-dark)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <div
            className="b-title"
            style={{ fontSize: '13px', color: 'var(--accent-red)' }}
          >
            Проверь, всё верно?
          </div>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontSize: '12px',
              fontFamily: 'inherit',
              margin: '8px 0',
            }}
          >
            {parsedResult.summary}
          </pre>

          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button
              onClick={handleConfirmAndSave}
              className="b-button"
              style={{ flex: 1, backgroundColor: '#111111' }}
            >
              Записать в дневник ✓
            </button>
            <button
              onClick={() => setParsedResult(null)}
              style={{
                background: 'none',
                border: '2px solid var(--text-dark)',
                padding: '8px 12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
