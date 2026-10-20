import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Background ambient lighting and particle effects */}
      <div className="auth-bg-ambient">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-mesh"></div>
      </div>

      {/* Top Header */}
      <header className="auth-header">
        <Link to="/home" className="brand-logo" aria-label="Back to Sangram AI home">
          <div className="brand-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00D9FF" strokeWidth="2"/>
              <path d="M2 17L12 22L22 17" stroke="#4388FF" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="#00D9FF" strokeWidth="2"/>
            </svg>
          </div>
          <span className="brand-name">Sangram<span className="brand-accent">AI</span></span>
        </Link>
        <div className="auth-header-right">
          <Link to="/home" className="back-home-link">← Return to website</Link>
        </div>
      </header>

      {/* Auth Card Container */}
      <main className="auth-main">
        <div className="auth-container">
          <Outlet />
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="auth-footer">
        <span className="auth-footer-text">© 2026 Sangram AI · Different Minds. One Arena.</span>
        <div className="auth-footer-links">
          <Link to="/privacy">Privacy</Link>
          <span>·</span>
          <Link to="/terms">Terms</Link>
          <span>·</span>
          <Link to="/contact">Support</Link>
        </div>
      </footer>
    </div>
  );
};
