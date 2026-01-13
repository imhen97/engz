import type Stripe from "stripe";

/**
 * Stripe customer with email (expanded)
 */
export interface StripeCustomerWithEmail extends Stripe.Customer {
  email: string;
}

/**
 * Stripe subscription with expanded customer
 */
export interface StripeSubscriptionWithCustomer extends Stripe.Subscription {
  customer: Stripe.Customer | string;
}

/**
 * Payment data for admin display
 */
export interface PaymentData {
  id: string;
  customerId: string | null;
  customerEmail: string | null;
  status: Stripe.Subscription.Status;
  plan: string;
  amount: string;
  currency: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}
