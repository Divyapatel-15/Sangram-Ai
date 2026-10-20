import React from 'react';

export const RefundPolicyPage = () => {
  return (
    <div className="legal-page-view">
      <div className="page-hero-banner">
        <div className="section-container text-center">
          <span className="section-tag">CUSTOMER GUARANTEE</span>
          <h1 className="page-hero-title">Refund & Cancellation Policy</h1>
          <p className="page-hero-sub">Effective Date: October 20, 2026</p>
        </div>
      </div>

      <div className="section-container py-12 max-w-3xl mx-auto legal-prose">
        <section className="legal-section">
          <h2>1. 14-Day Money-Back Guarantee</h2>
          <p>
            We want you to be fully satisfied with Sangram AI. If you upgrade to our Pro Dialectic or Power Thinker plan and decide it does not meet your engineering workflow requirements, you can request a full 100% refund within 14 days of your initial purchase date.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Subscription Cancellations</h2>
          <p>
            You may cancel your monthly or annual subscription at any time directly through the <em>Billing & Plans</em> interface (`/app/billing`). Upon cancellation, your account will remain active at the paid tier until the conclusion of your current billing period.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Refund Request Process</h2>
          <p>
            To submit a refund request, simply email <a href="mailto:billing@sangram.ai">billing@sangram.ai</a> with your account email and invoice ID. Approved refunds are processed back to your original payment method within 3 to 5 business days.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Enterprise & Custom Agreements</h2>
          <p>
            Refund and termination terms for Team or Enterprise custom war-room chambers are governed by the specific terms set forth in their Master Service Agreement (MSA).
          </p>
        </section>
      </div>
    </div>
  );
};
