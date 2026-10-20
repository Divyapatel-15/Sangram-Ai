import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { plans } from '../../data/mockPlans';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Logo } from '../../components/common/Logo';

export const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const planId = searchParams.get('plan') || 'pro';
  const intervalParam = searchParams.get('interval') || 'monthly';

  const [interval, setInterval] = useState(intervalParam);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const plan = plans.find(p => p.id === planId) || plans[1];
  const basePrice = interval === 'yearly' ? plan.price.yearly * 12 : plan.price.monthly;
  const tax = Math.round(basePrice * 0.18);
  const total = Math.max(0, basePrice - promoDiscount + tax);

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'ARENA20') {
      const discount = Math.round(basePrice * 0.2);
      setPromoDiscount(discount);
      showToast('Promo code ARENA20 applied! 20% discount granted.', 'success');
    } else {
      showToast('Invalid promo code. Try "ARENA20" for testing.', 'warn');
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      showToast('Payment simulated successfully! Welcome to ' + plan.name, 'success');
      navigate('/checkout/success?plan=' + plan.id);
    }, 800);
  };

  const handleCancel = () => {
    navigate('/checkout/cancelled');
  };

  const simulateFailure = () => {
    navigate('/checkout/failed');
  };

  return (
    <div className="checkout-page-view">
      <div className="checkout-top-header">
        <div className="flex items-center gap-3">
          <Logo size="md" href="/home" />
          <span className="checkout-pill-badge">Secure Checkout</span>
        </div>
        <button type="button" className="cancel-checkout-link" onClick={handleCancel}>
          Cancel & Return
        </button>
      </div>

      <div className="checkout-container-grid">
        {/* Left Column: Order details & Payment Method */}
        <div className="checkout-left-col">
          <Card className="checkout-section-card">
            <h2 className="section-heading">1. Subscription Cadence</h2>
            <div className="interval-selector-row mt-4">
              <label className={`interval-radio-card ${interval === 'monthly' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="interval"
                  checked={interval === 'monthly'}
                  onChange={() => setInterval('monthly')}
                />
                <div className="radio-text-wrap">
                  <span className="radio-title">Billed Monthly</span>
                  <span className="radio-price">${plan.price.monthly} / month</span>
                </div>
              </label>

              <label className={`interval-radio-card ${interval === 'yearly' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="interval"
                  checked={interval === 'yearly'}
                  onChange={() => setInterval('yearly')}
                />
                <div className="radio-text-wrap">
                  <span className="radio-title">Billed Annually (Save 20%)</span>
                  <span className="radio-price">${plan.price.yearly * 12} / year</span>
                </div>
              </label>
            </div>
          </Card>

          <Card className="checkout-section-card mt-6">
            <h2 className="section-heading">2. Payment Method</h2>
            <p className="text-muted text-xs">
              Frontend prototype: No real payments or credit card numbers are collected.
            </p>

            <div className="payment-methods-tabs mt-4">
              <button
                type="button"
                className={`pm-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Credit / Debit Card
              </button>
              <button
                type="button"
                className={`pm-tab-btn ${paymentMethod === 'googlepay' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('googlepay')}
              >
                Google Pay
              </button>
            </div>

            <form onSubmit={handlePay} className="payment-fields-mock mt-4">
              <Input label="Name on Card" defaultValue="Alex Vance" required />
              <Input label="Card Number" defaultValue="•••• •••• •••• 4242" required />
              <div className="flex gap-4">
                <Input label="Expiry Date" defaultValue="08/28" required />
                <Input label="CVC" defaultValue="•••" required />
              </div>

              <div className="legal-consent-notice mt-4 text-xs text-muted">
                By clicking "Complete Order", you authorize Sangram AI to charge ${total} to your selected payment method. You agree to our <Link to="/terms" target="_blank">Terms of Service</Link> and <Link to="/refund-policy" target="_blank">14-Day Refund Policy</Link>.
              </div>

              <div className="pay-action-row mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full pay-now-btn"
                  loading={processing}
                >
                  Complete Order · Pay ${total}
                </Button>
              </div>

              <div className="test-fail-row mt-4 text-center">
                <button
                  type="button"
                  className="text-xs text-muted underline"
                  onClick={simulateFailure}
                >
                  (Testing shortcut: Simulate Payment Failure State)
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-right-col">
          <Card className="order-summary-card">
            <h3 className="summary-card-title">Order Summary</h3>

            <div className="summary-plan-row mt-4">
              <div>
                <span className="summary-plan-name">{plan.name}</span>
                <span className="summary-plan-tagline block text-muted text-xs">{plan.tagline}</span>
              </div>
              <span className="summary-plan-price font-bold">${basePrice}</span>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={applyPromo} className="promo-code-form mt-4">
              <input
                type="text"
                placeholder="Promo Code (Try ARENA20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
              />
              <Button variant="secondary" size="sm" type="submit">
                Apply
              </Button>
            </form>

            <div className="summary-breakdown-list mt-4">
              <div className="breakdown-item">
                <span>Subtotal ({interval})</span>
                <span>${basePrice}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="breakdown-item text-success">
                  <span>Promo Discount (ARENA20)</span>
                  <span>-${promoDiscount}</span>
                </div>
              )}
              <div className="breakdown-item">
                <span>Estimated Tax (18% GST/VAT)</span>
                <span>${tax}</span>
              </div>
              <hr className="summary-divider my-3" />
              <div className="breakdown-total-item">
                <strong>Total Due Today</strong>
                <strong className="total-amount">${total}</strong>
              </div>
            </div>

            <div className="guarantee-box mt-6">
              <span className="shield-icon">🛡</span>
              <div className="guarantee-text">
                <strong>14-Day Money-Back Guarantee</strong>
                <p className="text-xs text-muted">
                  If Sangram AI doesn't transform your architectural clarity, request a full refund within 14 days.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
