import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';

export const VerifyEmailPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleDigitChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[index] = val.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Email verified successfully! (simulated)', 'success');
      navigate('/onboarding');
    }, 600);
  };

  const handleResend = () => {
    showToast('New 6-digit verification code sent to your inbox.', 'info');
  };

  return (
    <div className="auth-box animate-scale-in">
      <div className="auth-box-header text-center">
        <div className="flex justify-center mb-3">
          <Logo size="md" showWordmark={true} href="/home" />
        </div>
        <h2 className="auth-title">Verify your email</h2>
        <p className="auth-sub">
          We sent a 6-digit confirmation code to your email. Enter it below to activate your account.
        </p>
      </div>

      <form onSubmit={handleVerify} className="verify-form">
        <div className="digit-inputs-row">
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`digit-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              className="digit-box"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-4"
          loading={loading}
        >
          Confirm & Continue
        </Button>
      </form>

      <div className="resend-row text-center mt-4">
        <span>Didn't receive the email? </span>
        <button type="button" onClick={handleResend} className="text-link-button">
          Resend code
        </button>
      </div>

      <div className="auth-box-footer text-center">
        <Link to="/auth/login" className="back-link">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
};
