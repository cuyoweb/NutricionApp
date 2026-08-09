import { Patient, MealPlanDetail, FoodItem } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    cache: 'no-store',
    ...options
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: async (credentials: { email: string; password?: string; role?: string; patientId?: string }) => {
    return fetchFromApi<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Patients
  getPatients: async (search?: string, plan?: string): Promise<Patient[]> => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (plan && plan !== 'TODOS') params.set('plan', plan);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return fetchFromApi<Patient[]>(`/patients${queryStr}`);
  },

  getPatientById: async (id: string): Promise<Patient> => {
    return fetchFromApi<Patient>(`/patients/${id}`);
  },

  createPatient: async (data: Partial<Patient>): Promise<Patient> => {
    return fetchFromApi<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updatePatientMetrics: async (id: string, metrics: { weightKg?: number; bodyFatPercentage?: number; muscleMassPercentage?: number; waistCm?: number; notes?: string }): Promise<Patient> => {
    return fetchFromApi<Patient>(`/patients/${id}/metrics`, {
      method: 'PUT',
      body: JSON.stringify(metrics)
    });
  },

  // Meal Plans
  getActiveMealPlan: async (patientId: string): Promise<MealPlanDetail> => {
    return fetchFromApi<MealPlanDetail>(`/meal-plans/active/${patientId}`);
  },

  createOrUpdateMealPlan: async (planData: any): Promise<MealPlanDetail> => {
    return fetchFromApi<MealPlanDetail>('/meal-plans', {
      method: 'POST',
      body: JSON.stringify(planData)
    });
  },

  getFoods: async (category?: string, search?: string): Promise<FoodItem[]> => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return fetchFromApi<FoodItem[]>(`/meal-plans/foods${queryStr}`);
  },

  getTodayLog: async (patientId: string): Promise<any> => {
    return fetchFromApi<any>(`/meal-plans/today/${patientId}`);
  },

  updateDailyLog: async (patientId: string, completedMealIds: string[]): Promise<any> => {
    return fetchFromApi<any>(`/meal-plans/today/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify({ completedMealIds })
    });
  },

  logWater: async (patientId: string, delta: number): Promise<any> => {
    return fetchFromApi<any>(`/meal-plans/today/${patientId}/water`, {
      method: 'POST',
      body: JSON.stringify({ delta })
    });
  },

  substituteFood: async (data: any): Promise<any> => {
    return fetchFromApi<any>('/ai/substitute', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

export const mobileApi = api;
