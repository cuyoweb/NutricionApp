import { Router } from 'express';
import { substituteFood } from '../controllers/aiController';

const router = Router();

// POST /api/ai/substitute-food & /api/ai/substitute
router.post('/substitute-food', substituteFood);
router.post('/substitute', substituteFood);

export default router;
