import React from 'react';
import { Link } from 'react-router-dom';
import { plans } from '../../data/mockPlans';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const BillingUpgradePage = () => {
  return (
    <div className="billing-upgrade-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Upgrade Your Dialectic Tier</h1>
          <p className="page-sub">Expand battle concurrency, unlock Red-Team Assassin rounds, and invite team members.</p>
        </div>
        <Link to="/app/billing">
          <Button variant="outline">← Back to Billing</Button>
        </Link>
      </div>

      <div className="upgrade-cards-grid mt-6">
        {plans.slice(1).map((p) => (
          <Card key={p.id} className="upgrade-tier-card">
            {p.badge && <span className="tier-badge">{p.badge}</span>}
            <h3 className="tier-title">{p.name}</h3>
            <p className="tier-tagline">{p.tagline}</p>
            <div className="tier-price mt-4">
              <span className="price-big">${p.price.monthly}</span>
              <span className="price-cadence">/ month</span>
            </div>

            <ul className="tier-perks-list mt-6">
              {p.features.map((f, i) => (
                <li key={i} className={f.included ? 'included' : 'excluded'}>
                  <span>{f.included ? '✓' : '—'}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            <div className="tier-action mt-6">
              <Link to={`/checkout?plan=${p.id}&interval=monthly`} className="w-full block">
                <Button variant={p.popular ? 'primary' : 'outline'} className="w-full">
                  Choose {p.name}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
