export type PlanTier = 'FREE' | 'INICIAL' | 'PRO' | 'PREMIUM';

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
  category: string;
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
  dayOfWeek: string;
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
  locality: string;
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
  adherenceRate: number;
  clinicalNotes: string;
  createdAt: string;
  lastConsultationDate: string;
  anthropometricHistory: AnthropometricPoint[];
  activeMealPlan?: MealPlanDetail;
  todayLog?: DailyLogState;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  portionStandard?: string;
}
