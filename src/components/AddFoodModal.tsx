import React, { useState } from 'react';
import { FoodItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (food: Omit<FoodItem, 'id' | 'time'>) => void;
}

export const AddFoodModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [mealType, setMealType] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snack'
  >('lunch');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !kcal) return;

    onAdd({
      name,
      kcal: Number(kcal),
      protein: Number(protein) || 0,
      fat: Number(fat) || 0,
      carbs: Number(carbs) || 0,
      mealType,
    });

    setName('');
    setKcal('');
    setProtein('');
    setFat('');
    setCarbs('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFF',
          padding: '18px',
          width: '100%',
          maxWidth: '380px',
          border: '2px solid #111',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900 }}>
            🥗 Добавить блюдо
          </h3>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              fontWeight: 900,
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <div>
            <label style={labelStyle}>Приём пищи:</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as any)}
              style={inputStyle}
            >
              <option value="breakfast">🌅 Завтрак</option>
              <option value="lunch">☀️ Обед</option>
              <option value="dinner">🌙 Ужин</option>
              <option value="snack">🍎 Перекус</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Название блюда:</label>
            <input
              type="text"
              placeholder="Овсянка с медом"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Калории (ккал):</label>
            <input
              type="number"
              placeholder="250"
              value={kcal}
              onChange={(e) => setKcal(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '6px',
            }}
          >
            <div>
              <label style={labelStyle}>Белки (г):</label>
              <input
                type="number"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Жиры (г):</label>
              <input
                type="number"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Углеводы (г):</label>
              <input
                type="number"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '12px',
              backgroundColor: '#E52323',
              color: '#FFF',
              border: 'none',
              fontWeight: 900,
              marginTop: '8px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Сохранить блюдо
          </button>
        </form>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  fontWeight: 900,
  textTransform: 'uppercase',
  color: '#555',
  marginBottom: '3px',
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  border: '1px solid #111',
  fontSize: '12px',
  color: '#000',
  boxSizing: 'border-box',
};
