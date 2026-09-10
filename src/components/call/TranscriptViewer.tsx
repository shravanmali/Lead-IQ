import React from 'react';
import { Transcript } from '../../types/call';
import { Bot, MessageSquare, Send, CheckCircle2, Sparkles } from 'lucide-react';

interface TranscriptViewerProps {
  transcript: Transcript;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ transcript }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Extracted Key Insights Header */}
      {transcript.extractedKeyPoints && transcript.extractedKeyPoints.length > 0 && (
        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(79, 242, 176, 0.05)',
            borderColor: 'rgba(79, 242, 176, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} />
              <span>Extracted Key Points (Whisper STT)</span>
            </div>
            {transcript.detectedTelegramHandle && (
              <span
                className="badge"
                style={{
                  backgroundColor: 'rgba(79, 242, 176, 0.15)',
                  color: 'var(--brand-primary)',
                  border: '1px solid rgba(79, 242, 176, 0.3)',
                  gap: '0.35rem'
                }}
              >
                <Send size={12} />
                Telegram: @{transcript.detectedTelegramHandle}
              </span>
            )}
          </div>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', margin: 0 }}>
            {transcript.extractedKeyPoints.map((point, idx) => (
              <li key={idx} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
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
              className="glass-card"
              style={{
                display: 'flex',
                gap: '0.875rem',
                alignItems: 'flex-start',
                padding: '1rem 1.15rem',
                backgroundColor: isStaff ? 'rgba(79, 242, 176, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                border: isStaff ? '1px solid rgba(79, 242, 176, 0.15)' : '1px solid var(--border-subtle)'
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: isStaff ? 'rgba(79, 242, 176, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                  color: isStaff ? 'var(--brand-primary)' : '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  border: isStaff ? '1px solid rgba(79, 242, 176, 0.3)' : '1px solid rgba(139, 92, 246, 0.3)'
                }}
              >
                {isStaff ? 'AE' : 'LEAD'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {isStaff ? 'Account Executive (Staff)' : 'Prospect (Lead)'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {turn.sentiment === 'positive' && (
                      <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                        Positive Sentiment
                      </span>
                    )}
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {turn.timestamp}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
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
