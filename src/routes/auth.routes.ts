import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import authenticateJWT from '../middleware/auth.middleware';
import checkTokenBlacklist from '../middleware/tokenBlacklist.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateJWT, logout);

export default router;
