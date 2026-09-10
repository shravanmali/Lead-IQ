import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Bell, Send, Mail, Save, Sparkles } from 'lucide-react';

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
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Staff Account & AI Studio Settings
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Configure automated Whisper transcript defaults and multi-channel dispatch preferences
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* User Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-primary)' }}
          />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {user?.name || 'Sneha Kulkarni'}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              {user?.email} • {user?.title || 'Senior Enterprise AE'}
            </p>
            <span className="badge" style={{ marginTop: '0.35rem', backgroundColor: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
              STAFF AUTHORIZATION ACTIVE
            </span>
          </div>
        </div>

        {/* AI Call Studio Preferences */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Sparkles size={18} style={{ color: 'var(--brand-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Speech Intelligence Automation
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              style={{ width: 'auto' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              style={{ width: 'auto' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
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
          <button type="submit" disabled={isSaving} className="btn btn-primary">
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Staff Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
