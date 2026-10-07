import { DayRecord, UserProfile } from '../types';

const DB_NAME = 'FitAssistantDB';
const DB_VERSION = 1;

export class LocalStorageDB {
  private static getKey(date: string) {
    return `fit_day_${date}`;
  }

  public static getDayRecord(date: string): DayRecord | null {
    const data = localStorage.getItem(this.getKey(date));
    return data ? JSON.parse(data) : null;
  }

  public static saveDayRecord(record: DayRecord): void {
    localStorage.setItem(this.getKey(record.date), JSON.stringify(record));
  }

  public static getProfile(): UserProfile {
    const profile = localStorage.getItem('fit_user_profile');
    if (profile) return JSON.parse(profile);

    // Default Profile для старта
    const defaultProfile: UserProfile = {
      id: 'default_user',
      name: 'Брат',
      age: 26,
      gender: 'female',
      heightCm: 168,
      startWeightKg: 65.0,
      currentWeightKg: 61.8,
      targetWeightKg: 52.0,
      startDate: '2026-09-01',
      activityLevel: 'moderate',
      targets: {
        calories: 1400,
        proteinG: 100,
        fatsG: 50,
        carbsG: 140,
        fiberG: 25,
        waterMl: 2000,
        steps: 10000,
        sleepMinutes: 480,
      },
    };
    this.saveProfile(defaultProfile);
    return defaultProfile;
  }

  public static saveProfile(profile: UserProfile): void {
    localStorage.setItem('fit_user_profile', JSON.stringify(profile));
  }
}
