import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { plans, billingFrequencies, featureComparisonMatrix } from '../../data/mockPlans';
import { mockFaqs } from '../../data/mockFaqs';
import { Button } from '../../components/common/Button';

export const PricingPage = () => {
  const [interval, setInterval] = useState('monthly');
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <div className="pricing-page-view">
      <div className="page-hero-banner">
        <div className="section-container text-center">
          <span className="section-tag">INVESTMENT IN CLARITY</span>
          <h1 className="page-hero-title">Predictable Plans for High-Conviction Decisions</h1>
          <p className="page-hero-sub">
            Whether you are testing individual architectural hunches or equipping an enterprise engineering squad, Sangram AI scales with you.
          </p>

          {/* Billing Frequency Toggle */}
          <div className="billing-toggle-container mt-8">
            <div className="toggle-pill-wrapper">
              {billingFrequencies.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`toggle-option-btn ${interval === f.id ? 'active' : ''}`}
                  onClick={() => setInterval(f.id)}
                >
                  <span>{f.label}</span>
                  {f.discountBadge && <span className="discount-tag">{f.discountBadge}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Pricing Cards Grid (4 Plans: Free, Pro, Power, Team) */}
        <div className="pricing-cards-full-grid">
          {plans.map((p) => {
            const price = interval === 'yearly' ? p.price.yearly : p.price.monthly;
            const checkoutUrl = p.id === 'free' ? '/auth/signup' : p.id === 'team' ? '/contact' : `/checkout?plan=${p.id}&interval=${interval}`;

            return (
              <div
                key={p.id}
                className={`full-pricing-card ${p.popular ? 'card-highlighted' : ''}`}
              >
                {p.badge && <div className="card-top-badge">{p.badge}</div>}
                <div className="card-header-block">
                  <h3 className="plan-title">{p.name}</h3>
                  <p className="plan-subtitle">{p.tagline}</p>
                </div>

                <div className="card-price-block">
                  <div className="price-number-row">
                    <span className="currency">$</span>
                    <span className="amount">{price}</span>
                    <span className="cadence">{p.period}</span>
                  </div>
                  {interval === 'yearly' && p.price.monthly > 0 && (
                    <span className="annual-billed-note">Billed annually (${price * 12}/yr)</span>
                  )}
                  {p.price.monthly === 0 && (
                    <span className="annual-billed-note">Forever free for developers</span>
                  )}
                </div>

                <div className="card-cta-wrapper">
                  <Link to={checkoutUrl} className="w-full block">
                    <Button
                      variant={p.popular ? 'primary' : 'outline'}
                      size="lg"
                      className="w-full"
                    >
                      {p.cta}
                    </Button>
                  </Link>
                </div>

                <div className="card-features-block">
                  <span className="features-header-title">What is included:</span>
                  <ul className="plan-perks-list">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className={feat.included ? 'perk-active' : 'perk-inactive'}>
                        <span className="perk-bullet">{feat.included ? '✓' : '—'}</span>
                        <span className="perk-label">{feat.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="comparison-table-section mt-16">
          <div className="text-center mb-8">
            <span className="section-tag">COMPREHENSIVE SPECIFICATIONS</span>
            <h2 className="section-title">Compare All Features by Tier</h2>
          </div>

          <div className="matrix-table-wrap">
            <table className="feature-matrix-table">
              <thead>
                <tr>
                  <th className="th-feature">Feature</th>
                  <th>Free Scout</th>
                  <th className="highlight-col">Pro Dialectic</th>
                  <th>Power Thinker</th>
                  <th>Team / Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureComparisonMatrix.map((cat, ci) => (
                  <React.Fragment key={ci}>
                    <tr className="category-row">
                      <td colSpan={5} className="category-header-cell">{cat.category}</td>
                    </tr>
                    {cat.rows.map((r, ri) => (
                      <tr key={ri} className="data-row">
                        <td className="row-feature-name">{r.name}</td>
                        <td className="row-val">{r.free}</td>
                        <td className="row-val highlight-col">{r.pro}</td>
                        <td className="row-val">{r.power}</td>
                        <td className="row-val">{r.team}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="pricing-faq-section mt-16">
          <div className="text-center mb-8">
            <span className="section-tag">FREQUENTLY ASKED</span>
            <h2 className="section-title">Billing & Subscription Questions</h2>
          </div>

          <div className="faq-accordion-list">
            {mockFaqs.slice(0, 4).map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                  >
                    <span className="faq-q-text">{faq.q}</span>
                    <span className="faq-chevron">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-body animate-fade-in">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
