// import { Types } from 'mongoose';
// import Transaction from '../models/transaction.model';
// import User, { IUser } from '../models/user.model';
// import StripeService from './stripe.service';

// // Define interfaces for Wallet and Transaction types
// interface IWallet {
//   balance: number;
//   stripeCustomerId: string;
// }

// interface ITransaction {
//   type: 'deposit' | 'transfer' | 'withdraw';
//   userId?: Types.ObjectId;
//   fromUserId?: Types.ObjectId;
//   toUserId?: Types.ObjectId;
//   amount: number;
//   timestamp: Date;
//   destinationAccount?: string;
// }

// // Define the StripeService interface
// interface IStripeService {
//   createCustomer(email: string): Promise<{ id: string }>;
//   createPaymentIntent(amount: number, currency: string, customerId: string): Promise<{ id: string }>;
//   confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<{ status: string }>;
//   createPayout(amount: number, currency: string, destinationAccount: string): Promise<void>;
// }

// class WalletService {
//   private stripeService: IStripeService;

//   constructor() {
//     this.stripeService = StripeService;
//   }

//   async createWallet(userId: string, email: string, initialBalance: number): Promise<{ success: boolean, wallet?: IWallet }> {
//     const user: IUser | null = await User.findById(userId);
//     if (!user) {
//       throw new Error('User not found');
//     }
//     if (user.wallet) {
//       throw new Error('Wallet already exists for this user');
//     }

//     // const customer = await this.stripeService.createCustomer(email);
//     user.wallet = { balance: initialBalance, stripeCustomerId: "1" }; //customer.id
//     await user.save();

//     return { success: true, wallet: user.wallet };
//   }

//   async deposit(userId: string, amount: number, paymentMethodId: string): Promise<{ success: boolean, transaction?: ITransaction, newBalance?: number }> {
//     const user: IUser | null = await User.findById(userId);
//     if (!user || !user.wallet) {
//       throw new Error('Wallet not found');
//     }

//     try {
//       const paymentIntent = await this.stripeService.createPaymentIntent(amount, 'usd', user.wallet.stripeCustomerId);
//       const confirmedPayment = await this.stripeService.confirmPaymentIntent(paymentIntent.id, paymentMethodId);

//       if (confirmedPayment.status === 'succeeded') {
//         user.wallet.balance += amount;
//         await user.save();

//         const transaction: ITransaction = {
//           type: 'deposit',
//           userId: new Types.ObjectId(userId),
//           amount,
//           timestamp: new Date()
//         };
//         await new Transaction(transaction).save();

//         return { success: true, transaction, newBalance: user.wallet.balance };
//       } else {
//         throw new Error('Payment failed');
//       }
//     } catch (error) {
//       console.error('Deposit failed:', error);
//       throw new Error('Deposit failed: ' + error.message);
//     }
//   }

//   async transfer(fromUserId: string, toUserId: string, amount: number): Promise<{ success: boolean, transaction?: ITransaction, fromBalance?: number, toBalance?: number }> {
//     const fromUser: IUser | null = await User.findById(fromUserId);
//     const toUser: IUser | null = await User.findById(toUserId);

//     if (!fromUser || !fromUser.wallet || !toUser || !toUser.wallet) {
//       throw new Error('One or both wallets not found');
//     }

//     if (fromUser.wallet.balance < amount) {
//       throw new Error('Insufficient funds');
//     }

//     fromUser.wallet.balance -= amount;
//     toUser.wallet.balance += amount;

//     await fromUser.save();
//     await toUser.save();

//     const transaction: ITransaction = {
//       type: 'transfer',
//       fromUserId: new Types.ObjectId(fromUserId),
//       toUserId: new Types.ObjectId(toUserId),
//       amount,
//       timestamp: new Date()
//     };
//     await new Transaction(transaction).save();

//     return { 
//       success: true, 
//       transaction, 
//       fromBalance: fromUser.wallet.balance, 
//       toBalance: toUser.wallet.balance 
//     };
//   }

//   async withdraw(userId: string, amount: number, destinationAccount: string): Promise<{ success: boolean, transaction?: ITransaction, newBalance?: number }> {
//     const user: IUser | null = await User.findById(userId);
//     if (!user || !user.wallet) {
//       throw new Error('Wallet not found');
//     }

//     if (user.wallet.balance < amount) {
//       throw new Error('Insufficient funds');
//     }

//     try {
//       await this.stripeService.createPayout(amount, 'usd', destinationAccount);

//       user.wallet.balance -= amount;
//       await user.save();

//       const transaction: ITransaction = {
//         type: 'withdraw',
//         userId: new Types.ObjectId(userId),
//         amount,
//         destinationAccount,
//         timestamp: new Date()
//       };
//       await new Transaction(transaction).save();

//       return { success: true, transaction, newBalance: user.wallet.balance };
//     } catch (error) {
//       console.error('Withdrawal failed:', error);
//       throw new Error('Withdrawal failed: ' + error.message);
//     }
//   }

//   async getBalance(userId: string): Promise<{ success: boolean, balance?: number }> {
//     const user: IUser | null = await User.findById(userId);
//     if (!user || !user.wallet) {
//       throw new Error('Wallet not found');
//     }

//     return { success: true, balance: user.wallet.balance };
//   }

//   async getTransactionHistory(userId: string): Promise<{ success: boolean, transactions?: ITransaction[] }> {
//     const transactions = await Transaction.find({
//       $or: [
//         { userId: new Types.ObjectId(userId) },
//         { fromUserId: new Types.ObjectId(userId) },
//         { toUserId: new Types.ObjectId(userId) }
//       ]
//     }).sort({ timestamp: -1 });

//     return { success: true, transactions };
//   }
// }

// export default new WalletService();
