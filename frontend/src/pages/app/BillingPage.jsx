import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const BillingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      const [inv, pm] = await Promise.all([
        mockBillingService.getInvoices(),
        mockBillingService.getPaymentMethods()
      ]);
      setInvoices(inv);
      setPaymentMethods(pm);
    };
    load();
  }, []);

  const handleDownloadInvoice = (id) => {
    showToast(`Downloading receipt for ${id} (simulated PDF)...`, 'info');
  };

  return (
    <div className="billing-page-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Billing & Subscriptions</h1>
          <p className="page-sub">Manage your plan, payment methods, and invoice records.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/billing/manage">
            <Button variant="outline">Payment Methods</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="primary">Change Plan</Button>
          </Link>
        </div>
      </div>

      {/* Current Plan Overview Card */}
      <Card className="current-plan-card mt-6">
        <div className="plan-header-row">
          <div>
            <Badge variant="cyan" size="sm">ACTIVE SUBSCRIPTION</Badge>
            <h2 className="plan-name-huge mt-2">Pro Dialectic Tier</h2>
            <p className="plan-cadence-desc">
              $29.00 / month · Renews on November 01, 2026 via Mastercard •••• 4242
            </p>
          </div>
          <div className="plan-quick-actions">
            <Link to="/checkout?plan=power&interval=monthly">
              <Button variant="primary" icon="⚡">
                Upgrade to Power Tier
              </Button>
            </Link>
          </div>
        </div>

        <div className="plan-features-summary mt-6">
          <div className="summary-item">
            <span className="bullet">✓</span>
            <span>All 6 Frontier Model Profiles in Arena</span>
          </div>
          <div className="summary-item">
            <span className="bullet">✓</span>
            <span>Full 4-Round Cross-Examination & Synthesis</span>
          </div>
          <div className="summary-item">
            <span className="bullet">✓</span>
            <span>Permanent History & Unlimited ADR Saves</span>
          </div>
          <div className="summary-item">
            <span className="bullet">✓</span>
            <span>High-Speed Parallel Queue Priority</span>
          </div>
        </div>
      </Card>

      {/* Invoice History */}
      <Card className="invoices-card mt-8">
        <div className="invoices-header">
          <h3 className="card-heading">Invoice History</h3>
          <Link to="/app/billing/invoices" className="view-invoices-link">
            All Invoices ({invoices.length}) →
          </Link>
        </div>

        <div className="invoices-table-wrap mt-4">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Plan Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-mono">{inv.id}</td>
                  <td>{inv.date}</td>
                  <td>{inv.description}</td>
                  <td className="font-bold">{inv.amount}</td>
                  <td>
                    <Badge variant="success" size="sm">{inv.status}</Badge>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="download-pdf-btn"
                      onClick={() => handleDownloadInvoice(inv.id)}
                    >
                      PDF ↗
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
