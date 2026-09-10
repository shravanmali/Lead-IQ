import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { IndianRupee, Save, Bell, Sliders, Shield } from 'lucide-react';

export const ManagerSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [monthlyTarget, setMonthlyTarget] = useState('600000');
  const [leadThreshold, setLeadThreshold] = useState('80');
  const [autoReassignDays, setAutoReassignDays] = useState('5');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Settings Saved', 'Revenue quotas and lead threshold rules updated.', 'success');
    }, 400);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Manager CRM Settings & Revenue Targets
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Configure monthly quotas, automated lead reassignment, and score thresholds
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <IndianRupee size={18} style={{ color: 'var(--brand-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Revenue Targets & Quotas
            </h3>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Monthly Team Revenue Target (₹ INR)
            </label>
            <input
              type="number"
              value={monthlyTarget}
              onChange={e => setMonthlyTarget(e.target.value)}
              style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Hot Lead Score Threshold (0-100)
              </label>
              <input
                type="number"
                value={leadThreshold}
                onChange={e => setLeadThreshold(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Stale Lead Reassign (Days Inactive)
              </label>
              <input
                type="number"
                value={autoReassignDays}
                onChange={e => setAutoReassignDays(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={isSaving} className="btn btn-primary">
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save CRM Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
