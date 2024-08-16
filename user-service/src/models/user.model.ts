import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define an interface for the Wallet subdocument
interface IWallet {
  balance: number;
  stripeCustomerId: string;
}

// Define the Wallet schema
const walletSchema = new Schema<IWallet>({
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
}, { _id: false }); // Disable _id for subdocument

// Define an interface for the User document
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  wallet: IWallet;
  createdAt: Date;
  checkPassword(candidatePassword: string): Promise<boolean>;
}

// Define the User schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  wallet: walletSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.checkPassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
