import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

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
        <Logo size="md" href="/home" />
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
