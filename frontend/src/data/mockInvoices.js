/**
 * Centralized Mock Billing & Invoices Data
 */

export const mockInvoices = [
  {
    id: 'INV-2026-0042',
    date: 'Oct 01, 2026',
    description: 'Sangram AI Pro Dialectic Plan (Monthly)',
    amount: '$29.00',
    status: 'Paid',
    method: 'Mastercard ending in •••• 4242',
    pdfUrl: '#'
  },
  {
    id: 'INV-2026-0031',
    date: 'Sep 01, 2026',
    description: 'Sangram AI Pro Dialectic Plan (Monthly)',
    amount: '$29.00',
    status: 'Paid',
    method: 'Mastercard ending in •••• 4242',
    pdfUrl: '#'
  },
  {
    id: 'INV-2026-0018',
    date: 'Aug 01, 2026',
    description: 'Sangram AI Pro Dialectic Plan (Monthly)',
    amount: '$29.00',
    status: 'Paid',
    method: 'Mastercard ending in •••• 4242',
    pdfUrl: '#'
  }
];

export const mockPaymentMethods = [
  {
    id: 'pm-1',
    type: 'Mastercard',
    brand: 'Mastercard',
    last4: '4242',
    expiry: '08/28',
    isDefault: true,
    cardholderName: 'Alex Vance'
  }
];
