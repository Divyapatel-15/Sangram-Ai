import React from 'react';

export const PrivacyPage = () => {
  return (
    <div className="legal-page-view">
      <div className="page-hero-banner">
        <div className="section-container text-center">
          <span className="section-tag">TRANSPARENCY</span>
          <h1 className="page-hero-title">Privacy Policy</h1>
          <p className="page-hero-sub">Effective Date: October 20, 2026</p>
        </div>
      </div>

      <div className="section-container py-12 max-w-3xl mx-auto legal-prose">
        <section className="legal-section">
          <h2>1. Overview & Prototype Status</h2>
          <p>
            Sangram AI operates this multi-model dialectic workspace. In this frontend release, user inputs, simulated debate records, and preference settings are cached locally within your client browser (via localStorage). No third-party LLM providers are sent your unencrypted data without explicit execution triggers.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          <p>
            When utilizing the prototype, we do not require biometric data, real financial account credentials, or government IDs. Form entries on login and registration screens are validated locally for interface design review.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Model Debate Queries</h2>
          <p>
            Your prompts and questions are processed to render comparative debate timelines. In production deployment, enterprise chambers operate with zero-data-retention (ZDR) agreements preventing foundational model providers from training on user submissions.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Cookies & Local Storage</h2>
          <p>
            We use browser storage strictly for essential session persistence, UI theme settings (dark mode tokens), and saving your local dialectic battle history.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Contact Regarding Privacy</h2>
          <p>
            For inquiries regarding privacy practices, contact our security officer at <a href="mailto:privacy@sangram.ai">privacy@sangram.ai</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
