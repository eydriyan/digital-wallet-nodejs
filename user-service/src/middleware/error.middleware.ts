import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';
import logger from '../utils/logger';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
  logger.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError' && 'errors' in err) {
    const errors = Object.values((err as Error.ValidationError).errors).map(error => error.message);
    return res.status(400).json({ error: errors });
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(400).json({ error: `${field} already exists.` });
  }

  // JWT authentication error
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Default to 500 server error
  return res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;
