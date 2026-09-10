import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, Key, Server, CheckCircle2, Save } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [require2FA, setRequire2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('8h');
  const [autoPurgeLogs, setAutoPurgeLogs] = useState('90d');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Settings Saved', 'System security policies successfully updated.', 'success');
    }, 400);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          System Security & Administration Settings
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Manage global RBAC boundaries, session timeouts, and audit logging
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Security Policies */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Shield size={18} style={{ color: 'var(--brand-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Authentication & Security Isolation
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Enforce Multi-Factor Authentication (MFA)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Require time-based OTP for all Manager and Staff logins
              </div>
            </div>
            <input
              type="checkbox"
              checked={require2FA}
              onChange={e => setRequire2FA(e.target.checked)}
              style={{ width: 'auto' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Session Inactivity Timeout
              </label>
              <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} style={{ width: '100%' }}>
                <option value="4h">4 Hours</option>
                <option value="8h">8 Hours (Standard Business Day)</option>
                <option value="24h">24 Hours</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Audit Log Retention Policy
              </label>
              <select value={autoPurgeLogs} onChange={e => setAutoPurgeLogs(e.target.value)} style={{ width: '100%' }}>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days (SOC-2 Standard)</option>
                <option value="365d">1 Year (Enterprise Compliance)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Server & Data Isolation Notice */}
        <div className="card" style={{ backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Server size={18} style={{ color: '#10b981' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Data Layer Role Segregation
            </h4>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Lead-IQ strictly restricts revenue calculations, lead speech recordings, and predictive intelligence models away from Admin account queries. All user provision operations are immutably signed to audit storage.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={isSaving} className="btn btn-primary">
            <Save size={16} />
            <span>{isSaving ? 'Saving Policies...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
