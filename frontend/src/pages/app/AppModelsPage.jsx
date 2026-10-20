import React from 'react';
import { Link } from 'react-router-dom';
import { models } from '../../data/models';
import { Button } from '../../components/common/Button';

export const AppModelsPage = () => {
  return (
    <div className="app-models-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Model Matrix & Roster</h1>
          <p className="page-sub">
            The foundational architectures available for deployment into your dialectic arena.
          </p>
        </div>
        <Link to="/app/arena">
          <Button variant="primary" icon="⚔">
            Launch New Arena Battle
          </Button>
        </Link>
      </div>

      <div className="models-clean-grid mt-6">
        {models.map((m) => (
          <div key={m.id} className="model-clean-card">
            <div className="model-clean-header">
              <div className="model-brand-info">
                <span className="clean-dot" style={{ backgroundColor: m.accent.color }}></span>
                <div>
                  <h3 className="model-clean-name">{m.name}</h3>
                  <span className="model-clean-provider">{m.provider} · {m.modelLabel}</span>
                </div>
              </div>
              <span className="simulated-status-pill">Simulated Node</span>
            </div>

            <p className="model-clean-desc">{m.desc}</p>

            <div className="model-specs-mini mt-4">
              <div className="spec-item">
                <span className="spec-k">Chamber Role:</span>
                <span className="spec-v">Thesis / Cross-Examiner</span>
              </div>
              <div className="spec-item">
                <span className="spec-k">Status:</span>
                <span className="spec-v text-cyan">Available in Arena</span>
              </div>
            </div>

            <div className="model-card-action mt-4">
              <Link to="/app/arena" className="w-full block">
                <Button variant="outline" size="sm" className="w-full">
                  Deploy in Arena →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
