import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export const BillingManagePage = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { showToast } = useToast();

  const handleConfirmCancel = () => {
    setCancelling(true);
    setTimeout(() => {
      setCancelling(false);
      setShowCancelModal(false);
      showToast('Subscription will expire at period end. No further charges.', 'info');
    }, 600);
  };

  return (
    <div className="billing-manage-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Manage Subscription & Payment</h1>
          <p className="page-sub">Configure payment methods, billing address, and subscription status.</p>
        </div>
        <Link to="/app/billing">
          <Button variant="outline">← Back to Billing</Button>
        </Link>
      </div>

      <div className="manage-grid mt-6">
        {/* Payment Methods Card */}
        <Card className="manage-card">
          <div className="card-top-flex">
            <h3 className="manage-title">Payment Methods</h3>
            <Button variant="outline" size="sm" onClick={() => setShowAddCardModal(true)}>
              + Add Card
            </Button>
          </div>

          <div className="payment-method-item mt-4">
            <div className="pm-left">
              <span className="card-brand-icon">💳</span>
              <div>
                <span className="card-title-text">Mastercard ending in 4242</span>
                <span className="card-expiry-text">Expires 08/2028 · Default</span>
              </div>
            </div>
            <span className="default-pill">Default</span>
          </div>
        </Card>

        {/* Billing Information Card */}
        <Card className="manage-card">
          <h3 className="manage-title">Billing Address</h3>
          <p className="text-muted text-sm mt-1">This address appears on all official invoices and VAT receipts.</p>

          <form className="billing-address-form mt-4" onSubmit={(e) => { e.preventDefault(); showToast('Billing address updated!', 'success'); }}>
            <Input label="Company / Legal Name" defaultValue="Alex Vance (Sangram Engineering)" />
            <Input label="Address Line 1" defaultValue="742 Evergreen Terrace" />
            <div className="flex gap-4">
              <Input label="City" defaultValue="Bangalore" />
              <Input label="Postal Code" defaultValue="560001" />
            </div>
            <Button type="submit" variant="primary" size="sm" className="mt-2">
              Save Billing Address
            </Button>
          </form>
        </Card>

        {/* Danger Zone: Cancellation Card */}
        <Card className="danger-zone-card mt-4">
          <h3 className="danger-title">Cancel Subscription</h3>
          <p className="danger-sub">
            Canceling will downgrade your workspace to the Free Scout tier at the end of the current billing cycle. You will lose access to 4-way parallel battles and extended history.
          </p>
          <div className="mt-4">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Subscription...
            </Button>
          </div>
        </Card>
      </div>

      {/* Cancellation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Confirm Subscription Cancellation"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Keep Subscription
            </Button>
            <Button variant="danger" loading={cancelling} onClick={handleConfirmCancel}>
              Confirm Cancellation
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to cancel your <strong>Pro Dialectic</strong> subscription?
        </p>
        <p className="mt-2 text-muted">
          Your workspace will retain Pro capabilities until <strong>November 01, 2026</strong>. After that date, your account will revert to the Free tier.
        </p>
      </Modal>

      {/* Add Card Modal */}
      <Modal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        title="Add Payment Method"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddCardModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowAddCardModal(false);
                showToast('Card saved securely for future renewals (mock).', 'success');
              }}
            >
              Save Card
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-3">
          <Input label="Cardholder Name" placeholder="Alex Vance" />
          <Input label="Card Number" placeholder="•••• •••• •••• ••••" />
          <div className="flex gap-3">
            <Input label="Expires" placeholder="MM/YY" />
            <Input label="CVC" placeholder="•••" />
          </div>
          <span className="text-muted text-xs">This is a UI preview. No real card verification is processed.</span>
        </form>
      </Modal>
    </div>
  );
};
