import { Patient, MealPlanDetail, FoodItem, FoodSubstitutionResponse } from '../types';
import { getLocalPatients, saveLocalPatients, FOOD_LIBRARY, FOOD_SUBSTITUTIONS_DB } from './mockData';

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
    try {
      return await fetchFromApi<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    } catch (err) {
      console.warn('[NutriAPI] Backend no disponible, usando autenticación offline/mock');
      const isNutri = credentials.role === 'NUTRITIONIST' || credentials.email.includes('valentina');
      return {
        token: isNutri ? 'mock-jwt-nutritionist-mendoza-2026' : `mock-jwt-patient-${credentials.patientId || 'pat-001'}`,
        user: isNutri
          ? {
              id: 'usr-nutri-01',
              fullName: 'Lic. Valentina Rossi',
              email: 'lic.rossi@nutricionmendoza.com.ar',
              role: 'NUTRITIONIST',
              licenseNumber: 'M.P. 1842 - Mendoza'
            }
          : {
              id: credentials.patientId || 'pat-001',
              email: credentials.email,
              role: 'PATIENT'
            }
      };
    }
  },

  // Patients
  getPatients: async (search?: string, plan?: string): Promise<Patient[]> => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (plan && plan !== 'TODOS') params.set('plan', plan);
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return await fetchFromApi<Patient[]>(`/patients${queryStr}`);
    } catch (err) {
      console.warn('[NutriAPI] Backend no disponible en localhost:4000, usando 10 pacientes locales de Mendoza');
      let list = getLocalPatients();
      if (plan && plan !== 'TODOS') {
        list = list.filter(p => p.plan === plan);
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(p =>
          p.fullName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.phone.toLowerCase().includes(q)
        );
      }
      return list;
    }
  },

  getPatientById: async (id: string): Promise<Patient> => {
    try {
      return await fetchFromApi<Patient>(`/patients/${id}`);
    } catch (err) {
      console.warn(`[NutriAPI] Backend no disponible, buscando paciente ${id} en memoria`);
      const list = getLocalPatients();
      const p = list.find(item => item.id === id || item.userId === id);
      if (p) return p;
      return list[0];
    }
  },

  createPatient: async (data: Partial<Patient>): Promise<Patient> => {
    try {
      return await fetchFromApi<Patient>('/patients', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn('[NutriAPI] Backend offline, guardando paciente en almacenamiento local');
      const list = getLocalPatients();
      const newId = `pat-${String(list.length + 1).padStart(3, '0')}`;
      const newPatient: Patient = {
        id: newId,
        userId: `usr-${String(list.length + 1).padStart(3, '0')}`,
        fullName: data.fullName || 'Nuevo Paciente',
        email: data.email || `paciente${list.length + 1}@mendoza.com`,
        phone: data.phone || '+54 9 261 000-0000',
        locality: data.locality || 'Godoy Cruz, Mendoza',
        plan: data.plan || 'PRO',
        planPriceArs: data.plan === 'PREMIUM' ? 12000 : data.plan === 'PRO' ? 10000 : data.plan === 'INICIAL' ? 6000 : 0,
        avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        gender: data.gender || 'FEMALE',
        age: data.age || 30,
        heightCm: data.heightCm || 165,
        initialWeightKg: data.initialWeightKg || data.currentWeightKg || 70,
        currentWeightKg: data.currentWeightKg || 70,
        targetWeightKg: data.targetWeightKg || 65,
        bodyFatPercentage: data.bodyFatPercentage || 24,
        muscleMassPercentage: data.muscleMassPercentage || 32,
        bmi: Number((((data.currentWeightKg || 70) / Math.pow((data.heightCm || 165) / 100, 2))).toFixed(1)),
        streakDays: 1,
        adherenceRate: 100,
        clinicalNotes: data.clinicalNotes || 'Consulta inicial registrada.',
        createdAt: new Date().toISOString(),
        lastConsultationDate: new Date().toISOString().split('T')[0],
        anthropometricHistory: [
          {
            date: new Date().toISOString().split('T')[0],
            weightKg: data.currentWeightKg || 70,
            bodyFatPercentage: data.bodyFatPercentage || 24,
            muscleMassPercentage: data.muscleMassPercentage || 32,
            waistCm: 80,
            notes: 'Primera consulta'
          }
        ]
      };
      const updatedList = [newPatient, ...list];
      saveLocalPatients(updatedList);
      return newPatient;
    }
  },

  updatePatientMetrics: async (id: string, metrics: { weightKg?: number; bodyFatPercentage?: number; muscleMassPercentage?: number; waistCm?: number; notes?: string }): Promise<Patient> => {
    try {
      return await fetchFromApi<Patient>(`/patients/${id}/metrics`, {
        method: 'PUT',
        body: JSON.stringify(metrics)
      });
    } catch (err) {
      console.warn(`[NutriAPI] Backend offline, actualizando métricas de ${id} localmente`);
      const list = getLocalPatients();
      const patient = list.find(p => p.id === id || p.userId === id);
      if (patient) {
        if (metrics.weightKg) {
          patient.currentWeightKg = metrics.weightKg;
          if (patient.heightCm) {
            patient.bmi = Number((metrics.weightKg / Math.pow(patient.heightCm / 100, 2)).toFixed(1));
          }
        }
        if (metrics.bodyFatPercentage) patient.bodyFatPercentage = metrics.bodyFatPercentage;
        if (metrics.muscleMassPercentage) patient.muscleMassPercentage = metrics.muscleMassPercentage;
        patient.lastConsultationDate = new Date().toISOString().split('T')[0];

        const newPoint = {
          date: new Date().toISOString().split('T')[0],
          weightKg: metrics.weightKg || patient.currentWeightKg,
          bodyFatPercentage: metrics.bodyFatPercentage || patient.bodyFatPercentage,
          muscleMassPercentage: metrics.muscleMassPercentage || patient.muscleMassPercentage,
          waistCm: metrics.waistCm || 75,
          notes: metrics.notes || 'Control mensual'
        };
        patient.anthropometricHistory = [...(patient.anthropometricHistory || []), newPoint];
        saveLocalPatients(list);
        return patient;
      }
      throw new Error('Paciente no encontrado');
    }
  },

  // Meal Plans
  getActiveMealPlan: async (patientId: string): Promise<MealPlanDetail> => {
    try {
      return await fetchFromApi<MealPlanDetail>(`/meal-plans/active/${patientId}`);
    } catch (err) {
      console.warn(`[NutriAPI] Backend offline, usando plan alimentario en memoria para ${patientId}`);
      const list = getLocalPatients();
      const patient = list.find(p => p.id === patientId || p.userId === patientId);
      if (patient && patient.activeMealPlan) return patient.activeMealPlan;
      return list[0].activeMealPlan!;
    }
  },

  createOrUpdateMealPlan: async (planData: any): Promise<MealPlanDetail> => {
    try {
      return await fetchFromApi<MealPlanDetail>('/meal-plans', {
        method: 'POST',
        body: JSON.stringify(planData)
      });
    } catch (err) {
      console.warn('[NutriAPI] Backend offline, guardando plan alimentario localmente');
      const list = getLocalPatients();
      const patient = list.find(p => p.id === planData.patientId || p.userId === planData.patientId);
      const plan: MealPlanDetail = {
        id: `plan-${Date.now()}`,
        patientId: planData.patientId,
        title: planData.title || 'Plan Nutricional Personalizado',
        caloriesTarget: planData.caloriesTarget || 2000,
        proteinGrams: planData.proteinGrams || 120,
        carbsGrams: planData.carbsGrams || 200,
        fatsGrams: planData.fatsGrams || 60,
        isActive: true,
        startDate: new Date().toISOString().split('T')[0],
        notes: planData.notes || '',
        days: planData.days || []
      };
      if (patient) {
        patient.activeMealPlan = plan;
        saveLocalPatients(list);
      }
      return plan;
    }
  },

  getFoods: async (category?: string, search?: string): Promise<FoodItem[]> => {
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return await fetchFromApi<FoodItem[]>(`/meal-plans/foods${queryStr}`);
    } catch (err) {
      let foods = [...FOOD_LIBRARY];
      if (category && category !== 'TODOS') {
        foods = foods.filter(f => f.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        foods = foods.filter(f => f.name.toLowerCase().includes(q));
      }
      return foods;
    }
  },

  getTodayLog: async (patientId: string): Promise<any> => {
    try {
      return await fetchFromApi<any>(`/daily-logs/today/${patientId}`);
    } catch (err) {
      const list = getLocalPatients();
      const patient = list.find(p => p.id === patientId || p.userId === patientId);
      if (patient && patient.todayLog) return patient.todayLog;
      return {
        patientId,
        date: new Date().toISOString().split('T')[0],
        waterGlasses: 4,
        waterTargetGlasses: 8,
        completedMealIds: ['desayuno-lun', 'almuerzo-lun'],
        adherencePercentage: 75,
        notes: 'Seguimiento diario activo'
      };
    }
  },

  updateDailyLog: async (patientId: string, completedMealIds: string[]): Promise<any> => {
    try {
      return await fetchFromApi<any>('/daily-logs', {
        method: 'POST',
        body: JSON.stringify({ patientId, completedMealIds })
      });
    } catch (err) {
      const list = getLocalPatients();
      const patient = list.find(p => p.id === patientId || p.userId === patientId);
      const score = Math.min(100, Math.round((completedMealIds.length / 4) * 100));
      const log = {
        patientId,
        date: new Date().toISOString().split('T')[0],
        waterGlasses: patient?.todayLog?.waterGlasses || 4,
        waterTargetGlasses: 8,
        completedMealIds,
        adherencePercentage: score,
        notes: 'Actualizado desde la app'
      };
      if (patient) {
        patient.todayLog = log;
        patient.adherenceRate = Math.round(((patient.adherenceRate || 80) + score) / 2);
        saveLocalPatients(list);
      }
      return log;
    }
  },

  logWater: async (patientId: string, delta: number): Promise<any> => {
    try {
      return await fetchFromApi<any>('/daily-logs/water', {
        method: 'POST',
        body: JSON.stringify({ patientId, delta })
      });
    } catch (err) {
      const list = getLocalPatients();
      const patient = list.find(p => p.id === patientId || p.userId === patientId);
      const current = patient?.todayLog?.waterGlasses || 4;
      const nextGlasses = Math.max(0, current + delta);
      const log = {
        patientId,
        date: new Date().toISOString().split('T')[0],
        waterGlasses: nextGlasses,
        waterTargetGlasses: 8,
        completedMealIds: patient?.todayLog?.completedMealIds || ['desayuno-lun'],
        adherencePercentage: patient?.todayLog?.adherencePercentage || 75,
        notes: 'Hidratación registrada'
      };
      if (patient) {
        patient.todayLog = log;
        saveLocalPatients(list);
      }
      return log;
    }
  },

  substituteFood: async (data: { originalFood: string; originalGrams: number; substituteFood?: string; targetFood?: string }): Promise<FoodSubstitutionResponse> => {
    try {
      return await fetchFromApi<FoodSubstitutionResponse>('/ai/substitute', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      const targetQuery = data.substituteFood || data.targetFood;
      const match = FOOD_SUBSTITUTIONS_DB.find(s =>
        s.original.toLowerCase().includes(data.originalFood.toLowerCase()) &&
        (!targetQuery || s.substitute.toLowerCase().includes(targetQuery.toLowerCase()))
      );
      const ratio = match ? match.ratio : 1.0;
      const substituteGrams = Math.round(data.originalGrams * ratio);
      const chosenSubstitute = match ? match.substitute : (targetQuery || 'Filete de Merluza Fresca');
      return {
        originalFood: data.originalFood,
        originalGrams: data.originalGrams,
        substituteFood: chosenSubstitute,
        substituteGrams,
        explanation: match ? match.reason : `Sustitución calculada para mantener el balance calórico y proteico óptimo.`,
        cookingTip: 'Preparar preferentemente al vapor, a la plancha o al horno con hierbas frescas para preservar micronutrientes.'
      };
    }
  }
};

export const mobileApi = api;

