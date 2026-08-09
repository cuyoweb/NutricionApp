import { z } from 'zod';

export type PlanTier = 'FREE' | 'INICIAL' | 'PRO' | 'PREMIUM';
export type UserRole = 'NUTRITIONIST' | 'PATIENT' | 'ADMIN';
export type FoodCategory = 
  | 'Verdulería'
  | 'Carnicería'
  | 'Almacén'
  | 'Refrigerados'
  | 'Legumbres y Cereales'
  | 'Frutas'
  | 'Frutos Secos y Semillas';

export interface AnthropometricPoint {
  date: string;
  weightKg: number;
  bodyFatPercentage?: number;
  muscleMassPercentage?: number;
  waistCm?: number;
  hipCm?: number;
  notes?: string;
}

export interface MealItemDetail {
  id: string;
  foodName: string;
  quantityGrams: number;
  unit: string;
  category: FoodCategory;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface MealSlotDetail {
  id: string;
  type: 'DESAYUNO' | 'MEDIA_MANANA' | 'ALMUERZO' | 'MERIENDA' | 'CENA' | 'COLACION';
  title: string;
  timeHint?: string;
  description: string;
  items: MealItemDetail[];
}

export interface DayPlanDetail {
  dayOfWeek: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  meals: MealSlotDetail[];
}

export interface MealPlanDetail {
  id: string;
  patientId: string;
  title: string;
  caloriesTarget: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  isActive: boolean;
  startDate: string;
  notes: string;
  days: DayPlanDetail[];
}

export interface GroceryItem {
  id: string;
  name: string;
  totalQuantity: string;
  category: 'Verdulería' | 'Almacén' | 'Carnicería' | 'Refrigerados';
  checked: boolean;
  recipesHint?: string;
}

export interface DailyLogState {
  patientId: string;
  date: string;
  waterGlasses: number;
  waterTargetGlasses: number;
  completedMealIds: string[];
  adherencePercentage: number;
  notes?: string;
}

export interface Patient {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  locality: string; // Mendoza locality (Godoy Cruz, Ciudad, Maipú, Luján, Guaymallén)
  plan: PlanTier;
  planPriceArs: number;
  avatarUrl: string;
  gender: 'FEMALE' | 'MALE' | 'OTHER';
  age: number;
  heightCm: number;
  initialWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  bodyFatPercentage: number;
  muscleMassPercentage: number;
  bmi: number;
  streakDays: number;
  adherenceRate: number; // 0 - 100%
  clinicalNotes: string;
  createdAt: string;
  lastConsultationDate: string;
  anthropometricHistory: AnthropometricPoint[];
  activeMealPlan?: MealPlanDetail;
  todayLog?: DailyLogState;
}

// Zod Validation Schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  role: z.enum(['NUTRITIONIST', 'PATIENT']).optional()
});

export const CreatePatientSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  locality: z.string().min(2),
  plan: z.enum(['FREE', 'INICIAL', 'PRO', 'PREMIUM']),
  gender: z.enum(['FEMALE', 'MALE', 'OTHER']),
  age: z.number().positive(),
  heightCm: z.number().positive(),
  initialWeightKg: z.number().positive(),
  currentWeightKg: z.number().positive(),
  targetWeightKg: z.number().positive(),
  bodyFatPercentage: z.number().optional(),
  muscleMassPercentage: z.number().optional(),
  clinicalNotes: z.string().optional()
});

export const UpdateDailyLogSchema = z.object({
  patientId: z.string(),
  date: z.string(),
  waterGlasses: z.number().min(0).max(20).optional(),
  completedMealIds: z.array(z.string()).optional(),
  notes: z.string().optional()
});

export const SubstituteFoodSchema = z.object({
  originalFood: z.string().min(2),
  originalGrams: z.number().positive(),
  targetFood: z.string().optional(),
  category: z.string().optional()
});
