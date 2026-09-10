import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TimeSavedCardProps {
  hoursSaved?: string | number;
  timeframe?: string;
  percentageChange?: string;
  automationCount?: number;
}

export const TimeSavedCard: React.FC<TimeSavedCardProps> = ({
  hoursSaved = '18.5 hrs',
  timeframe = 'Estimated this week',
  percentageChange = '+23%',
  automationCount = 142
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
        border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: isLight ? '#FFFFFF' : undefined,
        boxShadow: isLight ? '0 2px 12px rgba(0, 0, 0, 0.03)' : undefined
      }}
    >
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: isLight ? '#E0F2FE' : 'rgba(56, 189, 248, 0.12)',
                border: isLight ? '1px solid #BAE6FD' : '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isLight ? '#0284C7' : '#38BDF8',
                boxShadow: isLight ? '0 2px 6px rgba(2, 132, 199, 0.15)' : '0 0 12px rgba(56, 189, 248, 0.25)'
              }}
            >
              <Clock size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Time Saved
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isLight ? '#D1FAE5' : 'rgba(16, 185, 129, 0.12)',
              border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(16, 185, 129, 0.25)',
              color: isLight ? '#065F46' : '#10B981',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)'
            }}
          >
            <TrendingUp size={11} />
            <span>{percentageChange}</span>
          </div>
        </div>

        {/* Metric & Description */}
        <div style={{ marginTop: '0.25rem' }}>
          <div
            style={{
              fontSize: '1.95rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              fontFamily: 'var(--font-mono)'
            }}
          >
            {hoursSaved}
          </div>
          <div style={{ fontSize: '0.78rem', color: isLight ? '#64748B' : 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>
            {timeframe}
          </div>
        </div>
      </div>

      {/* Mini Progress / Automation Stat */}
      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: isLight ? '1px solid #F1F5F9' : '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.72rem', color: isLight ? '#64748B' : 'var(--text-muted)' }}>AI Call Summaries & Auto-Comms</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>
            {automationCount} tasks
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ width: '100%', height: '5px', borderRadius: '3px', backgroundColor: isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.06)', overflow: 'hidden' }}>
          <div
            style={{
              width: '78%',
              height: '100%',
              borderRadius: '3px',
              background: isLight
                ? 'linear-gradient(90deg, #059669 0%, #10B981 100%)'
                : 'linear-gradient(90deg, #20C997 0%, #4FF2B0 100%)',
              boxShadow: isLight ? '0 0 6px rgba(16, 185, 129, 0.4)' : '0 0 8px rgba(79, 242, 176, 0.5)'
            }}
          />
        </div>
      </div>
    </div>
  );
};
