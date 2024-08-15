import mongoose, { Document, Schema } from 'mongoose';

// Define the Wallet interface that extends mongoose Document
interface IWallet extends Document {
  user: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  stripeCustomerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the Wallet model
const walletSchema: Schema<IWallet> = new Schema<IWallet>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  stripeCustomerId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
walletSchema.pre<IWallet>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create and export the Wallet model
const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);

export default Wallet;
