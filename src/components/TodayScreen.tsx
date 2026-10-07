import React, { useState, useEffect } from 'react';
import { DayRecord, UserProfile } from '../types';
import { LocalStorageDB } from '../db';
import { calculateDailyScore, getWeightProgress } from '../utils/calculator';

export const TodayScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(
    LocalStorageDB.getProfile()
  );
  const [record, setRecord] = useState<DayRecord | null>(null);
  const [inputText, setInputText] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    let currentRecord = LocalStorageDB.getDayRecord(todayStr);

    if (!currentRecord) {
      // Инициализация пустой записи за день
      currentRecord = {
        date: todayStr,
        updatedAt: new Date().toISOString(),
        weightKg: profile.currentWeightKg,
        nutrition: {
          calories: 650,
          proteinG: 34,
          fatsG: 32,
          carbsG: 60,
          fiberG: 12,
          waterMl: 1250,
          caffeineMg: 80,
          sweetsServings: 1,
          meals: [],
        },
        workout: {
          steps: 6420,
          activityCalories: 320,
          sessions: [],
        },
        sleep: {
          durationMinutes: 440, // 7ч 20мин
          awakeningsCount: 2,
          qualityPercentage: 82,
        },
        vitamins: [
          { id: '1', name: 'D3', dosage: '2000 UI', taken: true },
          { id: '2', name: 'Ω3', dosage: '1000 mg', taken: true },
          { id: '3', name: 'Mg+B6', dosage: '400 mg', taken: false },
        ],
        wellbeing: {
          moodEmoji: '🙂',
          energyLevel: 7,
          stressLevel: 3,
          note: 'Утром легко проснулась, днем была тренировка.',
        },
        care: {
          massagerDone: true,
          contrastShowerDone: false,
        },
        scores: {
          totalQuality: 0,
          nutritionScore: 0,
          workoutScore: 0,
          sleepScore: 0,
          vitaminsScore: 0,
        },
      };
    }

    const calculatedScores = calculateDailyScore(currentRecord, profile);
    currentRecord.scores = calculatedScores;

    setRecord(currentRecord);
    LocalStorageDB.saveDayRecord(currentRecord);
  }, [todayStr, profile]);

  if (!record) return null;

  const weightInfo = getWeightProgress(profile, record.weightKg);

  const handleVoiceOrTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // В будущем здесь вызов AI API
    alert(
      `Голосовой/текстовый ввод принят:\n"${inputText}"\nАссистент обрабатывает данные...`
    );
    setInputText('');
  };

  return (
    <div className="app-container">
      {/* 1. ВЕРХНЯЯ ШАПКА: Дата и Вес */}
      <div className="b-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              СЕГОДНЯ
            </div>
            <div className="b-title" style={{ fontSize: '20px' }}>
              {record.date}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>
              {weightInfo.current} <span style={{ fontSize: '14px' }}>кг</span>
            </div>
            <div
              style={{
                color: 'var(--accent-red)',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              −{weightInfo.lost} кг (осталось {weightInfo.remaining} кг)
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: '10px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          {weightInfo.start} кг ──► {weightInfo.target} кг
        </div>
      </div>

      {/* 2. ЕЖЕДНЕВНЫЙ РЕЙТИНГ */}
      <div
        className="b-card"
        style={{ borderLeft: '6px solid var(--accent-red)' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <span className="b-title" style={{ fontSize: '14px' }}>
            Качество дня
          </span>
          <span
            style={{
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'Space Grotesk',
            }}
          >
            {record.scores.totalQuality}%
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginTop: '12px',
            fontSize: '13px',
          }}
        >
          <div>
            Питание (40%): <strong>{record.scores.nutritionScore}%</strong>
          </div>
          <div>
            Тренировка (30%): <strong>{record.scores.workoutScore}%</strong>
          </div>
          <div>
            Сон (20%): <strong>{record.scores.sleepScore}%</strong>
          </div>
          <div>
            Витамины (10%): <strong>{record.scores.vitaminsScore}%</strong>
          </div>
        </div>
      </div>

      {/* 3. БЫСТРЫЙ ВВОД С АССИСТЕНТОМ */}
      <div className="b-card" style={{ backgroundColor: '#ffffff' }}>
        <div
          className="b-title"
          style={{ fontSize: '14px', marginBottom: '8px' }}
        >
          🎙️ Расскажи про свой день
        </div>
        <form onSubmit={handleVoiceOrTextSubmit}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="«Выпила кофе, съела омлет, прошла 6000 шагов...»"
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid var(--text-dark)',
              boxSizing: 'border-box',
              fontSize: '13px',
              marginBottom: '8px',
            }}
          />
          <button type="submit" className="b-button" style={{ width: '100%' }}>
            Записать в дневник
          </button>
        </form>
      </div>

      {/* 4. СВОДКА ПИТАНИЯ И АКТИВНОСТИ */}
      <div className="b-card">
        <div
          className="b-title"
          style={{ fontSize: '14px', marginBottom: '10px' }}
        >
          Сводка показателей
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span>🔥 Калории:</span>
          <strong>
            {record.nutrition.calories} / {profile.targets.calories} kcal
          </strong>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span>🥩 Белки:</span>
          <strong>
            {record.nutrition.proteinG} / {profile.targets.proteinG} г
          </strong>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span>👟 Шаги:</span>
          <strong>
            {record.workout.steps} / {profile.targets.steps}
          </strong>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span>💧 Вода:</span>
          <strong>
            {(record.nutrition.waterMl / 1000).toFixed(1)} /{' '}
            {(profile.targets.waterMl / 1000).toFixed(1)} л
          </strong>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-gray)',
          }}
        >
          <span>Витамины:</span>
          <div>
            {record.vitamins.map((v) => (
              <span
                key={v.id}
                style={{
                  marginLeft: '6px',
                  fontWeight: v.taken ? 'bold' : 'normal',
                  color: v.taken ? 'green' : 'gray',
                }}
              >
                {v.name} {v.taken ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
