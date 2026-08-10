import { Router } from 'express';
import { getActiveMealPlan, createOrUpdateMealPlan, getFoods } from '../controllers/mealPlanController';
import { getTodayLog, updateDailyLog, logWater } from '../controllers/dailyLogController';

const router = Router();

// GET /api/meal-plans/active/:patientId
router.get('/active/:patientId', getActiveMealPlan);

// POST /api/meal-plans
router.post('/', createOrUpdateMealPlan);

// GET /api/meal-plans/foods
router.get('/foods', getFoods);

// Compatibilidad con endpoints de registro diario
router.get('/today/:patientId', getTodayLog);
router.put('/today/:patientId', (req, res) => {
  req.body.patientId = req.params.patientId;
  return updateDailyLog(req, res);
});
router.post('/today/:patientId/water', (req, res) => {
  req.body.patientId = req.params.patientId;
  return logWater(req, res);
});

export default router;
