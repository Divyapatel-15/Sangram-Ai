import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { models } from '../../data/models';
import { archetypes } from '../../data/archetypes';
import { useToast } from '../../context/ToastContext';
import { mockBattleService } from '../../services/mock/mockBattleService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input, Textarea } from '../../components/common/Input';

export const ArenaNewPage = () => {
  const [modelA, setModelA] = useState('chatgpt');
  const [modelB, setModelB] = useState('claude');
  const [archetypeA, setArchetypeA] = useState('first_principles');
  const [archetypeB, setArchetypeB] = useState('devils_advocate');
  const [prompt, setPrompt] = useState('Microservices vs Modular Monolith for an early-stage B2B SaaS startup?');
  const [context, setContext] = useState('Team size: 6 engineers. Goal: Rapid MVP deployment with scalable domain boundaries.');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const samplePrompts = [
    {
      label: 'Microservices vs Monolith',
      q: 'Microservices vs Modular Monolith for an early-stage B2B SaaS startup?',
      ctx: 'Team size: 6 engineers. Goal: Rapid MVP deployment with scalable domain boundaries.'
    },
    {
      label: 'PostgreSQL vs Vector DB',
      q: 'Should our startup start with pgvector in Postgres or provision a managed Pinecone cluster?',
      ctx: 'Under 5M document vectors, high relational query dependency.'
    },
    {
      label: 'Python vs Rust for AI',
      q: 'Python vs Rust for high-throughput LLM streaming inference pipelines?',
      ctx: 'Need sub-20ms p99 token latency with high concurrent web traffic.'
    }
  ];

  const handleStartBattle = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showToast('Please enter a question or topic for the arena.', 'warn');
      return;
    }
    if (modelA === modelB) {
      showToast('Please choose two different models to debate.', 'warn');
      return;
    }

    try {
      setLoading(true);
      const battle = await mockBattleService.createBattle({
        modelA,
        modelB,
        archetypeA,
        archetypeB,
        prompt,
        context
      });
      showToast('Combatants deployed to War Room!', 'success');
      navigate(`/app/arena/${battle.id}`);
    } catch (err) {
      showToast(err.message || 'Failed to start battle.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getModelObj = (id) => models.find(m => m.id === id);

  return (
    <div className="arena-new-page-view">
      <div className="arena-setup-header">
        <div className="setup-title-group">
          <span className="setup-badge">⚡ CHAMBER CONFIGURATION</span>
          <h1 className="setup-main-title">Deploy Dialectic Combatants</h1>
          <p className="setup-sub-text">
            Configure two distinct AI model profiles, assign cognitive lenses, and submit your dilemma.
          </p>
        </div>
      </div>

      <form onSubmit={handleStartBattle} className="arena-setup-form">
        {/* Combatant Selection Stage */}
        <div className="combatants-matchup-stage">
          {/* Fighter A Slot */}
          <div className="fighter-slot-card slot-left">
            <div className="slot-badge">Combatant 01 (Thesis)</div>
            <div className="slot-selector">
              <label className="slot-label">Select Model Architecture</label>
              <select
                className="select-model-dropdown"
                value={modelA}
                onChange={(e) => setModelA(e.target.value)}
              >
                {models.map(m => (
                  <option key={m.id} value={m.id} disabled={m.id === modelB}>
                    {m.name} ({m.provider} · {m.modelLabel})
                  </option>
                ))}
              </select>
            </div>

            <div className="slot-selector mt-4">
              <label className="slot-label">Cognitive Lens / Archetype</label>
              <select
                className="select-model-dropdown"
                value={archetypeA}
                onChange={(e) => setArchetypeA(e.target.value)}
              >
                {archetypes.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {getModelObj(modelA) && (
              <div className="slot-model-preview mt-4">
                <span className="dot" style={{ backgroundColor: getModelObj(modelA).accent.color }}></span>
                <span className="desc">{getModelObj(modelA).desc}</span>
              </div>
            )}
          </div>

          {/* Central VS Badge */}
          <div className="clash-vs-divider">
            <div className="vs-circle">VS</div>
            <div className="vs-line"></div>
          </div>

          {/* Fighter B Slot */}
          <div className="fighter-slot-card slot-right">
            <div className="slot-badge">Combatant 02 (Challenger)</div>
            <div className="slot-selector">
              <label className="slot-label">Select Model Architecture</label>
              <select
                className="select-model-dropdown"
                value={modelB}
                onChange={(e) => setModelB(e.target.value)}
              >
                {models.map(m => (
                  <option key={m.id} value={m.id} disabled={m.id === modelA}>
                    {m.name} ({m.provider} · {m.modelLabel})
                  </option>
                ))}
              </select>
            </div>

            <div className="slot-selector mt-4">
              <label className="slot-label">Cognitive Lens / Archetype</label>
              <select
                className="select-model-dropdown"
                value={archetypeB}
                onChange={(e) => setArchetypeB(e.target.value)}
              >
                {archetypes.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {getModelObj(modelB) && (
              <div className="slot-model-preview mt-4">
                <span className="dot" style={{ backgroundColor: getModelObj(modelB).accent.color }}></span>
                <span className="desc">{getModelObj(modelB).desc}</span>
              </div>
            )}
          </div>
        </div>

        {/* Question & Context Input Card */}
        <Card className="question-input-card mt-8">
          <div className="quick-presets-row">
            <span className="preset-label">Quick Prompts:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-pill-btn"
                onClick={() => {
                  setPrompt(p.q);
                  setContext(p.ctx);
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <Textarea
              label="The Core Question / Dilemma"
              rows={3}
              placeholder="What question or architectural dispute should the models confront?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="System Context & Constraints (Optional)"
              rows={2}
              placeholder="E.g. team size, traffic constraints, compliance requirements, latency targets..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <div className="submit-battle-row mt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full start-arena-btn"
              loading={loading}
              icon="⚔"
            >
              Start Battle in War Room
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
