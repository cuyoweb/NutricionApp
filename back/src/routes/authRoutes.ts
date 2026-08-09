import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/authController';

const router = Router();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', getCurrentUser);

export default router;
