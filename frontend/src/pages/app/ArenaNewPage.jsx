import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { models } from '../../data/models';
import { archetypes } from '../../data/archetypes';
import { useToast } from '../../context/ToastContext';
import { mockBattleService } from '../../services/mock/mockBattleService';
import { Button } from '../../components/common/Button';

export const ArenaNewPage = () => {
  const [modelA, setModelA] = useState('chatgpt');
  const [modelB, setModelB] = useState('claude');
  const [archetypeA, setArchetypeA] = useState('first_principles');
  const [archetypeB, setArchetypeB] = useState('devils_advocate');
  const [prompt, setPrompt] = useState('Microservices vs Modular Monolith for an early-stage B2B SaaS startup?');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const samplePrompts = [
    {
      label: 'Microservices vs Monolith',
      q: 'Microservices vs Modular Monolith for an early-stage B2B SaaS startup?'
    },
    {
      label: 'PostgreSQL vs Vector DB',
      q: 'Should our startup start with pgvector in Postgres or provision a managed Pinecone cluster?'
    },
    {
      label: 'Python vs Rust for AI',
      q: 'Python vs Rust for high-throughput LLM streaming inference pipelines?'
    }
  ];

  const handleStartBattle = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showToast('Please enter a question or dilemma for the arena.', 'warn');
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

  return (
    <div className="arena-new-page-view">
      <div className="arena-setup-header">
        <h1 className="setup-title">Deploy Dialectic Combatants</h1>
        <p className="setup-sub">
          Select two distinct model architectures, set their cognitive lenses, and pose your technical or strategic dilemma.
        </p>
      </div>

      <form onSubmit={handleStartBattle} className="arena-setup-form mt-6">
        {/* Step 1: The Dilemma Input */}
        <div className="setup-card">
          <label className="field-label" htmlFor="prompt-input">
            1. What question or dilemma should the models debate?
          </label>
          <textarea
            id="prompt-input"
            className="clean-textarea"
            rows="3"
            placeholder="E.g., Microservices vs Modular Monolith for an early-stage startup?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />

          <div className="quick-prompts-row mt-2">
            <span className="quick-prompts-label">Try sample:</span>
            {samplePrompts.map((sp) => (
              <button
                key={sp.label}
                type="button"
                className="sample-prompt-chip"
                onClick={() => setPrompt(sp.q)}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: The Two Combatants */}
        <div className="setup-card mt-6">
          <label className="field-label">2. Select Combatants & Perspectives</label>

          <div className="combatants-split-grid mt-3">
            {/* Combatant A */}
            <div className="combatant-box">
              <span className="box-badge-label">Combatant 01 · Thesis</span>
              <div className="input-group mt-2">
                <label className="select-sublabel">Model</label>
                <select
                  className="clean-select"
                  value={modelA}
                  onChange={(e) => setModelA(e.target.value)}
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.id === modelB}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group mt-3">
                <label className="select-sublabel">Cognitive Perspective</label>
                <select
                  className="clean-select"
                  value={archetypeA}
                  onChange={(e) => setArchetypeA(e.target.value)}
                >
                  {archetypes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — {a.lens}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="combatant-vs-divider">
              <span className="vs-tag">VS</span>
            </div>

            {/* Combatant B */}
            <div className="combatant-box">
              <span className="box-badge-label">Combatant 02 · Counter-Examiner</span>
              <div className="input-group mt-2">
                <label className="select-sublabel">Model</label>
                <select
                  className="clean-select"
                  value={modelB}
                  onChange={(e) => setModelB(e.target.value)}
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.id === modelA}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group mt-3">
                <label className="select-sublabel">Cognitive Perspective</label>
                <select
                  className="clean-select"
                  value={archetypeB}
                  onChange={(e) => setArchetypeB(e.target.value)}
                >
                  {archetypes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — {a.lens}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Optional Constraints */}
        <div className="setup-card mt-6">
          <label className="field-label" htmlFor="context-input">
            3. Context or Constraints <span className="text-muted text-xs">(optional)</span>
          </label>
          <input
            id="context-input"
            type="text"
            className="clean-input mt-2"
            placeholder="E.g., Team size: 5 engineers, 2-year runway, strict latency SLAs."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <div className="setup-action-row mt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full launch-battle-btn"
            loading={loading}
            icon="⚔"
          >
            Launch Dialectic Battle
          </Button>
        </div>
      </form>
    </div>
  );
};
