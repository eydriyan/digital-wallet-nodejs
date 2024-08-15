import { Request, Response, NextFunction } from 'express';
import WalletService from '../services/wallet.service';
// import StripeService from '../services/stripe.service';
import validator from '../utils/validator';
import logger from '../utils/logger';

// Define a type for the request object with user property
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

// Initialize Stripe service based on request headers
// const initStripeService = (req: AuthenticatedRequest) => {
//   const stripeSecretKey = req.headers['stripe-secret-key'] as string;
//   return StripeService(stripeSecretKey);
// };

export const createWallet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error } = validator.validateWalletCreation(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { initialBalance } = req.body;
    const userId = req.user.id;

    // const stripeService = initStripeService(req);
    const result = await WalletService.createWallet(userId, req.user.email, initialBalance);
    res.status(201).json(result);
  } catch (error) {
    logger.error('Error creating wallet:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deposit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error } = validator.validateTransaction({ ...req.body, type: 'deposit' });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { amount, paymentMethodId } = req.body;
    const userId = req.user.id;

    // const stripeService = initStripeService(req);
    const result = await WalletService.deposit(userId, amount, paymentMethodId);
    res.json(result);
  } catch (error) {
    logger.error('Error depositing funds:', error);
    res.status(500).json({ error: error.message });
  }
};

export const transfer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error } = validator.validateTransaction({ ...req.body, type: 'transfer' });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { toUserId, amount } = req.body;
    const fromUserId = req.user.id;

    const result = await WalletService.transfer(fromUserId, toUserId, amount);
    res.json(result);
  } catch (error) {
    logger.error('Error transferring funds:', error);
    res.status(500).json({ error: error.message });
  }
};

export const withdraw = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error } = validator.validateTransaction({ ...req.body, type: 'withdraw' });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { amount, destinationAccount } = req.body;
    const userId = req.user.id;

    // const stripeService = initStripeService(req);
    const result = await WalletService.withdraw(userId, amount, destinationAccount);
    res.json(result);
  } catch (error) {
    logger.error('Error withdrawing funds:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getBalance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const result = await WalletService.getBalance(userId);
    res.json(result);
  } catch (error) {
    logger.error('Error getting balance:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const result = await WalletService.getTransactionHistory(userId);
    res.json(result);
  } catch (error) {
    logger.error('Error getting transaction history:', error);
    res.status(500).json({ error: error.message });
  }
};
