import Joi, { ValidationResult, ObjectSchema } from 'joi';

// Define the interfaces for the input objects
interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface WalletCreationData {
  userId: string;
  email: string;
  initialBalance?: number;
}

interface Transaction {
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  fromUserId?: string;
  toUserId?: string;
  currency?: string;
}

const validator = {
  validateUser(user: User): ValidationResult<User> {
    const schema: ObjectSchema<User> = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required()
    });
    return schema.validate(user);
  },

  validateLogin(data: LoginData): ValidationResult<LoginData> {
    const schema: ObjectSchema<LoginData> = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });
    return schema.validate(data);
  },

  validateWalletCreation(data: WalletCreationData): ValidationResult<WalletCreationData> {
    const schema: ObjectSchema<WalletCreationData> = Joi.object({
      userId: Joi.string().required(),
      email: Joi.string().required(),
      initialBalance: Joi.number().min(0).default(0)
    });
    return schema.validate(data);
  },

  validateTransaction(transaction: Transaction): ValidationResult<Transaction> {
    const schema: ObjectSchema<Transaction> = Joi.object({
      type: Joi.string().valid('deposit', 'withdraw', 'transfer').required(),
      amount: Joi.number().positive().required(),
      fromUserId: Joi.string().when('type', { is: 'transfer', then: Joi.required() }),
      toUserId: Joi.string().when('type', { is: 'transfer', then: Joi.required() }),
      currency: Joi.string().default('USD')
    });
    return schema.validate(transaction);
  },

  validateAmount(amount: number): ValidationResult<number> {
    return Joi.number().positive().validate(amount);
  },

  validateId(id: string): ValidationResult<string> {
    return Joi.string().required().validate(id);
  },

  validateEmail(email: string): ValidationResult<string> {
    return Joi.string().email().required().validate(email);
  }
};

export default validator;
