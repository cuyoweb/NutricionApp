import { Router } from 'express';
import { getTodayLog, updateDailyLog, logWater } from '../controllers/dailyLogController';

const router = Router();

// GET /api/daily-logs/today/:patientId
router.get('/today/:patientId', getTodayLog);

// POST /api/daily-logs
router.post('/', updateDailyLog);

// POST /api/daily-logs/water
router.post('/water', logWater);

export default router;
