import React, { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export const EditProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value) || value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
          maxWidth: '390px',
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
            ⚙️ Настройки и Цели
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
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxHeight: '75vh',
            overflowY: 'auto',
          }}
        >
          <label style={labelStyle}>
            {' '}
            Имя:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            <label style={labelStyle}>
              {' '}
              Текущий вес (кг):
              <input
                type="number"
                step="0.1"
                name="currentWeightKg"
                value={formData.currentWeightKg}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              {' '}
              Целевой вес (кг):
              <input
                type="number"
                step="0.1"
                name="targetWeightKg"
                value={formData.targetWeightKg}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            <label style={labelStyle}>
              {' '}
              Начальный вес (кг):
              <input
                type="number"
                step="0.1"
                name="startWeightKg"
                value={formData.startWeightKg}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              {' '}
              Цель шагов:
              <input
                type="number"
                name="targetSteps"
                value={formData.targetSteps}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
          </div>

          <label style={labelStyle}>
            {' '}
            Суточная норма (ккал):
            <input
              type="number"
              name="targetKcal"
              value={formData.targetKcal}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '6px',
            }}
          >
            <label style={labelStyle}>
              {' '}
              Белки (г):
              <input
                type="number"
                name="targetProtein"
                value={formData.targetProtein}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              {' '}
              Жиры (г):
              <input
                type="number"
                name="targetFat"
                value={formData.targetFat}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              {' '}
              Углеводы (г):
              <input
                type="number"
                name="targetCarbs"
                value={formData.targetCarbs}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            <label style={labelStyle}>
              {' '}
              Вода (Литрах):
              <input
                type="number"
                step="0.1"
                name="targetWaterL"
                value={formData.targetWaterL}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              {' '}
              Лимит кофеина (мг):
              <input
                type="number"
                name="caffeineLimitMg"
                value={formData.caffeineLimitMg}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
          </div>

          <button
            type="submit"
            style={{
              padding: '12px',
              backgroundColor: '#E52323',
              color: '#FFF',
              border: 'none',
              fontWeight: 900,
              fontSize: '12px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Сохранить профиль
          </button>
        </form>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: '10px',
  fontWeight: 900,
  textTransform: 'uppercase',
  color: '#555',
};
const inputStyle: React.CSSProperties = {
  padding: '8px',
  border: '1px solid #111',
  fontSize: '12px',
  marginTop: '3px',
  color: '#000',
  boxSizing: 'border-box',
};
