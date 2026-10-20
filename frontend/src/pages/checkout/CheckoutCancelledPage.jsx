import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const CheckoutCancelledPage = () => {
  return (
    <div className="checkout-status-page-view">
      <div className="status-container max-w-lg mx-auto py-16">
        <Card className="status-card text-center p-8 animate-scale-in">
          <div className="status-badge-circle cancel-circle">✕</div>
          <h1 className="status-title mt-4">Checkout Cancelled</h1>
          <p className="status-sub text-muted mt-2">
            No payment was processed and no charges were made. You can return to our pricing plans whenever you're ready.
          </p>

          <div className="status-actions mt-8 flex flex-col gap-3">
            <Link to="/pricing" className="w-full">
              <Button variant="primary" size="lg" className="w-full">
                Return to Pricing Plans
              </Button>
            </Link>
            <Link to="/app" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
