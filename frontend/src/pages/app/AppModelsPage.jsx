import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { models } from '../../data/models';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AppModelsPage = () => {
  const [selectedIds, setSelectedIds] = useState(['chatgpt', 'claude']);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter(m => m !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="app-models-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Model Roster & Intelligence Catalog</h1>
          <p className="page-sub">
            The six foundational architectures available for deployment into your dialectic war room.
          </p>
        </div>
        <Link to={`/app/arena/new?m1=${selectedIds[0] || 'chatgpt'}&m2=${selectedIds[1] || 'claude'}`}>
          <Button variant="primary" icon="⚔">
            Launch Battle ({selectedIds.length} Selected)
          </Button>
        </Link>
      </div>

      <div className="models-app-grid mt-6">
        {models.map((m) => {
          const isSelected = selectedIds.includes(m.id);
          return (
            <Card
              key={m.id}
              className={`model-catalog-card ${isSelected ? 'is-active' : ''}`}
              style={{ '--model-color': m.accent.color }}
            >
              <div className="model-cat-header">
                <div className="cat-brand-wrap">
                  <span className="cat-color-dot" style={{ backgroundColor: m.accent.color }}></span>
                  <div>
                    <h3 className="cat-name">{m.name}</h3>
                    <span className="cat-provider">{m.provider} · {m.modelLabel}</span>
                  </div>
                </div>
                <Badge variant={isSelected ? 'cyan' : 'default'} size="sm">
                  {isSelected ? 'Active Slot' : 'Available'}
                </Badge>
              </div>

              <p className="cat-desc">{m.desc}</p>

              <div className="cat-specs-block">
                <div className="spec-row">
                  <span className="spec-label">Provider Alignment:</span>
                  <span className="spec-val">{m.provider} Foundation</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Arena Role:</span>
                  <span className="spec-val">Thesis / Cross-Examiner</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Chamber Status:</span>
                  <span className="spec-val text-success">Online (Simulated)</span>
                </div>
              </div>

              <div className="cat-card-footer mt-4">
                <Button
                  variant={isSelected ? 'secondary' : 'outline'}
                  size="sm"
                  className="w-full"
                  onClick={() => toggleSelect(m.id)}
                >
                  {isSelected ? '✓ Selected in Arena Roster' : '+ Select for Arena'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
