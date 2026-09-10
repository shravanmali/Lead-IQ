import React from 'react';
import { ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface RetentionKPICardProps {
  rate?: string | number;
  trendPP?: string | number;
  retainedCount?: number;
  totalCount?: number;
  periodLabel?: string;
  onClick?: () => void;
}

export const RetentionKPICard: React.FC<RetentionKPICardProps> = ({
  rate = '78.4%',
  trendPP = '+4.2 pp',
  retainedCount = 392,
  totalCount = 500,
  periodLabel = '30-day retention',
  onClick
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      onClick={onClick}
      className="glass-card kpi-card"
      style={{
        padding: '1.25rem 1.4rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: isLight ? '#FFFFFF' : undefined,
        border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.22)',
        boxShadow: isLight
          ? '0 2px 12px rgba(0, 0, 0, 0.04)'
          : '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 16px rgba(79, 242, 176, 0.08)',
        transition: 'all var(--transition-normal)'
      }}
    >
      {/* Top Header: Title + Period Label + Icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Retention Rate
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.12)',
                color: isLight ? '#065F46' : 'var(--brand-primary)',
                border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.25)'
              }}
            >
              {periodLabel}
            </span>
          </div>
        </div>

        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.12)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.25)'
          }}
        >
          <ShieldCheck size={17} />
        </div>
      </div>

      {/* Main Metric Value */}
      <div style={{ margin: '0.65rem 0' }}>
        <div
          style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.1
          }}
        >
          {rate}
        </div>

        {/* Trend Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: isLight ? '#059669' : '#10B981',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <TrendingUp size={12} />
            {trendPP}
          </span>
          <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
            vs previous period
          </span>
        </div>
      </div>

      {/* Secondary Information: Retained Customers */}
      <div
        style={{
          borderTop: isLight ? '1px solid #F1F5F9' : '1px solid var(--border-subtle)',
          paddingTop: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: 'var(--text-secondary)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users size={12} style={{ color: 'var(--brand-primary)' }} />
          <span>{retainedCount} / {totalCount} retained</span>
        </span>
        <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>
          {Math.round((retainedCount / totalCount) * 100)}% active
        </span>
      </div>
    </div>
  );
};
