import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'pro';

  return (
    <div className="checkout-status-page-view">
      <div className="status-container max-w-lg mx-auto py-16">
        <Card className="status-card text-center p-8 animate-scale-in">
          <div className="status-badge-circle success-circle">✓</div>
          <h1 className="status-title mt-4">Order Complete!</h1>
          <p className="status-sub text-muted mt-2">
            Your payment was simulated successfully. Your workspace has been upgraded to the <strong>{planId.toUpperCase()}</strong> tier.
          </p>

          <div className="receipt-mock-box mt-6 text-left p-4">
            <div className="flex justify-between py-1">
              <span className="text-muted">Transaction ID:</span>
              <span className="font-mono">TXN-2026-99182</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Status:</span>
              <span className="text-success font-bold">Approved</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Chamber Access:</span>
              <span>All 6 Models Unlocked</span>
            </div>
          </div>

          <div className="status-actions mt-8 flex flex-col gap-3">
            <Link to="/app" className="w-full">
              <Button variant="primary" size="lg" className="w-full">
                Go to Workspace Dashboard 🚀
              </Button>
            </Link>
            <Link to="/app/arena/new" className="w-full">
              <Button variant="outline" className="w-full">
                Launch First Pro Battle
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
