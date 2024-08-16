import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
// import walletRoutes from './wallet.routes';
// import stripeRoutes from './stripe.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
// router.use('/wallet', walletRoutes);
// router.use('/stripe', stripeRoutes);

export default router;