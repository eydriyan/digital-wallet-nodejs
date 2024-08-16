import { Request, Response } from 'express';
import User from '../models/user.model';
import Token from '../models/token.model';
import jwt from 'jsonwebtoken';
import validator from '../utils/validator';
import logger from '../utils/logger';
import config from '../config/config';

// Define the types for request bodies
interface RegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// Register User
export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  try {
    const { error } = validator.validateUser(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { email, password, firstName, lastName } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    user = new User({ email, password, firstName, lastName });
    await user.save();

    res.status(201).json({
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (error) {
    logger.error('Error in user registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login User
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  try {
    const { error } = validator.validateLogin(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (error) {
    logger.error('Error in user login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Logout User
export const logout = async (req: Request, res: Response) => {
  try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
          return res.status(401).json({ error: 'Access denied. No token provided.' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
          return res.status(401).json({ error: 'Access denied. Invalid token format.' });
      }

      // Add the token to the blacklist
      const decoded = jwt.verify(token, config.jwtSecret as string);
      const expirationDate = new Date((decoded as any).exp * 1000);

      await Token.create({
          token,
          expiresAt: expirationDate
      });

      res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
      res.status(500).json({ error: 'Internal server error.' });
  }
};
