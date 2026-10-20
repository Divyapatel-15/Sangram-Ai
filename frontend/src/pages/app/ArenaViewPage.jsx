import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBattleService } from '../../services/mock/mockBattleService';
import { mockSavedService } from '../../services/mock/mockSavedService';
import { models } from '../../data/models';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';

export const ArenaViewPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const [battle, setBattle] = useState(null);
  const [currentRound, setCurrentRound] = useState(2); // 1: Claims, 2: Cross-Examine, 3: Defend, 4: Verdict
  const [isPaused, setIsPaused] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadBattle = async () => {
      const b = await mockBattleService.getBattleById(id);
      setBattle(b);
    };
    loadBattle();
  }, [id]);

  const handleCopyVerdict = () => {
    if (!battle) return;
    const text = `SANGRAM AI DIALECTIC VERDICT\nTopic: ${battle.title}\nConsensus Score: ${battle.consensusScore || 94}%\n\nConsolidated Synthesis:\n${battle.summary || 'Consensus reached.'}\n\nGenerated in Sangram AI Arena.`;
    navigator.clipboard?.writeText(text);
    showToast('Consensus verdict copied to clipboard!', 'success');
  };

  const handleSaveToADR = async () => {
    if (!battle) return;
    await mockSavedService.saveAnswer({
      battleId: battle.id,
      title: `${battle.title} (ADR)`,
      question: battle.title,
      verdict: battle.summary,
      modelsUsed: battle.models?.map(mId => {
        const m = models.find(x => x.id === mId);
        return m ? m.name : mId;
      }) || ['ChatGPT', 'Claude']
    });
    setSaved(true);
    showToast('Saved to your Architectural Decision Records (ADR)!', 'success');
  };

  if (!battle) {
    return (
      <div className="arena-loading-screen py-16 text-center">
        <div className="btn-spinner mx-auto mb-4"></div>
        <p className="text-muted">Initializing War Room Dialectic Chamber...</p>
      </div>
    );
  }

  const modelAObj = models.find(m => m.id === battle.models?.[0]) || models[0];
  const modelBObj = models.find(m => m.id === battle.models?.[1]) || models[1];

  const debateRounds = [
    {
      round: 1,
      title: 'Initial Claims (Thesis)',
      speaker: modelAObj.name,
      role: 'Thesis Author',
      color: '#00D9FF',
      text: battle.timeline?.[0]?.claim || `Initial defense: A modular design minimizes operational friction and isolates domains cleanly. Early-stage startups cannot afford distributed deployment penalties.`
    },
    {
      round: 2,
      title: 'Cross-Examination (Counter-Critique)',
      speaker: modelBObj.name,
      role: 'Cross-Examiner',
      color: '#34D399',
      text: battle.timeline?.[1]?.critique || `Cross-examination: While simplicity is attractive, internal module boundaries degrade rapidly without hard network isolation. Team discipline alone rarely prevents shared-database anti-patterns.`
    },
    {
      round: 3,
      title: 'Dialectic Defense & Empirical Balancing',
      speaker: 'Gemini 2.5 Pro',
      role: 'Arbiter',
      color: '#5B9DFF',
      text: `Empirical arbitration: Automated linting rules and schema linters enforce 95% of module discipline at compile-time with 0 latency penalty. Dedicated microservices should only be deployed when a single component experiences 10x differential scaling.`
    }
  ];

  return (
    <div className="war-room-view">
      {/* 1. Clean Stage Ribbon */}
      <div className="war-room-header-bar">
        <div className="header-bar-left">
          <div className="status-indicator-pill">
            <span className={`live-dot ${isPaused ? 'paused' : ''}`}></span>
            <span>{isPaused ? 'DEBATE PAUSED' : 'LIVE DIALECTIC'}</span>
          </div>
          <h1 className="war-room-heading">{battle.title}</h1>
        </div>

        {/* 4 Clean Stages */}
        <div className="stage-nav-pillbox">
          <button
            type="button"
            className={`stage-step-btn ${currentRound === 1 ? 'active' : currentRound > 1 ? 'done' : ''}`}
            onClick={() => setCurrentRound(1)}
          >
            {currentRound > 1 ? '✓' : '1.'} Claims
          </button>
          <span className="step-arrow">→</span>
          <button
            type="button"
            className={`stage-step-btn ${currentRound === 2 ? 'active' : currentRound > 2 ? 'done' : ''}`}
            onClick={() => setCurrentRound(2)}
          >
            {currentRound > 2 ? '✓' : '2.'} Cross-Examine
          </button>
          <span className="step-arrow">→</span>
          <button
            type="button"
            className={`stage-step-btn ${currentRound === 3 ? 'active' : currentRound > 3 ? 'done' : ''}`}
            onClick={() => setCurrentRound(3)}
          >
            {currentRound > 3 ? '✓' : '3.'} Defense
          </button>
          <span className="step-arrow">→</span>
          <button
            type="button"
            className={`stage-step-btn stage-verdict-btn ${currentRound === 4 ? 'active' : ''}`}
            onClick={() => setCurrentRound(4)}
          >
            ⚡ Verdict
          </button>
        </div>

        {/* Actions */}
        <div className="header-bar-actions">
          <button
            type="button"
            className="ctrl-action-btn"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? '▶ Resume' : '❚❚ Pause'}
          </button>
          <Link to="/app/arena">
            <Button variant="primary" size="sm" icon="⚔">
              New Battle
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Focused Main Layout: Debate Stream on Left, Synthesis on Right */}
      <div className="war-room-content-grid mt-6">
        {/* Left: Connected Debate Stream */}
        <div className="debate-stream-column">
          <div className="column-title-bar">
            <h3 className="column-title">Dialectic Combat Progression</h3>
            <span className="text-muted text-xs">Round {currentRound} of 4</span>
          </div>

          <div className="debate-rounds-stack">
            {debateRounds.slice(0, currentRound).map((r) => (
              <div key={r.round} className="debate-round-box">
                <div className="round-box-header">
                  <div className="speaker-identity">
                    <span className="speaker-color-dot" style={{ backgroundColor: r.color }}></span>
                    <span className="speaker-name">{r.speaker}</span>
                    <span className="speaker-role-tag">{r.role}</span>
                  </div>
                  <span className="round-number-tag">Round 0{r.round}</span>
                </div>
                <p className="round-speech-text">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Synthesis Panel & ADR Action */}
        <div className="synthesis-column">
          <div className="synthesis-verdict-card">
            <div className="verdict-card-top">
              <span className="verdict-tag">CONSOLIDATED SYNTHESIS</span>
              <div className="consensus-meter">
                <span className="consensus-num">{battle.consensusScore || 94}%</span>
                <span className="consensus-sub">Consensus</span>
              </div>
            </div>

            <h3 className="verdict-card-title">Dialectic Recommendation</h3>

            <div className="verdict-text-box">
              <p>
                <strong>Consolidated Decision:</strong> {battle.summary || 'Build a Modular Monolith now with strict directory-level boundary enforcement. Only separate a service when differential scaling demands independent resource allocation.'}
              </p>
            </div>

            <div className="tensions-box">
              <span className="tensions-label">Key Tensions Resolved:</span>
              <div className="tensions-tag-row">
                <span className="clean-tension-tag">Deployment Drag vs. Boundary Discipline</span>
                <span className="clean-tension-tag">Schema Migration Simplicity</span>
              </div>
            </div>

            <div className="verdict-actions-row">
              <Button
                variant="primary"
                className="w-full"
                onClick={handleSaveToADR}
                disabled={saved}
              >
                {saved ? '✓ Saved to ADR Records' : '💾 Save as ADR Record'}
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={handleCopyVerdict}
              >
                📋 Copy Verdict Text
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
