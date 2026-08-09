import { Router } from 'express';
import { substituteFood } from '../controllers/aiController';

const router = Router();

// POST /api/ai/substitute-food
router.post('/substitute-food', substituteFood);

export default router;
