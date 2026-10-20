import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const BillingInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchInvoices = async () => {
      const data = await mockBillingService.getInvoices();
      setInvoices(data);
    };
    fetchInvoices();
  }, []);

  const handleDownload = (id) => {
    showToast(`Downloading invoice receipt ${id} (simulated PDF)...`, 'info');
  };

  return (
    <div className="billing-invoices-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Invoice Records & Receipts</h1>
          <p className="page-sub">Official billing statements and tax deduction receipts.</p>
        </div>
        <Link to="/app/billing">
          <Button variant="outline">← Back to Overview</Button>
        </Link>
      </div>

      <Card className="invoices-list-card mt-6">
        <div className="table-responsive">
          <table className="invoices-full-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-mono font-bold">{inv.id}</td>
                  <td>{inv.date}</td>
                  <td>{inv.description}</td>
                  <td className="text-muted">{inv.method}</td>
                  <td className="font-bold">{inv.amount}</td>
                  <td>
                    <Badge variant="success" size="sm">{inv.status}</Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(inv.id)}
                    >
                      Download PDF
                    </Button>
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
