import { Router } from 'express';
import authRoutes from './authRoutes';
import patientRoutes from './patientRoutes';
import mealPlanRoutes from './mealPlanRoutes';
import dailyLogRoutes from './dailyLogRoutes';
import aiRoutes from './aiRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/meal-plans', mealPlanRoutes);
router.use('/daily-logs', dailyLogRoutes);
router.use('/ai', aiRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NutricionApp API (Mendoza REST Server)',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
