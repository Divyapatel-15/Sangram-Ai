import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockBattleService } from '../../services/mock/mockBattleService';
import { models } from '../../data/models';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';

export const HistoryPage = () => {
  const [battles, setBattles] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await mockBattleService.getRecentBattles();
      setBattles(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const tags = ['All', 'Architecture', 'AI/ML', 'Databases', 'Product'];

  const filtered = battles.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                          (b.summary && b.summary.toLowerCase().includes(search.toLowerCase()));
    const matchesTag = selectedTag === 'All' || (b.tags && b.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="history-page-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Battle History & Logs</h1>
          <p className="page-sub">Review past multi-model dialectic sessions and synthesis records.</p>
        </div>
        <Link to="/app/arena/new">
          <Button variant="primary" icon="⚔">New Battle</Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-search-bar mt-6">
        <div className="search-box-wrap">
          <Input
            placeholder="Search by topic, thesis, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="tag-filter-pills">
          {tags.map(t => (
            <button
              key={t}
              type="button"
              className={`tag-filter-btn ${selectedTag === t ? 'active' : ''}`}
              onClick={() => setSelectedTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="history-list-grid mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon="📜"
            title="No Dialectic Battles Found"
            description="No battle records match your filter criteria. Initiate a new battle in the arena!"
            actionText="Launch New Battle"
            onAction={() => window.location.href = '/app/arena/new'}
          />
        ) : (
          filtered.map((b) => (
            <Card key={b.id} hoverable className="history-item-card">
              <div className="history-item-top">
                <div className="topic-date-wrap">
                  <span className="topic-badge">{b.topic || 'General'}</span>
                  <span className="date-text">
                    {new Date(b.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {b.consensusScore && (
                  <span className="consensus-badge">
                    ★ {b.consensusScore}% Consensus
                  </span>
                )}
              </div>

              <h3 className="history-item-title">
                <Link to={`/app/arena/${b.id}`}>{b.title}</Link>
              </h3>

              <p className="history-item-summary">{b.summary}</p>

              <div className="history-item-footer">
                <div className="combatants-chips">
                  {b.models?.map(mId => {
                    const m = models.find(x => x.id === mId);
                    return (
                      <span
                        key={mId}
                        className="combatant-chip"
                        style={{ borderColor: m?.accent?.color || '#00D9FF' }}
                      >
                        {m?.name || mId}
                      </span>
                    );
                  })}
                </div>

                <Link to={`/app/arena/${b.id}`}>
                  <Button variant="outline" size="sm">
                    Open Chamber →
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
