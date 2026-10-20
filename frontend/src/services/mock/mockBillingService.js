/**
 * Mock Billing Service Interface
 */

import { plans, featureComparisonMatrix } from '../../data/mockPlans';
import { mockInvoices, mockPaymentMethods } from '../../data/mockInvoices';

export const mockBillingService = {
  getPlans: async () => plans,
  getComparisonMatrix: async () => featureComparisonMatrix,
  getInvoices: async () => mockInvoices,
  getPaymentMethods: async () => mockPaymentMethods,
  
  createCheckoutSession: async ({ planId, interval }) => {
    await new Promise(r => setTimeout(r, 400));
    const plan = plans.find(p => p.id === planId) || plans[1];
    return {
      sessionId: `mock_session_${Date.now()}`,
      plan,
      interval,
      total: interval === 'yearly' ? plan.price.yearly * 12 : plan.price.monthly
    };
  },

  updateSubscription: async ({ planId, interval }) => {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, planId, interval };
  },

  cancelSubscription: async () => {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, message: 'Subscription scheduled for cancellation at period end.' };
  }
};
