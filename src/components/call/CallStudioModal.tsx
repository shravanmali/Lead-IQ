import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Sparkles, UserCheck, MapPin } from 'lucide-react';
import { Lead } from '../../types/lead';
import { Modal } from '../common/Modal';

interface CallStudioModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onEndCall: (durationSeconds: number) => void;
}

export const CallStudioModal: React.FC<CallStudioModalProps> = ({
  isOpen,
  lead,
  onClose,
  onEndCall
}) => {
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [waveformHeights, setWaveformHeights] = useState<number[]>(
    Array.from({ length: 24 }, () => 10)
  );

  // Ringing to connected simulation
  useEffect(() => {
    if (!isOpen) {
      setCallState('ringing');
      setSeconds(0);
      return;
    }

    const connectTimer = setTimeout(() => {
      setCallState('connected');
    }, 2400);

    return () => clearTimeout(connectTimer);
  }, [isOpen]);

  // Active call duration timer & live animated waveform
  useEffect(() => {
    if (callState !== 'connected') return;

    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    const waveTimer = setInterval(() => {
      setWaveformHeights(
        Array.from({ length: 24 }, () => Math.floor(Math.random() * 38) + 6)
      );
    }, 180);

    return () => {
      clearInterval(timer);
      clearInterval(waveTimer);
    };
  }, [callState]);

  if (!lead) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleHangUp = () => {
    setCallState('ended');
    const finalDuration = Math.max(seconds, 28);
    onEndCall(finalDuration);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead-IQ AI Call Studio"
      subtitle={`Live Secure Connection with ${lead.name} (${lead.country})`}
      maxWidth="500px"
    >
      <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
        {/* Caller Avatar & Glow */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '2px solid var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--brand-primary)',
              boxShadow: callState === 'connected' ? '0 0 35px rgba(59, 130, 246, 0.4)' : 'none',
              animation: callState === 'ringing' ? 'pulseRing 1.5s infinite' : 'none'
            }}
          >
            {lead.name.charAt(0)}
          </div>
          {callState === 'connected' && (
            <div
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '3px solid var(--bg-surface)'
              }}
            />
          )}
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {lead.name}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          {lead.title} • {lead.company}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <MapPin size={12} style={{ color: 'var(--brand-primary)' }} />
          <span>{lead.country}</span>
          <span>•</span>
          <span>{lead.phone}</span>
        </div>

        {/* Call Status Indicator */}
        <div style={{ margin: '1.5rem 0' }}>
          {callState === 'ringing' ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              <span className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
              Connecting secure SIP line to {lead.country}...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                  letterSpacing: '0.04em'
                }}
              >
                {formatTime(seconds)}
              </div>

              {/* Dynamic Live Audio Waveform */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  height: '45px',
                  width: '100%',
                  maxWidth: '320px',
                  padding: '0 1rem',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {waveformHeights.map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: '4px',
                      height: `${isMuted ? 4 : h}px`,
                      borderRadius: '2px',
                      background: 'var(--brand-gradient)',
                      transition: 'height 0.15s ease'
                    }}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--brand-primary)' }}>
                <Sparkles size={13} />
                <span>Whisper STT (Indian English & Hindi Nuances) • 48kHz HD</span>
              </div>
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="btn-secondary"
            style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0 }}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff size={20} color="#ef4444" /> : <Mic size={20} />}
          </button>

          <button
            onClick={handleHangUp}
            className="btn btn-danger"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              padding: 0,
              backgroundColor: '#ef4444',
              color: '#ffffff',
              boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
            }}
            title="End Call & Process AI Insights"
          >
            <PhoneOff size={26} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); }
          70% { box-shadow: 0 0 0 18px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
    </Modal>
  );
};
