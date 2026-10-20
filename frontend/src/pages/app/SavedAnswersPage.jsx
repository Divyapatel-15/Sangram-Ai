import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockSavedService } from '../../services/mock/mockSavedService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';

export const SavedAnswersPage = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSaved = async () => {
      const data = await mockSavedService.getSavedAnswers();
      setSavedItems(data);
      setLoading(false);
    };
    fetchSaved();
  }, []);

  const handleCopy = (verdict) => {
    navigator.clipboard?.writeText(verdict);
    showToast('ADR verdict copied to clipboard!', 'success');
  };

  const handleRemove = async (id) => {
    await mockSavedService.removeAnswer(id);
    setSavedItems(prev => prev.filter(i => i.id !== id));
    showToast('Removed from saved answers.', 'info');
  };

  const filtered = savedItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="saved-answers-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Saved Answers & ADRs</h1>
          <p className="page-sub">
            Your repository of synthesized architectural decisions, verified trade-offs, and consensus answers.
          </p>
        </div>
      </div>

      <div className="search-bar-wrap mt-6">
        <Input
          placeholder="Filter saved ADR records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="saved-grid mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon="💾"
            title="No Saved Answers"
            description="You haven't bookmarked any consensus verdicts yet. In any arena debate, click 'Save as ADR Record'."
            actionText="Go to Arena"
            onAction={() => window.location.href = '/app/arena/new'}
          />
        ) : (
          filtered.map((item) => (
            <Card key={item.id} className="saved-full-card">
              <div className="saved-card-header">
                <div>
                  <h3 className="saved-card-title">{item.title}</h3>
                  <p className="saved-card-question">"{item.question}"</p>
                </div>
                <button
                  type="button"
                  className="remove-saved-btn"
                  onClick={() => handleRemove(item.id)}
                  title="Remove from saved"
                >
                  ✕
                </button>
              </div>

              <div className="saved-card-body">
                <pre className="verdict-pre-wrap">{item.verdict}</pre>
              </div>

              <div className="saved-card-footer">
                <span className="models-used-tag">
                  Models: {item.modelsUsed?.join(', ')}
                </span>
                <div className="saved-footer-actions">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(item.verdict)}>
                    📋 Copy Text
                  </Button>
                  <Link to={`/app/arena/${item.battleId}`}>
                    <Button variant="secondary" size="sm">
                      View Debate →
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
