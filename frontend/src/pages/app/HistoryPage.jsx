import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockBattleService } from '../../services/mock/mockBattleService';
import { Button } from '../../components/common/Button';

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
        <Link to="/app/arena">
          <Button variant="primary" icon="⚔">New Battle</Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-search-bar mt-6">
        <div className="search-box-wrap">
          <input
            type="text"
            className="clean-input"
            placeholder="Search battles by dilemma topic, model, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="tag-filter-pills">
          {tags.map(t => (
            <button
              key={t}
              type="button"
              className={`tag-pill-btn ${selectedTag === t ? 'active' : ''}`}
              onClick={() => setSelectedTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Clean History List */}
      <div className="history-clean-list mt-6">
        {filtered.length === 0 ? (
          <div className="empty-panel text-center py-8">
            <p className="text-muted">No battle logs match your search.</p>
          </div>
        ) : (
          filtered.map((b) => (
            <div key={b.id} className="history-row-item">
              <div className="history-row-main">
                <div className="history-meta-bar">
                  <span className="clean-topic-badge">{b.topic || 'General'}</span>
                  <span className="clean-date-text">
                    {new Date(b.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {b.consensusScore && (
                    <span className="consensus-pill">★ {b.consensusScore}% Consensus</span>
                  )}
                </div>

                <h3 className="history-item-title">
                  <Link to={`/app/arena/${b.id}`}>{b.title}</Link>
                </h3>
                <p className="history-item-summary">{b.summary}</p>
              </div>

              <div className="history-row-actions">
                <Link to={`/app/arena/${b.id}`}>
                  <Button variant="outline" size="sm">
                    Open Battle →
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
