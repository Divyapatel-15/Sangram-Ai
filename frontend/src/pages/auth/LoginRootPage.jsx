import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Logo } from '../../components/common/Logo';

export const LoginRootPage = () => {
  const [email, setEmail] = useState('demo@sangram.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      showToast('Welcome to Sangram AI Arena!', 'success');
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    showToast('Google OAuth simulated — logging into Sangram AI...', 'info');
    setTimeout(() => {
      login({ email: 'google.user@sangram.ai', name: 'Google User' });
      navigate('/app');
    }, 600);
  };

  return (
    <div className="login-root-experience">
      {/* Background Atmosphere: Navy, Cyan-Blue Light Trails, Grid Mesh */}
      <div className="arena-ambient-field">
        <div className="trail trail-left"></div>
        <div className="trail trail-right"></div>
        <div className="radial-core"></div>
        <div className="ambient-particles"></div>
      </div>

      {/* Top Bar with Brand & Public Website Link */}
      <header className="root-header">
        <Logo size="md" href="/home" />

        <div className="root-header-links">
          <Link to="/home" className="public-home-pill">
            <span>Explore Public Website</span>
            <span className="pill-arrow">→</span>
          </Link>
        </div>
      </header>

      {/* Main Container: Split Stage with Animated Model Arena on Left & Form on Right */}
      <main className="root-main-layout">
        {/* Left Col: Cinematic Arena Clash Preview */}
        <section className="root-arena-stage" aria-label="Sangram AI Model Battle Preview">
          <div className="stage-eyebrow">
            <span className="live-pulse"></span>
            <span>DIALECTIC AI ARENA</span>
          </div>
          <h1 className="stage-heading">
            Different Minds.<br />
            <span className="stage-gradient-text">One Unified Arena.</span>
          </h1>
          <p className="stage-sub">
            Watch leading AI models challenge each other's reasoning, expose blind spots, and synthesize one consolidated answer.
          </p>

          {/* Animated Model Clash Cards */}
          <div className="clash-visual-container">
            {/* Model Card Left: ChatGPT */}
            <div className="fighter-card fighter-left animate-slide-left">
              <div className="fighter-header">
                <span className="fighter-dot dot-gpt"></span>
                <span className="fighter-title">ChatGPT · GPT-5</span>
              </div>
              <div className="fighter-claim">
                "Monoliths simplify deployment velocity, but microservices provide true domain isolation."
              </div>
              <div className="fighter-tag">Thesis Provider</div>
            </div>

            {/* Central VS Badge */}
            <div className="clash-vs-badge animate-pulse-glow">
              <div className="vs-inner">VS</div>
              <div className="vs-ripple"></div>
            </div>

            {/* Model Card Right: Claude */}
            <div className="fighter-card fighter-right animate-slide-right">
              <div className="fighter-header">
                <span className="fighter-dot dot-claude"></span>
                <span className="fighter-title">Claude · Sonnet 4.5</span>
              </div>
              <div className="fighter-claim">
                "Distributed operational tax will derail a 5-person team before domain isolation matters."
              </div>
              <div className="fighter-tag">Counter-Examiner</div>
            </div>
          </div>

          <div className="synthesis-preview-chip">
            <span className="synth-icon">✦</span>
            <span className="synth-text">Final Consensus: <strong>Modular Monolith</strong> recommended for early-stage B2B SaaS.</span>
          </div>
        </section>

        {/* Right Col: Smooth Form Reveal */}
        <section className="root-form-stage">
          <div className="login-card-panel animate-reveal-up">
            <div className="form-header">
              <div className="form-brand-row mb-3">
                <Logo size="sm" showWordmark={true} href="" />
              </div>
              <h2 className="form-title">Enter the Arena</h2>
              <p className="form-subtitle">Sign in to your Sangram AI workspace to initiate multi-model debates.</p>
            </div>

            {error && (
              <div className="auth-alert error-alert" role="alert">
                <span>⚠ {error}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="auth-form-fields" noValidate>
              <Input
                label="Work Email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="password-group">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="forgot-link-row">
                  <Link to="/auth/forgot-password" className="text-link-sm">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full submit-auth-btn"
                loading={loading}
              >
                Sign In to Workspace
              </Button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <button type="button" className="google-auth-btn" onClick={handleGoogleAuth}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-card-footer">
              <span>Don't have an account? </span>
              <Link to="/auth/signup" className="auth-action-link">
                Create free account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Root Experience Footer */}
      <footer className="root-footer">
        <span className="prototype-disclaimer">
          Frontend SaaS Prototype · Responses and auth sessions simulated locally · No external API keys required
        </span>
        <div className="root-legal-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/contact">Support</Link>
        </div>
      </footer>
    </div>
  );
};
