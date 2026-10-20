import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockBattleService } from '../../services/mock/mockBattleService';
import { mockSavedService } from '../../services/mock/mockSavedService';
import { models } from '../../data/models';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const DashboardHome = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [recentBattles, setRecentBattles] = useState([]);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [battles, saved] = await Promise.all([
          mockBattleService.getRecentBattles(),
          mockSavedService.getSavedAnswers()
        ]);
        setRecentBattles(battles.slice(0, 4));
        setSavedAnswers(saved.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    showToast('Copied synthesis to clipboard!', 'success');
  };

  return (
    <div className="dashboard-home-view">
      {/* Welcome Hero Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-text-col">
          <Link to="/app/war-room" className="welcome-eyebrow">
            <span className="live-dot"></span>
            <span>DIALECTIC WAR ROOM ACTIVE · ENTER CHAMBER →</span>
          </Link>
          <h1 className="welcome-heading">
            Welcome back, {user?.name || 'Explorer'}
          </h1>
          <p className="welcome-sub">
            Your multi-model arena is primed. Compare reasoning, challenge competing answers, and synthesize unified truth.
          </p>
        </div>

        <div className="welcome-cta-col flex items-center gap-3">
          <Link to="/app/war-room">
            <Button variant="secondary" size="lg" icon="🕸">
              Live War Room
            </Button>
          </Link>
          <Link to="/app/arena">
            <Button variant="primary" size="lg" icon="⚔">
              Start New Battle
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics & Quota Row */}
      <div className="dashboard-stats-grid">
        <Card className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Battles Conducted</span>
            <span className="stat-icon">⚔</span>
          </div>
          <div className="stat-number">{user?.stats?.totalBattles || 142}</div>
          <span className="stat-sub">Across 6 model profiles</span>
        </Card>

        <Card className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Clashes Resolved</span>
            <span className="stat-icon">✦</span>
          </div>
          <div className="stat-number">{user?.stats?.clashesResolved || 419}</div>
          <span className="stat-sub">Average consensus score: 93%</span>
        </Card>

        <Card className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tokens Synthesized</span>
            <span className="stat-icon">🧠</span>
          </div>
          <div className="stat-number">{user?.stats?.tokensSynthesized || '1.8M'}</div>
          <span className="stat-sub">Zero-data retention verified</span>
        </Card>

        <Card className="stat-card plan-stat-card">
          <div className="stat-header">
            <span className="stat-label">Current Plan</span>
            <Badge variant="cyan" size="sm">Active</Badge>
          </div>
          <div className="stat-number">Pro Dialectic</div>
          <div className="plan-usage-mini">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: '42%' }}></div>
            </div>
            <span className="usage-mini-text">420 / 1,000 monthly credits</span>
          </div>
          <Link to="/pricing" className="upgrade-link-text">Upgrade plan →</Link>
        </Card>
      </div>

      {/* Two Columns: Recent Battles & Saved Answers */}
      <div className="dashboard-main-grid mt-6">
        {/* Left Column: Recent Battles */}
        <div className="dashboard-col-left">
          <div className="section-title-bar">
            <div className="flex items-center gap-2">
              <span className="bar-icon">📜</span>
              <h3 className="bar-title">Recent Dialectic Battles</h3>
            </div>
            <Link to="/app/history" className="view-all-link">View all ({recentBattles.length}) →</Link>
          </div>

          <div className="recent-battles-list">
            {recentBattles.length === 0 ? (
              <Card className="empty-card text-center py-8">
                <p className="text-muted">No battles recorded yet. Launch your first arena session!</p>
                <div className="mt-4">
                  <Link to="/app/arena">
                    <Button variant="primary" size="sm">Start Battle</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              recentBattles.map((b) => (
                <Card key={b.id} hoverable className="battle-summary-card">
                  <div className="battle-card-header">
                    <span className="battle-topic-badge">{b.topic || 'Architecture'}</span>
                    <span className="battle-date-label">
                      {new Date(b.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h4 className="battle-card-title">
                    <Link to={`/app/arena/${b.id}`}>{b.title}</Link>
                  </h4>

                  <p className="battle-card-summary">{b.summary}</p>

                  <div className="battle-card-footer">
                    <div className="models-avatars-row">
                      {b.models?.map((mId) => {
                        const m = models.find((mod) => mod.id === mId);
                        return (
                          <span
                            key={mId}
                            className="mini-model-pill"
                            style={{ borderColor: m?.accent?.color || '#00D9FF' }}
                          >
                            {m?.name || mId}
                          </span>
                        );
                      })}
                    </div>

                    <div className="battle-actions">
                      {b.consensusScore && (
                        <span className="consensus-badge">
                          ★ {b.consensusScore}% Consensus
                        </span>
                      )}
                      <Link to={`/app/arena/${b.id}`}>
                        <Button variant="outline" size="sm">
                          Review →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Saved ADRs & Model Quick Launch */}
        <div className="dashboard-col-right">
          {/* Saved Answers Card */}
          <div className="section-title-bar">
            <div className="flex items-center gap-2">
              <span className="bar-icon">💾</span>
              <h3 className="bar-title">Saved Consensus ADRs</h3>
            </div>
            <Link to="/app/saved" className="view-all-link">View all →</Link>
          </div>

          <div className="saved-answers-list">
            {savedAnswers.map((s) => (
              <Card key={s.id} className="saved-answer-card">
                <div className="saved-top">
                  <h4 className="saved-title">{s.title}</h4>
                  <button
                    className="copy-icon-btn"
                    onClick={() => handleCopy(s.verdict)}
                    title="Copy ADR Verdict"
                  >
                    📋
                  </button>
                </div>
                <p className="saved-question">{s.question}</p>
                <div className="saved-footer">
                  <span className="saved-models-count">
                    {s.modelsUsed?.length} Models Synthesized
                  </span>
                  <Link to={`/app/arena/${s.battleId}`} className="inspect-link">
                    Open Chamber →
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Model Roster Quick Launch */}
          <div className="section-title-bar mt-6">
            <div className="flex items-center gap-2">
              <span className="bar-icon">🧠</span>
              <h3 className="bar-title">Arena Combatant Roster</h3>
            </div>
            <Link to="/app/models" className="view-all-link">Catalog →</Link>
          </div>

          <Card className="roster-quick-card">
            <div className="roster-pills-wrap">
              {models.map((m) => (
                <Link
                  key={m.id}
                  to={`/app/arena?model=${m.id}`}
                  className="roster-item-pill"
                  style={{ '--border-accent': m.accent.color }}
                >
                  <span className="dot" style={{ backgroundColor: m.accent.color }}></span>
                  <span className="name">{m.name}</span>
                  <span className="arrow">↗</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
