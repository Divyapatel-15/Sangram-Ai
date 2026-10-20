import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const FeaturesPage = () => {
  const featureList = [
    {
      title: 'Multi-Model Dialectic Arena',
      desc: 'Deploy multiple AI models (OpenAI, Anthropic, Google, Meta, Mistral, xAI) into a shared interactive debate rather than relying on a solitary conversational agent.',
      icon: '⚔',
      badge: 'Core Engine'
    },
    {
      title: 'Structured Cross-Examination Rounds',
      desc: 'Debates execute in deliberate stages: Initial Theses → Cross-Examination & Critique → Defense & Revision → Final Consensus Synthesis.',
      icon: '🔄',
      badge: 'Multi-Round'
    },
    {
      title: 'Cognitive Archetypes',
      desc: 'Inject deliberate cognitive personas (The Devil’s Advocate, The Pragmatic Engineer, The First-Principles Purist) to prevent artificial agreement and maximize critical edge testing.',
      icon: '🧠',
      badge: 'Reasoning Lenses'
    },
    {
      title: 'Consolidated Consensus Verdict',
      desc: 'Our Dialectic Synthesis Engine synthesizes the points of agreement, separates legitimate architectural trade-offs, and scores confidence levels.',
      icon: '✦',
      badge: 'Automated Synthesis'
    },
    {
      title: 'Active Topology Network Graph',
      desc: 'Visualize dynamic attack vectors, critique clashes, and mutual concessions in an interactive constellation map inspired by Obsidian Precision tools.',
      icon: '🕸',
      badge: 'Interactive UI'
    },
    {
      title: 'Saved Decisions & ADR Export',
      desc: 'Save verified answers directly to your workspace repository or export them formatted as Architectural Decision Records (ADRs) in Markdown or JSON.',
      icon: '📁',
      badge: 'Export & Share'
    }
  ];

  return (
    <div className="features-page-view">
      <div className="page-hero-banner">
        <div className="section-container text-center">
          <span className="section-tag">ENGINEERING & CAPABILITIES</span>
          <h1 className="page-hero-title">Features Engineered for Deep Dialectics</h1>
          <p className="page-hero-sub">
            A purpose-built workspace designed to pit artificial intelligences against one another to arrive at higher-conviction answers.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="features-showcase-grid">
          {featureList.map((f, i) => (
            <div key={i} className="feature-block-card">
              <div className="feature-header-row">
                <span className="feature-icon-badge">{f.icon}</span>
                <span className="feature-category-badge">{f.badge}</span>
              </div>
              <h3 className="feature-block-title">{f.title}</h3>
              <p className="feature-block-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature Comparison Section */}
        <div className="feature-deepdive-card mt-12">
          <div className="deepdive-content">
            <span className="section-tag">THE PARADIGM SHIFT</span>
            <h3 className="deepdive-heading">Chatbot Silos vs Dialectic Arena</h3>
            <p className="deepdive-text">
              When you prompt a single AI model, you get a convincing answer shaped by its training biases. You have no way of knowing what counterarguments a competing model would raise. Sangram AI automates the adversarial review process.
            </p>
            <div className="deepdive-actions">
              <Link to="/app/arena/new">
                <Button variant="primary" icon="⚔">
                  Test Features in the Arena
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
