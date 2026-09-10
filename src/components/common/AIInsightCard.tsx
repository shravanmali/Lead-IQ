import React from 'react';
import { Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AIInsightCardProps {
  insightText?: string;
  recommendation?: string;
  metricHighlight?: string;
  onActionClick?: () => void;
  actionLabel?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  insightText = 'Your WhatsApp leads convert 2.4x better than Facebook leads. Consider increasing your WhatsApp campaigns.',
  recommendation = 'Optimize channel budget & outreach sequences for Q3 target goals.',
  metricHighlight = '2.4x Higher Conversion',
  onActionClick,
  actionLabel = 'Explore Channel Optimization'
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.35rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        border: isLight ? '1px solid rgba(16, 185, 129, 0.28)' : '1px solid rgba(79, 242, 176, 0.22)',
        background: isLight
          ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)'
          : 'linear-gradient(135deg, rgba(10, 32, 28, 0.85) 0%, rgba(6, 17, 15, 0.95) 100%)',
        boxShadow: isLight
          ? '0 4px 20px rgba(16, 185, 129, 0.08), 0 1px 3px rgba(0,0,0,0.02)'
          : '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(79, 242, 176, 0.15)'
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: isLight
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(79, 242, 176, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div>
        {/* Header with Glowing Lightbulb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: isLight ? '#D1FAE5' : 'rgba(79, 242, 176, 0.12)',
                border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
                boxShadow: isLight ? '0 2px 6px rgba(16, 185, 129, 0.2)' : '0 0 14px rgba(79, 242, 176, 0.3)'
              }}
            >
              <Lightbulb size={18} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                AI Insight
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isLight ? '#D1FAE5' : 'rgba(79, 242, 176, 0.15)',
                  color: isLight ? '#065F46' : 'var(--brand-primary)',
                  border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.25)'
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: isLight ? '#059669' : 'var(--brand-primary)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {metricHighlight}
          </span>
        </div>

        {/* Insight Text */}
        <p
          style={{
            fontSize: '0.875rem',
            lineHeight: 1.55,
            color: 'var(--text-primary)',
            margin: '0 0 0.5rem 0',
            fontWeight: 500
          }}
        >
          {insightText}
        </p>

        {recommendation && (
          <p
            style={{
              fontSize: '0.75rem',
              color: isLight ? '#64748B' : 'var(--text-muted)',
              margin: 0,
              lineHeight: 1.4
            }}
          >
            {recommendation}
          </p>
        )}
      </div>

      {/* Footer / Action */}
      {actionLabel && (
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onActionClick}
            className="btn-ghost"
            style={{
              padding: 0,
              fontSize: '0.76rem',
              fontWeight: 700,
              color: isLight ? '#059669' : 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
          >
            <span>{actionLabel}</span>
            <ArrowRight size={13} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.68rem' }}>
            <Sparkles size={11} style={{ color: 'var(--brand-primary)' }} />
            <span>AI Model v4.2</span>
          </div>
        </div>
      )}
    </div>
  );
};
