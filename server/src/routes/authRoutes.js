import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { loginRateLimiter } from '../middleware/rateLimitMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { loginSchema } from '../validators/authValidators.js';

const router = Router();

router.post('/login', loginRateLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
