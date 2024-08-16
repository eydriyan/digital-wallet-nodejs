import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Transaction model
export interface ITransaction extends Document {
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  currency: string;
  fromWallet?: mongoose.Types.ObjectId;
  toWallet?: mongoose.Types.ObjectId;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  stripePaymentIntentId?: string;
  metadata?: any;
  createdAt: Date;
}

// Define the schema for the Transaction model
const transactionSchema: Schema<ITransaction> = new Schema<ITransaction>({
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  fromWallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: function(this: ITransaction) { return this.type === 'transfer'; }
  },
  toWallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: function(this: ITransaction) { return this.type === 'transfer' || this.type === 'deposit'; }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  stripePaymentIntentId: {
    type: String
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Transaction model
const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
