import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Bell, Send, Mail, Save, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

export const StaffSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [autoEmailDraft, setAutoEmailDraft] = useState(true);
  const [autoDetectTelegram, setAutoDetectTelegram] = useState(true);
  const [audioQuality, setAudioQuality] = useState('48khz');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Preferences Saved', 'Your AI Call Studio & Dispatch preferences are updated.', 'success');
    }, 400);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(79, 242, 176, 0.12)', border: '1px solid rgba(79, 242, 176, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
              <Sliders size={18} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Staff Account & AI Studio Settings
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '2.625rem' }}>
            Configure automated Whisper transcript defaults and multi-channel dispatch preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* User Card */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-primary)', boxShadow: '0 0 16px rgba(79, 242, 176, 0.25)' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {user?.name || 'Sneha Kulkarni'}
              </h3>
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={13} />
                STAFF AUTHORIZED
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
              {user?.email} • {user?.title || 'Senior Enterprise AE'}
            </p>
          </div>
        </div>

        {/* AI Call Studio Preferences */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Sparkles size={18} style={{ color: 'var(--brand-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Speech Intelligence Automation
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                Auto-Draft Proposal Email Post-Call
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Synthesize custom email using extracted call discussion points immediately upon call completion
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoEmailDraft}
              onChange={e => setAutoEmailDraft(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                Auto-Detect Telegram Handles in Audio
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Extract mentioned Telegram usernames (@handle) during Whisper transcription
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoDetectTelegram}
              onChange={e => setAutoDetectTelegram(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              Recording Codec & Audio Quality
            </label>
            <select
              value={audioQuality}
              onChange={e => setAudioQuality(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="48khz">48kHz High-Fidelity Stereo (Recommended for Whisper STT)</option>
              <option value="24khz">24kHz Standard Voice Codec</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ padding: '0.625rem 1.5rem' }}>
            <Save size={16} />
            <span>{isSaving ? 'Saving Preferences...' : 'Save Staff Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
