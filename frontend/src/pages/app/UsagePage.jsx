import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const UsagePage = () => {
  const modelBreakdown = [
    { name: 'Claude Sonnet 4.5', battles: 58, tokens: '720K', pct: 40, color: '#E9A05E' },
    { name: 'ChatGPT GPT-5', battles: 46, tokens: '540K', pct: 30, color: '#35D6A4' },
    { name: 'Gemini 2.5 Pro', battles: 22, tokens: '310K', pct: 18, color: '#5B9DFF' },
    { name: 'Llama 4', battles: 16, tokens: '230K', pct: 12, color: '#9B9CFF' }
  ];

  return (
    <div className="usage-page-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Token & Dialectic Usage</h1>
          <p className="page-sub">
            Track token consumption, battle credits, and model breakdown across your billing cycle.
          </p>
        </div>
        <Link to="/pricing">
          <Button variant="primary">⚡ Upgrade Quota</Button>
        </Link>
      </div>

      {/* Main Quota Meter */}
      <Card className="usage-meter-card mt-6">
        <div className="meter-header">
          <div>
            <span className="meter-tag">BILLING CYCLE (OCT 01 - OCT 31, 2026)</span>
            <h3 className="meter-title">420 of 1,000 Battle Credits Used</h3>
          </div>
          <Badge variant="cyan" size="lg">42% Consumed</Badge>
        </div>

        <div className="quota-bar-track mt-4">
          <div className="quota-bar-fill" style={{ width: '42%' }}></div>
        </div>

        <div className="meter-footer mt-4">
          <span>580 Credits Remaining · Resets in 11 days</span>
          <span className="text-muted">Pro Dialectic Tier</span>
        </div>
      </Card>

      {/* Secondary Stats */}
      <div className="usage-stats-grid mt-6">
        <Card className="stat-card">
          <span className="stat-label">Total Synthesis Output</span>
          <div className="stat-number">1.8M Tokens</div>
          <span className="stat-sub">Across 142 total battles</span>
        </Card>

        <Card className="stat-card">
          <span className="stat-label">Average Tokens per Battle</span>
          <div className="stat-number">12.6K</div>
          <span className="stat-sub">3-round dialectic runs</span>
        </Card>

        <Card className="stat-card">
          <span className="stat-label">Saved ADR Records</span>
          <div className="stat-number">38 ADRs</div>
          <span className="stat-sub">Unlimited storage included</span>
        </Card>
      </div>

      {/* Model Breakdown List */}
      <Card className="model-breakdown-card mt-6">
        <h3 className="breakdown-title">Consumption Breakdown by Model</h3>
        <p className="breakdown-sub text-muted">Distribution of dialectic compute by fighter node.</p>

        <div className="breakdown-list mt-6">
          {modelBreakdown.map((item) => (
            <div key={item.name} className="breakdown-row">
              <div className="row-left">
                <span className="dot" style={{ backgroundColor: item.color }}></span>
                <span className="model-name-text">{item.name}</span>
              </div>
              <div className="row-center">
                <div className="mini-track">
                  <div
                    className="mini-fill"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
              <div className="row-right">
                <span className="battles-val">{item.battles} Battles</span>
                <span className="tokens-val">{item.tokens}</span>
                <span className="pct-val">{item.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
