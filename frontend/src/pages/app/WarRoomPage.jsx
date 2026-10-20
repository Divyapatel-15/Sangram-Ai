import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockBattlesList } from '../../data/mockBattles';
import { mockSavedService } from '../../services/mock/mockSavedService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const WarRoomPage = () => {
  const [selectedBattleId, setSelectedBattleId] = useState(mockBattlesList[0].id);
  const [currentRound, setCurrentRound] = useState(2); // 1: Claims, 2: Cross-Examine, 3: Defend, 4: Verdict
  const [isPaused, setIsPaused] = useState(false);
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  const battle = mockBattlesList.find(b => b.id === selectedBattleId) || mockBattlesList[0];

  const handleCopyVerdict = () => {
    const text = `SANGRAM AI DIALECTIC VERDICT\nTopic: ${battle.title}\nConsensus Score: ${battle.consensusScore || 94}%\n\nConsolidated Synthesis:\n${battle.summary}\n\nGenerated in Sangram AI War Room.`;
    navigator.clipboard?.writeText(text);
    showToast('Consensus verdict copied to clipboard!', 'success');
  };

  const handleSaveToADR = async () => {
    await mockSavedService.saveAnswer({
      battleId: battle.id,
      title: `${battle.title} (ADR)`,
      question: battle.title,
      verdict: battle.summary,
      modelsUsed: ['Claude 3.5 Sonnet', 'GPT-4o', 'Gemini 2.5 Pro']
    });
    setSaved(true);
    showToast('Saved to your Architectural Decision Records (ADRs)!', 'success');
  };

  const debateRounds = [
    {
      round: 1,
      title: 'Initial Claims (Thesis)',
      speaker: 'Claude 3.5 Sonnet',
      role: 'Thesis Author',
      provider: 'Anthropic',
      color: '#00D9FF',
      text: 'A Modular Monolith is the strictly superior choice for an early-stage startup. Incurring network latency, distributed transactions, and Docker orchestration overhead across 6 engineers burns valuable runway before product-market fit is established.'
    },
    {
      round: 2,
      title: 'Cross-Examination (Antithesis)',
      speaker: 'ChatGPT (GPT-4o)',
      role: 'Cross-Examiner',
      provider: 'OpenAI',
      color: '#34D399',
      text: 'While monolithic simplicity is real, modular codebases quickly suffer from leaky boundaries and coupled database schemas unless enforced by hard process. If two engineers write overlapping queries to the same table, you will end up with an unmaintainable distributed monolith.'
    },
    {
      round: 3,
      title: 'Empirical Defense & Synthesis Lensing',
      speaker: 'Gemini 2.5 Pro',
      role: 'Empirical Arbiter',
      provider: 'Google',
      color: '#5B9DFF',
      text: 'Empirical data from 400+ SaaS startups shows that compile-time linting (e.g. nx or ts-project-references) enforces 95% of schema isolation with 0 network operations. Only 4% of startups ever require separate microservice deployments before reaching 50 engineers.'
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

        {/* Header Actions */}
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
              New Arena Battle
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
                <span className="consensus-num">94%</span>
                <span className="consensus-sub">Consensus</span>
              </div>
            </div>

            <h3 className="verdict-card-title">Dialectic Recommendation</h3>

            <div className="verdict-text-box">
              <p>
                <strong>Consolidated Decision:</strong> Adopt a <strong>Modular Monolith</strong>. Enforce domain boundaries via linter rules rather than network boundaries. Maintain shared deployment velocity until individual service traffic diverges by 10x.
              </p>
            </div>

            <div className="tensions-box">
              <span className="tensions-label">Key Tensions Resolved:</span>
              <div className="tensions-tag-row">
                <span className="clean-tension-tag">Deployment Tax vs. Boundary Discipline</span>
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
