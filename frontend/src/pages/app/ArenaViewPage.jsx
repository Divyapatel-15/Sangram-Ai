import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockBattleService } from '../../services/mock/mockBattleService';
import { mockSavedService } from '../../services/mock/mockSavedService';
import { models } from '../../data/models';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const ArenaViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        <h3>Initializing War Room Dialectic Chamber...</h3>
      </div>
    );
  }

  return (
    <div className="war-room-view">
      {/* Sticky Stage Navigation & Controls Ribbon (Inspired by code.html) */}
      <section className="war-room-ribbon">
        <div className="ribbon-inner">
          <div className="ribbon-left">
            <div className="ribbon-status-pill">
              <span className={`status-pulse-dot ${isPaused ? 'paused' : 'live'}`}></span>
              <span className="status-label-text">
                {isPaused ? 'DEBATE PAUSED' : 'LIVE DIALECTIC'}
              </span>
            </div>
            <span className="ribbon-separator">/</span>
            <h2 className="ribbon-heading">
              WAR ROOM DEBATE · {battle.title}
            </h2>
          </div>

          {/* Timeline Stages */}
          <nav className="ribbon-stages-nav" aria-label="Debate progression">
            <button
              type="button"
              className={`stage-pill-btn ${currentRound === 1 ? 'active' : currentRound > 1 ? 'completed' : ''}`}
              onClick={() => setCurrentRound(1)}
            >
              <span>{currentRound > 1 ? '✓' : '1.'}</span>
              <span>Initial Claims</span>
            </button>
            <span className="stage-arrow">→</span>
            <button
              type="button"
              className={`stage-pill-btn ${currentRound === 2 ? 'active' : currentRound > 2 ? 'completed' : ''}`}
              onClick={() => setCurrentRound(2)}
            >
              <span>{currentRound > 2 ? '✓' : '2.'}</span>
              <span>Cross-Examine</span>
            </button>
            <span className="stage-arrow">→</span>
            <button
              type="button"
              className={`stage-pill-btn ${currentRound === 3 ? 'active' : currentRound > 3 ? 'completed' : ''}`}
              onClick={() => setCurrentRound(3)}
            >
              <span>{currentRound > 3 ? '✓' : '3.'}</span>
              <span>Defend & Revise</span>
            </button>
            <span className="stage-arrow">→</span>
            <button
              type="button"
              className={`stage-pill-btn stage-verdict ${currentRound === 4 ? 'active' : ''}`}
              onClick={() => setCurrentRound(4)}
            >
              <span>⚡</span>
              <span>Verdict</span>
            </button>
          </nav>

          {/* Controls */}
          <div className="ribbon-controls">
            <button
              type="button"
              className="ctrl-btn"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              type="button"
              className="ctrl-btn-primary"
              onClick={() => setCurrentRound(4)}
            >
              ⚡ Skip to Verdict
            </button>
          </div>
        </div>
      </section>

      {/* Main Dialectic Workspace Grid */}
      <div className="war-room-grid">
        {/* Left Column (8 cols): Topology Canvas + Debate Stream */}
        <div className="war-room-left-col">
          {/* Active Dialectic Topology Canvas (from template code.html) */}
          <section className="topology-card">
            <div className="topology-header">
              <div className="topology-title-row">
                <span className="hub-icon">🕸</span>
                <span className="topology-title">Active Dialectic Topology Constellation</span>
              </div>
              <div className="topology-meta">
                <span className="live-dot-green"></span>
                <span>Dynamic Graph · 3 Clashes Resolved</span>
              </div>
            </div>

            {/* Dynamic Interactive SVG Constellation */}
            <div className="constellation-canvas">
              <svg className="constellation-svg" viewBox="0 0 740 200" fill="none">
                <line x1="80" y1="100" x2="660" y2="100" stroke="#203954" strokeDasharray="3 3" opacity="0.4" />
                <line x1="260" y1="30" x2="480" y2="170" stroke="#203954" strokeDasharray="3 3" opacity="0.3" />

                {/* Attack Vector: Claude -> ChatGPT */}
                <path
                  d="M 170 85 C 230 40, 310 40, 370 85"
                  stroke="#00D9FF"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                {/* Secondary Vector: Gemini -> ChatGPT */}
                <path
                  d="M 570 85 C 510 40, 430 40, 370 85"
                  stroke="#4388FF"
                  strokeWidth="1.5"
                  opacity="0.7"
                />

                <circle cx="270" cy="57" r="4" fill="#00D9FF" />
                <circle cx="470" cy="57" r="4" fill="#4388FF" />
              </svg>

              {/* Active Vector Floating Tag */}
              <div className="active-vector-badge">
                <span className="vector-pulse"></span>
                <span className="vector-label">Active Vector:</span>
                <span className="vector-text">Claude challenging GPT-5 on distributed ops complexity</span>
              </div>

              {/* Model Node 1: Claude */}
              <div className="node-marker node-left">
                <div className="node-avatar bg-claude">C</div>
                <span className="node-name">Claude Sonnet 4.5</span>
                <span className="node-score">9.4 pts · Aggressor</span>
              </div>

              {/* Model Node 2: ChatGPT */}
              <div className="node-marker node-center">
                <div className="node-avatar bg-gpt">G</div>
                <span className="node-name">ChatGPT GPT-5</span>
                <span className="node-score">8.8 pts · Defending</span>
              </div>

              {/* Model Node 3: Gemini / Llama */}
              <div className="node-marker node-right">
                <div className="node-avatar bg-gemini">✦</div>
                <span className="node-name">Gemini 2.5 Pro</span>
                <span className="node-score">8.2 pts · Synthesizer</span>
              </div>
            </div>
          </section>

          {/* Shared Debate Timeline Stream */}
          <section className="debate-stream-section mt-6">
            <h3 className="stream-section-title">Dialectic Transcript & Exchange</h3>

            {/* Round 1: Claims */}
            <div className={`debate-exchange-card ${currentRound >= 1 ? 'revealed' : 'dimmed'}`}>
              <div className="exchange-header">
                <span className="exchange-round-tag">ROUND 1 · INITIAL THESES</span>
              </div>
              <div className="speech-entry speech-gpt">
                <div className="speaker-label">
                  <span className="dot dot-gpt"></span>
                  <strong>ChatGPT</strong> (GPT-5 · First Principles)
                </div>
                <p>
                  "For a B2B SaaS architecture, establishing bounded contexts via microservices prevents monolithic code rot. Team members can develop, test, and release services in isolation without blocking on monolith deployment queues."
                </p>
              </div>
            </div>

            {/* Round 2: Cross-Examination */}
            <div className={`debate-exchange-card ${currentRound >= 2 ? 'revealed' : 'dimmed'}`}>
              <div className="exchange-header">
                <span className="exchange-round-tag">ROUND 2 · CROSS-EXAMINATION & CHALLENGE</span>
              </div>
              <div className="speech-entry speech-claude">
                <div className="speaker-label">
                  <span className="dot dot-claude"></span>
                  <strong>Claude</strong> (Sonnet 4.5 · Devil’s Advocate)
                </div>
                <p>
                  "That proposition assumes an enterprise engineering force with dedicated platform operations. A 6-person engineering team running microservices faces massive cross-cutting overhead: distributed tracing, dual-write synchronization, gRPC schema churn, and latency cascades. You gain modularity but lose the company to operational paralysis."
                </p>
              </div>
            </div>

            {/* Round 3: Defense & Revision */}
            <div className={`debate-exchange-card ${currentRound >= 3 ? 'revealed' : 'dimmed'}`}>
              <div className="exchange-header">
                <span className="exchange-round-tag">ROUND 3 · REVISION & CONCESSION</span>
              </div>
              <div className="speech-entry speech-gpt">
                <div className="speaker-label">
                  <span className="dot dot-gpt"></span>
                  <strong>ChatGPT</strong> (Concession & Refinement)
                </div>
                <p>
                  "Conceded on team size constraints. A Modular Monolith—where module boundaries are enforced at compile-time via strict internal package structures without network serialization—yields 90% of the architectural discipline with 0% of the distributed networking tax."
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Consolidated Synthesis & Actions */}
        <div className="war-room-right-col">
          <Card className="synthesis-panel-card">
            <div className="panel-top">
              <span className="panel-badge">CONSENSUS VERDICT</span>
              <div className="score-pill">
                <span className="score-number">{battle.consensusScore || 94}%</span>
                <span className="score-sub">Confidence</span>
              </div>
            </div>

            <h3 className="verdict-card-title">Dialectic Recommendation</h3>

            <div className="verdict-prose-box">
              <p>
                <strong>Consolidated Architecture Decision:</strong> Adopt a <strong>Modular Monolith</strong> as the foundational pattern.
              </p>
              <ul className="verdict-bullet-list">
                <li>Enforce module boundaries strictly via linting/compiler rules rather than network boundaries.</li>
                <li>Maintain a unified PostgreSQL schema with isolated tables per module.</li>
                <li>Extract microservices only when an isolated workload demands distinct hardware (e.g. GPU compute) or when multiple squad deployments collide continuously.</li>
              </ul>
            </div>

            <div className="key-tensions-box">
              <span className="tensions-title">Unresolved Trade-offs:</span>
              <div className="tension-tag-pill">
                Blast radius of shared database vs operational simplicity
              </div>
            </div>

            <div className="verdict-actions-stack">
              <Button
                variant="primary"
                className="w-full"
                onClick={handleCopyVerdict}
              >
                📋 Copy ADR Verdict
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                onClick={handleSaveToADR}
                disabled={saved}
              >
                {saved ? '✓ Saved to Workspace' : '💾 Save as ADR Record'}
              </Button>

              <Link to="/app/arena/new" className="w-full block">
                <Button variant="outline" className="w-full">
                  ⚔ Try Another Battle
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
