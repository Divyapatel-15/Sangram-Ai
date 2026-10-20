import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const HowItWorksPage = () => {
  const workflowStages = [
    {
      num: '01',
      title: 'Select Combatant Models',
      desc: 'Pick the models whose perspectives you want to juxtapose. Choose between OpenAI (ChatGPT), Anthropic (Claude), Google (Gemini), Meta (Llama), Mistral AI, or xAI (Grok). Optionally assign cognitive archetypes like "The Pragmatic Engineer" or "The Devil’s Advocate" to enforce divergent thinking.',
      visual: 'Model Selection Matrix: GPT-5 (Thesis) vs Claude 4.5 (Challenger)'
    },
    {
      num: '02',
      title: 'Submit Question & Context',
      desc: 'Input your core question alongside system constraints, code snippets, or business parameters. The Arena distributes the query simultaneously to all selected fighter nodes with zero mutual knowledge in the initial round.',
      visual: 'Question Prompt + Optional Boundary Criteria'
    },
    {
      num: '03',
      title: 'Adversarial Debate & Cross-Examination',
      desc: 'The models enter the dialectic chamber. Round 1 yields independent claims. In Round 2, each model reads the others’ arguments, pointing out logical fallacies, edge-case vulnerabilities, and operational taxes. In Round 3, models revise their stances in light of legitimate criticisms.',
      visual: 'Round 1 Claims → Round 2 Cross-Examine → Round 3 Defense'
    },
    {
      num: '04',
      title: 'Consolidated Synthesis & Verdict',
      desc: 'Our Dialectic Engine analyzes convergence points across all rounds. It filters out rhetorical posturing, isolates irreconcilable trade-offs, computes an objective consensus score, and outputs one single actionable verdict.',
      visual: 'Consensus Score (94%) + Unified Decision + Trade-off Matrix'
    }
  ];

  return (
    <div className="how-it-works-view">
      <div className="page-hero-banner">
        <div className="section-container text-center">
          <span className="section-tag">METHODOLOGY</span>
          <h1 className="page-hero-title">How the Dialectic Engine Works</h1>
          <p className="page-hero-sub">
            A structured four-step dialectic process that replaces solitary guesswork with adversarial synthesis.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="workflow-timeline">
          {workflowStages.map((stage, i) => (
            <div key={stage.num} className="workflow-step-card">
              <div className="step-left">
                <span className="step-badge-large">{stage.num}</span>
                {i < workflowStages.length - 1 && <div className="step-stem-line"></div>}
              </div>
              <div className="step-right">
                <h3 className="step-stage-title">{stage.title}</h3>
                <p className="step-stage-desc">{stage.desc}</p>
                <div className="step-mock-visual">
                  <span className="visual-tag">Visual Protocol:</span>
                  <span className="visual-detail">{stage.visual}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="interactive-try-banner mt-12 text-center">
          <h3>Experience the Battle in Real Time</h3>
          <p>Try our interactive prototype with sample architectural debates.</p>
          <div className="mt-4">
            <Link to="/app/arena/new">
              <Button variant="primary" size="lg" icon="⚔">
                Launch Arena Session
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
