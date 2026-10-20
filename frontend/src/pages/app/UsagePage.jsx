import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const UsagePage = () => {
  const modelBreakdown = [
    { name: 'Claude Sonnet 3.5', battles: 58, tokens: '720K', pct: 40, color: '#00D9FF' },
    { name: 'ChatGPT (GPT-4o)', battles: 46, tokens: '540K', pct: 30, color: '#34D399' },
    { name: 'Gemini 2.5 Pro', battles: 22, tokens: '310K', pct: 18, color: '#5B9DFF' },
    { name: 'Llama 4', battles: 16, tokens: '230K', pct: 12, color: '#9B9CFF' }
  ];

  return (
    <div className="usage-page-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Token & Compute Telemetry</h1>
          <p className="page-sub">
            Track token consumption, battle credits, and compute distribution across your active cycle.
          </p>
        </div>
        <Link to="/app/billing">
          <Button variant="primary">Manage Quota</Button>
        </Link>
      </div>

      {/* Main Quota Meter */}
      <div className="usage-meter-box mt-6">
        <div className="meter-header-row">
          <div>
            <span className="clean-label-sm">CURRENT BILLING CYCLE (PRO DIALECTIC TIER)</span>
            <h3 className="meter-heading mt-1">420 of 1,000 Battle Credits Consumed</h3>
          </div>
          <span className="quota-percent-pill">42% Used</span>
        </div>

        <div className="clean-progress-bar mt-4">
          <div className="clean-progress-fill" style={{ width: '42%' }}></div>
        </div>

        <div className="meter-footer-info mt-3">
          <span>580 Credits Remaining · Resets in 11 days</span>
          <span className="text-muted">Zero-data retention verified</span>
        </div>
      </div>

      {/* Consumption Breakdown Table */}
      <div className="clean-card-box mt-6">
        <h3 className="box-title">Compute Breakdown by Model Profile</h3>
        <p className="box-sub">Distribution of dialectic tokens synthesized during this billing cycle.</p>

        <div className="breakdown-clean-list mt-4">
          {modelBreakdown.map((item) => (
            <div key={item.name} className="breakdown-clean-row">
              <div className="col-model">
                <span className="clean-dot" style={{ backgroundColor: item.color }}></span>
                <span className="model-row-name">{item.name}</span>
              </div>
              <div className="col-bar">
                <div className="mini-bar-track">
                  <div
                    className="mini-bar-fill"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
              <div className="col-stats">
                <span className="stat-battles">{item.battles} Battles</span>
                <span className="stat-tokens">{item.tokens} tokens</span>
                <span className="stat-pct">{item.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
