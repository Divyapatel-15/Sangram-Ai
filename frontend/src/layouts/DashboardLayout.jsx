import React, { useState } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  // Generate breadcrumb text from current path
  const getBreadcrumb = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Workspace / Dashboard';
    const sub = parts[1];
    switch (sub) {
      case 'arena':
        return 'War Room / Dialectic Arena';
      case 'history':
        return 'Workspace / Battle History';
      case 'saved':
        return 'Workspace / Saved Answers';
      case 'models':
        return 'Library / Model Catalog';
      case 'usage':
        return 'Analytics / Token Usage';
      case 'billing':
        return 'Billing / Subscription & Invoices';
      case 'settings':
        return 'Settings / Account & Preferences';
      default:
        return 'Workspace / Dashboard';
    }
  };

  return (
    <div className="dashboard-shell">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="dashboard-mobile-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-inner">
          {/* Brand Header */}
          <div className="sidebar-brand">
            <Link to="/home" className="brand-logo" onClick={() => setSidebarOpen(false)}>
              <div className="brand-mark">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00D9FF" strokeWidth="2"/>
                  <path d="M2 17L12 22L22 17" stroke="#4388FF" strokeWidth="2"/>
                  <path d="M2 12L12 17L22 12" stroke="#00D9FF" strokeWidth="2"/>
                </svg>
              </div>
              <div className="brand-titles">
                <span className="brand-name">Sangram<span className="brand-accent">AI</span></span>
                <span className="brand-sub">Different Minds. One Arena.</span>
              </div>
            </Link>
            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>

          {/* New Battle Quick Action */}
          <div className="sidebar-cta-block">
            <Link to="/app/arena/new" onClick={() => setSidebarOpen(false)} className="w-full">
              <Button variant="primary" className="new-battle-btn w-full" icon="⚔">
                New Battle
              </Button>
            </Link>
            <div className="sidebar-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search battles & models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="sidebar-scrollable">
            <div className="nav-group">
              <span className="nav-group-title">Arena Chamber</span>
              <nav className="sidebar-nav">
                <NavLink
                  to="/app/arena/new"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="link-icon">⚔</span>
                  <span className="link-text">War Room Arena</span>
                  <span className="link-badge-live">LIVE</span>
                </NavLink>

                <NavLink
                  to="/app"
                  end
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="link-icon">📊</span>
                  <span className="link-text">Dashboard</span>
                </NavLink>

                <NavLink
                  to="/app/history"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="link-icon">📜</span>
                  <span className="link-text">Battle History</span>
                </NavLink>

                <NavLink
                  to="/app/saved"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="link-icon">💾</span>
                  <span className="link-text">Saved Answers</span>
                </NavLink>
              </nav>
            </div>

            <div className="nav-group">
              <span className="nav-group-title">Intelligence & Tools</span>
              <nav className="sidebar-nav">
                <NavLink
                  to="/app/models"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="link-icon">🧠</span>
                  <span className="link-text">Model Library</span>
                  <span className="link-count">6</span>
                </NavLink>

                <NavLink
                  to="/app/usage"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="link-icon">📈</span>
                  <span className="link-text">Usage & Tokens</span>
                </NavLink>

                <NavLink
                  to="/app/billing"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="link-icon">💳</span>
                  <span className="link-text">Billing & Plans</span>
                </NavLink>

                <NavLink
                  to="/app/settings/profile"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="link-icon">⚙</span>
                  <span className="link-text">Settings</span>
                </NavLink>
              </nav>
            </div>

            {/* Quick Public Links */}
            <div className="sidebar-marketing-link">
              <Link to="/home" className="external-portal-btn">
                <span>🌐 View Public Website</span>
                <span className="arrow-portal">↗</span>
              </Link>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="sidebar-user-card">
            <div className="user-info-row">
              <div className="user-avatar-circle">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="user-meta">
                <span className="user-name">{user?.name || 'Explorer'}</span>
                <span className="user-tier">Pro Member</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Log out">
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="dashboard-main-wrapper">
        {/* Top Header */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="topbar-hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              ☰
            </button>
            <div className="topbar-breadcrumbs">
              <span className="crumb-segment">{getBreadcrumb()}</span>
            </div>
          </div>

          <div className="topbar-right">
            <div className="dialectic-status-pill">
              <span className="status-live-dot"></span>
              <span className="status-text">Dialectic Engine Ready</span>
            </div>

            <Link to="/pricing" className="upgrade-pill-btn">
              ⚡ Upgrade Plan
            </Link>

            <Link to="/app/settings/profile" className="topbar-avatar" title="Account settings">
              <div className="avatar-img-circle">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Route Content */}
        <main className="dashboard-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
