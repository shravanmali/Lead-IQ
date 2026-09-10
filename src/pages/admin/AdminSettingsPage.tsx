import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, Key, Server, CheckCircle2, Save, ShieldCheck } from 'lucide-react';

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
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(79, 242, 176, 0.12)', border: '1px solid rgba(79, 242, 176, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
              <Shield size={18} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              System Security & Administration Settings
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '2.625rem' }}>
            Manage global RBAC boundaries, session timeouts, and audit logging
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={13} />
            ISOLATION ACTIVE
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Security Policies */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Lock size={18} style={{ color: 'var(--brand-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Authentication & Security Isolation
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.875rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
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
              style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', paddingTop: '0.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Session Inactivity Timeout
              </label>
              <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} style={{ width: '100%' }}>
                <option value="4h">4 Hours</option>
                <option value="8h">8 Hours (Standard Business Day)</option>
                <option value="24h">24 Hours</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
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
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', backgroundColor: 'rgba(79, 242, 176, 0.04)', borderColor: 'rgba(79, 242, 176, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Server size={18} style={{ color: 'var(--brand-primary)' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Data Layer Role Segregation
            </h4>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
            Lead-IQ strictly restricts revenue calculations, lead speech recordings, and predictive intelligence models away from Admin account queries. All user provision operations are immutably signed to audit storage.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ padding: '0.625rem 1.5rem' }}>
            <Save size={16} />
            <span>{isSaving ? 'Saving Policies...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
