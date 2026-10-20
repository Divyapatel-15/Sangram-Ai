import React from 'react';

export const TermsPage = () => {
  return (
    <div className="legal-page-view">
      <div className="page-hero-banner">
        <div className="section-container text-center">
          <span className="section-tag">LEGAL TERMS</span>
          <h1 className="page-hero-title">Terms of Service</h1>
          <p className="page-hero-sub">Effective Date: October 20, 2026</p>
        </div>
      </div>

      <div className="section-container py-12 max-w-3xl mx-auto legal-prose">
        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Sangram AI platform, website, or dialectic war room interfaces, you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, please do not use the application.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Description of Service</h2>
          <p>
            Sangram AI provides a multi-model dialectic workspace enabling users to compare responses, simulate structured multi-round critiques between AI architectures, and review consolidated synthesis verdicts.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Intellectual Property of Outputs</h2>
          <p>
            Users retain full rights to the questions, prompts, and consolidated synthesis decisions generated during dialectic sessions, subject to the acceptable use policies of upstream model foundational providers.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Acceptable Use Policy</h2>
          <p>
            You agree not to use the Arena to generate harmful, unlawful, infringing, or discriminatory content. Sangram AI reserves the right to terminate workspace sessions that violate ethical AI safety principles.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            Sangram AI outputs and consensus verdicts are provided for decision-support and research purposes. We make no warranty that AI-generated architectural recommendations are free from error.
          </p>
        </section>
      </div>
    </div>
  );
};
