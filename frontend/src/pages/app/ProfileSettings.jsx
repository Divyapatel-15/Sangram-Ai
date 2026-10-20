import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';

export const ProfileSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [email, setEmail] = useState(user?.email || 'alex.vance@sangram.ai');
  const [role, setRole] = useState(user?.role || 'AI Research Lead');
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Profile information updated successfully!', 'success');
    }, 500);
  };

  return (
    <div className="settings-page-view">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Settings & Configuration</h1>
          <p className="page-sub">Manage your account credentials, security parameters, and dialectic preferences.</p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="settings-nav-tabs mt-6">
        <NavLink to="/app/settings/profile" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>
          Profile
        </NavLink>
        <NavLink to="/app/settings/security" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>
          Security
        </NavLink>
        <NavLink to="/app/settings/preferences" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>
          Preferences
        </NavLink>
      </div>

      <Card className="settings-panel-card mt-6">
        <h3 className="panel-title">Public Profile</h3>
        <p className="panel-desc text-muted">This information identifies your contributions in shared team chambers.</p>

        <form onSubmit={handleSave} className="settings-form mt-6">
          <div className="avatar-upload-row">
            <div className="avatar-circle-large">
              {name ? name.charAt(0) : 'A'}
            </div>
            <div>
              <Button variant="outline" size="sm" type="button" onClick={() => showToast('Avatar upload simulated.', 'info')}>
                Change Avatar
              </Button>
              <span className="text-muted text-xs block mt-1">JPG, GIF or PNG. Max size 2MB.</span>
            </div>
          </div>

          <div className="form-fields-grid mt-6">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Job Role / Focus"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="form-actions-row mt-6">
            <Button type="submit" variant="primary" loading={loading}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
