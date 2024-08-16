// import Stripe from 'stripe';
// import config from '../config/config';

// class StripeService {
//   private stripe: Stripe;

//   constructor() {
//     this.stripe = new Stripe(config.stripeSecretKey, {
//       apiVersion: null,
//     });
//   }

//   async createCustomer(email: string): Promise<Stripe.Customer> {
//     try {
//       const customer = await this.stripe.customers.create({ email });
//       return customer;
//     } catch (error: any) {
//       console.error('Error creating Stripe customer:', error);
//       throw new Error('Failed to create Stripe customer: ' + error.message);
//     }
//   }

//   async createPaymentIntent(
//     amount: number,
//     currency: string,
//     customerId: string
//   ): Promise<Stripe.PaymentIntent> {
//     try {
//       const paymentIntent = await this.stripe.paymentIntents.create({
//         amount,
//         currency,
//         customer: customerId,
//         payment_method_types: ['card'],
//       });
//       return paymentIntent;
//     } catch (error: any) {
//       console.error('Error creating payment intent:', error);
//       throw new Error('Failed to create payment intent: ' + error.message);
//     }
//   }

//   async confirmPaymentIntent(
//     paymentIntentId: string,
//     paymentMethodId: string
//   ): Promise<Stripe.PaymentIntent> {
//     try {
//       const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
//         payment_method: paymentMethodId,
//       });
//       return paymentIntent;
//     } catch (error: any) {
//       console.error('Error confirming payment intent:', error);
//       throw new Error('Failed to confirm payment: ' + error.message);
//     }
//   }

//   async createPayout(
//     amount: number,
//     currency: string,
//     destination: string
//   ): Promise<Stripe.Payout> {
//     try {
//       const payout = await this.stripe.payouts.create({
//         amount,
//         currency,
//         destination,
//         method: 'instant', // or 'standard' for ACH transfers
//       });
//       return payout;
//     } catch (error: any) {
//       console.error('Error creating payout:', error);
//       throw new Error('Failed to create payout: ' + error.message);
//     }
//   }

//   async getBalance(): Promise<Stripe.Balance> {
//     try {
//       const balance = await this.stripe.balance.retrieve();
//       return balance;
//     } catch (error: any) {
//       console.error('Error retrieving Stripe balance:', error);
//       throw new Error('Failed to retrieve Stripe balance: ' + error.message);
//     }
//   }

//   async createPaymentMethod(
//     card: Stripe.PaymentMethodCreateParams.Card1
//   ): Promise<Stripe.PaymentMethod> {
//     try {
//       const paymentMethod = await this.stripe.paymentMethods.create({
//         type: 'card',
//         card: card,
//       });
//       return paymentMethod;
//     } catch (error: any) {
//       console.error('Error creating payment method:', error);
//       throw new Error('Failed to create payment method: ' + error.message);
//     }
//   }
  

//   async attachPaymentMethodToCustomer(
//     paymentMethodId: string,
//     customerId: string
//   ): Promise<Stripe.PaymentMethod> {
//     try {
//       const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
//         customer: customerId,
//       });
//       return paymentMethod;
//     } catch (error: any) {
//       console.error('Error attaching payment method to customer:', error);
//       throw new Error('Failed to attach payment method to customer: ' + error.message);
//     }
//   }

//   async listCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
//     try {
//       const paymentMethods = await this.stripe.paymentMethods.list({
//         customer: customerId,
//         type: 'card',
//       });
//       return paymentMethods.data;
//     } catch (error: any) {
//       console.error('Error listing customer payment methods:', error);
//       throw new Error('Failed to list customer payment methods: ' + error.message);
//     }
//   }

//   async createRefund(
//     paymentIntentId: string,
//     amount: number
//   ): Promise<Stripe.Refund> {
//     try {
//       const refund = await this.stripe.refunds.create({
//         payment_intent: paymentIntentId,
//         amount,
//       });
//       return refund;
//     } catch (error: any) {
//       console.error('Error creating refund:', error);
//       throw new Error('Failed to create refund: ' + error.message);
//     }
//   }
// }

// export default new StripeService();
