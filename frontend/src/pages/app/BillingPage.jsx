import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';

export const BillingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      const inv = await mockBillingService.getInvoices();
      setInvoices(inv);
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
          <p className="page-sub">Manage your plan, payment methods, and invoice history.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/pricing">
            <Button variant="primary">Change Plan</Button>
          </Link>
        </div>
      </div>

      {/* Current Plan Overview Card */}
      <div className="current-plan-box mt-6">
        <div className="plan-header-row">
          <div>
            <span className="clean-tag-active">ACTIVE SUBSCRIPTION</span>
            <h2 className="plan-title-lg mt-2">Pro Dialectic Tier</h2>
            <p className="plan-sub-text">
              $29.00 / month · Renews on November 01, 2026 via Mastercard •••• 4242
            </p>
          </div>
          <div className="plan-upgrade-action">
            <Link to="/checkout?plan=power&interval=monthly">
              <Button variant="primary" icon="⚡">
                Upgrade to Power Tier
              </Button>
            </Link>
          </div>
        </div>

        <div className="plan-features-grid mt-6">
          <div className="feat-check-item">
            <span className="check-icon">✓</span>
            <span>All 6 Frontier Model Architectures in Arena</span>
          </div>
          <div className="feat-check-item">
            <span className="check-icon">✓</span>
            <span>Full 4-Round Cross-Examination & Synthesis</span>
          </div>
          <div className="feat-check-item">
            <span className="check-icon">✓</span>
            <span>Permanent History & Unlimited ADR Saves</span>
          </div>
          <div className="feat-check-item">
            <span className="check-icon">✓</span>
            <span>Priority Queue Dialectic Processing</span>
          </div>
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="clean-card-box mt-6">
        <div className="box-title-row">
          <h3 className="box-title">Invoice & Receipt History</h3>
          <span className="text-muted text-xs">{invoices.length} billing records</span>
        </div>

        <div className="invoices-table-container mt-4">
          <table className="clean-invoices-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Billing Date</th>
                <th>Plan Tier</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-mono text-cyan">{inv.id}</td>
                  <td>{inv.date}</td>
                  <td>{inv.plan}</td>
                  <td className="font-semibold">{inv.amount}</td>
                  <td>
                    <span className="paid-pill">Paid</span>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="download-text-btn"
                      onClick={() => handleDownloadInvoice(inv.id)}
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
