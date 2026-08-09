import { Router } from 'express';
import { getActiveMealPlan, createOrUpdateMealPlan, getFoods } from '../controllers/mealPlanController';

const router = Router();

// GET /api/meal-plans/active/:patientId
router.get('/active/:patientId', getActiveMealPlan);

// POST /api/meal-plans
router.post('/', createOrUpdateMealPlan);

// GET /api/meal-plans/foods
router.get('/foods', getFoods);

export default router;
