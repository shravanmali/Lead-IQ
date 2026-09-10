import React from 'react';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface RetentionInsightCardProps {
  onViewRetained?: () => void;
}

export const RetentionInsightCard: React.FC<RetentionInsightCardProps> = ({
  onViewRetained
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem 1.4rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: isLight ? '#FFFFFF' : undefined,
        border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.25)',
        boxShadow: isLight
          ? '0 2px 12px rgba(0, 0, 0, 0.03)'
          : '0 8px 24px rgba(0, 0, 0, 0.35), 0 0 16px rgba(79, 242, 176, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.9rem'
      }}
    >
      {/* Header with Sparkles AI Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: isLight
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #4FF2B0 0%, #20C997 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLight ? '#FFFFFF' : '#06110F'
            }}
          >
            <Sparkles size={13} />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            ✦ AI Retention Insight
          </span>
        </div>

        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '0.15rem 0.45rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.12)',
            color: isLight ? '#065F46' : 'var(--brand-primary)',
            border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <TrendingUp size={10} />
          +10.2 pp 6M Gain
        </span>
      </div>

      {/* Main Insight Text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <div
          style={{
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.4
          }}
        >
          Retention improved by <span style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>10.2 percentage points</span> over the last 6 months.
        </div>

        <div
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45
          }}
        >
          The strongest improvement occurred after April. Review customers acquired during this period to identify engagement patterns associated with higher cohort stickiness.
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ paddingTop: '0.25rem' }}>
        <button
          onClick={onViewRetained}
          style={{
            background: isLight ? '#F8FAF9' : 'rgba(79, 242, 176, 0.10)',
            border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.25)',
            color: isLight ? '#065F46' : 'var(--brand-primary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.45rem 0.85rem',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s ease'
          }}
        >
          <span>View Retained Customers</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
