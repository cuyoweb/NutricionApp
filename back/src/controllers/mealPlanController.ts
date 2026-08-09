import { Request, Response } from 'express';
import { MOCK_PATIENTS, FOOD_LIBRARY } from '../mocks/patientsData';
import { MealPlanDetail } from '../types';

/**
 * Controller: MealPlan
 * Manages active diets, meal plan creation, food library catalog, and nutritional macros.
 */

// GET /api/meal-plans/active/:patientId
export const getActiveMealPlan = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * const { patientId } = req.params;
   * 
   * const mealPlan = await prisma.mealPlan.findFirst({
   *   where: {
   *     patientId: patientId,
   *     isActive: true
   *   },
   *   include: {
   *     days: {
   *       include: {
   *         meals: {
   *           include: {
   *             items: {
   *               include: { food: true }
   *             }
   *           }
   *         }
   *       }
   *     }
   *   }
   * });
   * 
   * if (!mealPlan) {
   *   return res.status(404).json({ error: 'No hay plan nutricional activo para este paciente' });
   * }
   * 
   * return res.json(mealPlan);
   * =========================================================================
   */

  // MVP DEMO CODE:
  const { patientId } = req.params;
  const patient = MOCK_PATIENTS.find(p => p.id === patientId || p.userId === patientId);

  if (!patient) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  if (patient.activeMealPlan) {
    return res.json(patient.activeMealPlan);
  }

  // Si no tiene uno asignado específicamente en el mock, devolver el plan default de Sofía adaptado
  const defaultPlan = MOCK_PATIENTS[0].activeMealPlan;
  if (defaultPlan) {
    return res.json({
      ...defaultPlan,
      id: `plan-${patient.id}`,
      patientId: patient.id,
      title: `Plan Nutricional Personalizado - ${patient.fullName}`
    });
  }

  return res.status(404).json({ error: 'Plan nutricional no asignado aún' });
};

// POST /api/meal-plans
export const createOrUpdateMealPlan = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * const { patientId, title, caloriesTarget, proteinGrams, carbsGrams, fatsGrams, days, notes } = req.body;
   * 
   * // Transacción: Desactivar planes anteriores y crear el nuevo plan con sus días y comidas
   * const newPlan = await prisma.$transaction(async (tx) => {
   *   await tx.mealPlan.updateMany({
   *     where: { patientId, isActive: true },
   *     data: { isActive: false }
   *   });
   * 
   *   return tx.mealPlan.create({
   *     data: {
   *       patientId,
   *       title,
   *       caloriesTarget,
   *       proteinGrams,
   *       carbsGrams,
   *       fatsGrams,
   *       notes,
   *       isActive: true,
   *       days: {
   *         create: days.map((day: any) => ({
   *           dayOfWeek: day.dayOfWeek.toUpperCase(),
   *           meals: {
   *             create: day.meals.map((meal: any) => ({
   *               type: meal.type,
   *               title: meal.title,
   *               description: meal.description,
   *               items: {
   *                 create: meal.items.map((it: any) => ({
   *                   foodId: it.foodId,
   *                   quantityGrams: it.quantityGrams,
   *                   unit: it.unit || 'g'
   *                 }))
   *               }
   *             }))
   *           }
   *         }))
   *       }
   *     },
   *     include: {
   *       days: { include: { meals: { include: { items: true } } } }
   *     }
   *   });
   * });
   * 
   * return res.status(201).json(newPlan);
   * =========================================================================
   */

  // MVP DEMO CODE:
  try {
    const { patientId, title, caloriesTarget, proteinGrams, carbsGrams, fatsGrams, days, notes } = req.body;

    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const newMealPlan: MealPlanDetail = {
      id: `plan-${Date.now()}`,
      patientId,
      title: title || 'Nuevo Plan Nutricional Mendoza Fit',
      caloriesTarget: Number(caloriesTarget) || 2000,
      proteinGrams: Number(proteinGrams) || 140,
      carbsGrams: Number(carbsGrams) || 180,
      fatsGrams: Number(fatsGrams) || 55,
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      notes: notes || 'Plan asignado por la nutricionista.',
      days: days || (MOCK_PATIENTS[0].activeMealPlan?.days || [])
    };

    patient.activeMealPlan = newMealPlan;
    return res.status(201).json(newMealPlan);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al guardar plan nutricional', details: error.message });
  }
};

// GET /api/foods
export const getFoods = async (req: Request, res: Response) => {
  /*
   * =========================================================================
   * PRODUCTION CODE (When PostgreSQL & Prisma ORM are connected):
   * =========================================================================
   * 
   * const { category, search } = req.query;
   * const foods = await prisma.food.findMany({
   *   where: {
   *     ...(category ? { category: String(category).toUpperCase() as any } : {}),
   *     ...(search ? { name: { contains: String(search), mode: 'insensitive' } } : {})
   *   },
   *   orderBy: { name: 'asc' }
   * });
   * return res.json(foods);
   * =========================================================================
   */

  // MVP DEMO CODE:
  const { category, search } = req.query;
  let results = [...FOOD_LIBRARY];

  if (category) {
    results = results.filter(f => f.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(f => f.name.toLowerCase().includes(q));
  }

  return res.json(results);
};
