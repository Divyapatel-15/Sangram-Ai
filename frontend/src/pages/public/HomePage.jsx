import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { models } from '../../data/models';
import { mockFaqs } from '../../data/mockFaqs';
import { plans } from '../../data/mockPlans';
import { Button } from '../../components/common/Button';

export const HomePage = () => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeTab, setActiveTab] = useState('demo-1');

  const benefits = [
    {
      num: '01',
      title: 'Multiple Perspectives',
      desc: 'Never rely on a single model’s idiosyncratic bias. Compare answers from different model architectures simultaneously.',
      icon: '👁'
    },
    {
      num: '02',
      title: 'Challenge the Answers',
      desc: 'Models actively critique each other’s claims in multiple structured rounds, exposing omissions, hallucinations, and unverified assumptions.',
      icon: '⚔'
    },
    {
      num: '03',
      title: 'One Consolidated Answer',
      desc: 'Our Dialectic Synthesis engine extracts points of agreement, separates legitimate trade-offs, and delivers one clear, actionable conclusion.',
      icon: '✦'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Select Models',
      desc: 'Pick 2 or more leading foundational models (GPT, Claude, Gemini, Llama, Mistral, Grok) and optional cognitive personas.'
    },
    {
      step: '02',
      title: 'Ask a Question',
      desc: 'Submit a hard technical dilemma, architectural trade-off, research query, or strategic business problem.'
    },
    {
      step: '03',
      title: 'Enter the Battle',
      desc: 'Watch the models debate in real time: presenting opening claims, raising counterarguments, and defending their logic.'
    },
    {
      step: '04',
      title: 'Get the Final Answer',
      desc: 'Review the synthesized verdict, consensus score, key tensions, and copy the unified response directly into your workflow.'
    }
  ];

  return (
    <div className="home-page-view">
      {/* SECTION 2: Animated Hero with Video / Ambient Background */}
      <section className="home-hero-section">
        {/* Remote Video Background from specs */}
        <div className="hero-video-wrap" aria-hidden="true">
          <video
            className="hero-art-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4"
          />
          <div className="hero-veil-overlay"></div>
        </div>

        <div className="hero-content-container">
          <div className="hero-badge animate-fade-in">
            <span className="hero-badge-dot"></span>
            <span>DIALECTIC AI WORKSPACE</span>
          </div>

          <h1 className="hero-main-title animate-reveal-up">
            Different Minds.<br />
            <span className="hero-glow-text">One Arena.</span>
          </h1>

          <p className="hero-supporting-title animate-reveal-up delay-1">
            What Happens When AI Challenges AI?
          </p>

          <p className="hero-description-text animate-reveal-up delay-2">
            Bring different AI models into one arena. Compare their reasoning, challenge their answers, and discover one consolidated response.
          </p>

          <div className="hero-actions-row animate-reveal-up delay-3">
            <Link to="/app/arena/new">
              <Button variant="primary" size="lg" className="hero-primary-btn" icon="⚔">
                Enter the Arena
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="hero-secondary-btn">
                Explore How It Works →
              </Button>
            </Link>
          </div>

          <div className="hero-trust-row animate-fade-in delay-3">
            <span className="trust-label">Compatible with leading foundational model profiles:</span>
            <div className="trust-model-chips">
              <span className="t-chip">ChatGPT</span>
              <span className="t-chip">Gemini</span>
              <span className="t-chip">Claude</span>
              <span className="t-chip">Llama</span>
              <span className="t-chip">Mistral</span>
              <span className="t-chip">Grok</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Animated AI Arena Visual Showcase */}
      <section className="section-arena-visual">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">LIVE DEMONSTRATION</span>
            <h2 className="section-title">The Dialectic Arena in Action</h2>
            <p className="section-desc">
              Watch how two distinct models examine the question: <em>"Should an early-stage startup adopt Microservices or a Modular Monolith?"</em>
            </p>
          </div>

          <div className="arena-interactive-card">
            {/* Arena Top Bar */}
            <div className="arena-card-topbar">
              <div className="arena-status-group">
                <span className="status-live-dot"></span>
                <span className="status-live-text">ROUND 2 OF 3 · CROSS-EXAMINATION</span>
              </div>
              <div className="arena-model-pills">
                <span className="model-pill pill-gpt">ChatGPT (GPT-5)</span>
                <span className="vs-connector">VS</span>
                <span className="model-pill pill-claude">Claude (Sonnet 4.5)</span>
              </div>
            </div>

            {/* Arena Clash Streams */}
            <div className="arena-clash-body">
              <div className="clash-column col-left">
                <div className="fighter-badge fighter-gpt">
                  <span className="f-icon">✦</span>
                  <span className="f-name">ChatGPT</span>
                  <span className="f-role">Initial Defense</span>
                </div>
                <div className="clash-speech-bubble">
                  <p>
                    "Microservices decouple continuous deployments and allow independent team velocity. If your startup anticipates rapid scaling across distinct domains, establishing boundaries early prevents costly refactors."
                  </p>
                </div>
              </div>

              {/* Dynamic Center Clash Indicator */}
              <div className="clash-center-dialectic">
                <div className="dialectic-pulse-ring"></div>
                <span className="dialectic-vs">VS</span>
                <div className="dialectic-arrows">⮂ ⮃</div>
              </div>

              <div className="clash-column col-right">
                <div className="fighter-badge fighter-claude">
                  <span className="f-icon">🛡</span>
                  <span className="f-name">Claude</span>
                  <span className="f-role">Cross-Examination</span>
                </div>
                <div className="clash-speech-bubble">
                  <p>
                    "That advice overlooks operational drag. A seed startup with 6 engineers will waste 40% of sprint capacity managing gRPC interfaces, network latency, and distributed traces. A Modular Monolith yields identical boundaries with zero deployment penalty."
                  </p>
                </div>
              </div>
            </div>

            {/* Final Consolidated Synthesis Card */}
            <div className="arena-synthesis-verdict">
              <div className="verdict-header">
                <div className="verdict-title-group">
                  <span className="verdict-star">★</span>
                  <h4 className="verdict-heading">Consolidated Dialectic Synthesis</h4>
                </div>
                <span className="confidence-pill">94% Consensus Score</span>
              </div>
              <div className="verdict-body">
                <p className="verdict-takeaway">
                  <strong>Unified Conclusion:</strong> Build a <strong>Modular Monolith</strong> now with strict directory-level boundary enforcement. Only bifurcate a service into an autonomous microservice when that specific module experiences 10x differential traffic or requires dedicated hardware acceleration.
                </p>
              </div>
              <div className="verdict-footer">
                <span className="tensions-tag">Resolved: Operational Tax vs Boundary Integrity</span>
                <Link to="/app/arena/new" className="try-arena-link">
                  Launch Custom Battle with this Prompt →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Product Benefits */}
      <section className="section-benefits">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">WHY SANGRAM AI</span>
            <h2 className="section-title">Rethinking How We Reason With AI</h2>
            <p className="section-desc">
              Moving beyond the echo-chamber of single-model chatbots.
            </p>
          </div>

          <div className="benefits-grid">
            {benefits.map((b) => (
              <div key={b.num} className="benefit-card">
                <div className="benefit-top">
                  <span className="benefit-num">{b.num}</span>
                  <span className="benefit-icon">{b.icon}</span>
                </div>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: How It Works */}
      <section className="section-how-it-works">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">WORKFLOW</span>
            <h2 className="section-title">From Question to Consolidated Truth</h2>
            <p className="section-desc">Four deliberate stages designed to extract high-conviction insights.</p>
          </div>

          <div className="steps-connected-grid">
            {steps.map((st, idx) => (
              <div key={st.step} className="step-card">
                <div className="step-indicator">
                  <span className="step-num">{st.step}</span>
                  {idx < steps.length - 1 && <span className="step-connector-line"></span>}
                </div>
                <h3 className="step-title">{st.title}</h3>
                <p className="step-desc">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Model Showcase */}
      <section className="section-models-showcase">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">THE COMBATANTS</span>
            <h2 className="section-title">Six World-Class Model Profiles</h2>
            <p className="section-desc">
              Each tuned with distinct epistemic traits, strengths, and reasoning styles.
            </p>
          </div>

          <div className="models-showcase-grid">
            {models.map((m) => (
              <div
                key={m.id}
                className="showcase-model-card"
                style={{ '--model-accent': m.accent.color }}
              >
                <div className="model-card-top">
                  <span className="m-accent-dot" style={{ backgroundColor: m.accent.color }}></span>
                  <span className="m-name">{m.name}</span>
                  <span className="m-badge">{m.provider}</span>
                </div>
                <div className="m-version">{m.modelLabel}</div>
                <p className="m-desc">{m.desc}</p>
                <div className="m-footer">
                  <span className="m-status-text">Ready in Arena</span>
                  <Link to="/app/arena/new" className="m-select-btn">Deploy →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Example Battle Preview */}
      <section className="section-example-battle">
        <div className="section-container">
          <div className="battle-preview-box">
            <div className="preview-header">
              <div>
                <span className="preview-tag">FEATURED ARCHITECTURAL DIALECTIC</span>
                <h3 className="preview-title">PostgreSQL with pgvector vs Dedicated Vector Databases</h3>
              </div>
              <Link to="/app/arena/new">
                <Button variant="secondary" size="sm">Run in Arena ↗</Button>
              </Link>
            </div>
            <div className="preview-quote-grid">
              <div className="quote-col">
                <span className="quote-speaker speaker-gemini">Gemini 2.5 Pro (Multimodal)</span>
                <p>
                  "For 90% of RAG architectures, maintaining database transactions and relational joins alongside embeddings in PostgreSQL eliminates network sync issues."
                </p>
              </div>
              <div className="quote-col">
                <span className="quote-speaker speaker-llama">Llama 4 (Systems Engineer)</span>
                <p>
                  "Agreed up to 10M embeddings. Beyond that, specialized HNSW indexing and distributed cache layers justify dedicated vector infrastructure."
                </p>
              </div>
            </div>
            <div className="preview-synthesis-summary">
              <strong>Consensus:</strong> Start with PostgreSQL pgvector; partition by tenant ID until query latency p99 exceeds 45ms.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Pricing Preview */}
      <section className="section-pricing-preview">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">TRANSPARENT PLANS</span>
            <h2 className="section-title">Built for Curious Minds and Engineering Teams</h2>
            <p className="section-desc">Choose a tier that matches your dialectic volume.</p>
          </div>

          <div className="pricing-cards-grid">
            {plans.slice(0, 3).map((plan) => (
              <div key={plan.id} className={`pricing-card ${plan.popular ? 'card-featured' : ''}`}>
                {plan.badge && <span className="plan-badge">{plan.badge}</span>}
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-tagline">{plan.tagline}</p>
                <div className="plan-price-row">
                  <span className="price-num">${plan.price.monthly}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
                <ul className="plan-feature-list">
                  {plan.features.slice(0, 5).map((f, i) => (
                    <li key={i} className={f.included ? 'feat-yes' : 'feat-no'}>
                      <span>{f.included ? '✓' : '—'}</span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link to={plan.ctaLink} className="plan-cta-wrapper">
                  <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/pricing" className="view-full-pricing-link">
              View full plan matrix & feature comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ Section */}
      <section className="section-faq">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">GOT QUESTIONS?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc">Everything you need to know about dialectic battles.</p>
          </div>

          <div className="faq-accordion-list">
            {mockFaqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => setActiveFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
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
      </section>

      {/* SECTION 10: Final CTA */}
      <section className="section-final-cta">
        <div className="section-container">
          <div className="final-cta-card">
            <div className="cta-ambient-glow"></div>
            <h2 className="cta-headline">Ready to Enter the Arena?</h2>
            <p className="cta-desc">
              Bring different perspectives together and explore a better answer. Start your first multi-model battle now.
            </p>
            <div className="cta-btn-group">
              <Link to="/app/arena/new">
                <Button variant="primary" size="lg" icon="⚔">
                  Enter the Arena Now
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button variant="outline" size="lg">
                  Create Free Account
                </Button>
              </Link>
            </div>
            <span className="cta-sub-note">No credit card required · Free tier available</span>
          </div>
        </div>
      </section>
    </div>
  );
};
