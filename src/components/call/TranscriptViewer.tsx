import React from 'react';
import { Transcript } from '../../types/call';
import { Bot, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface TranscriptViewerProps {
  transcript: Transcript;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ transcript }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Extracted Key Insights Header */}
      {transcript.extractedKeyPoints && transcript.extractedKeyPoints.length > 0 && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Extracted Key Points (Whisper STT)
            </div>
            {transcript.detectedTelegramHandle && (
              <span
                className="badge"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  gap: '0.35rem'
                }}
              >
                <Send size={12} />
                Telegram: @{transcript.detectedTelegramHandle}
              </span>
            )}
          </div>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0 }}>
            {transcript.extractedKeyPoints.map((point, idx) => (
              <li key={idx} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Speaker Conversation Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {transcript.turns.map((turn, i) => {
          const isStaff = turn.speaker === 'Staff';

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isStaff ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isStaff ? 'var(--brand-primary-light)' : 'rgba(139, 92, 246, 0.15)',
                  color: isStaff ? 'var(--brand-primary)' : 'var(--brand-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                {isStaff ? 'AE' : 'LEAD'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {isStaff ? 'Account Executive (Staff)' : 'Prospect (Lead)'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {turn.sentiment === 'positive' && (
                      <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                        Positive Sentiment
                      </span>
                    )}
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {turn.timestamp}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {turn.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
