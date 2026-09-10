import React from 'react';
import { Sparkles, Flame, Zap, ShieldAlert, Snowflake } from 'lucide-react';
import { LeadScore } from '../../types/lead';

interface LeadScoreBadgeProps {
  score: LeadScore | number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'radial';
}

export const LeadScoreBadge: React.FC<LeadScoreBadgeProps> = ({
  score,
  showDetails = true,
  size = 'md'
}) => {
  const scoreVal = typeof score === 'number' ? score : score.score;
  const category =
    typeof score === 'object'
      ? score.category
      : scoreVal >= 85
      ? 'Hot'
      : scoreVal >= 70
      ? 'Warm'
      : scoreVal >= 50
      ? 'Moderate'
      : 'Cold';

  // Radial Ring Display (for Hero AI cards)
  if (size === 'radial') {
    const strokeDash = `${scoreVal * 2.2} 220`;
    const isHot = scoreVal >= 85;
    return (
      <div style={{ position: 'relative', width: '58px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="58" height="58" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="transparent"
            stroke="var(--border-subtle)"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="transparent"
            stroke={isHot ? 'var(--brand-primary)' : scoreVal >= 70 ? '#FBBF24' : '#60A5FA'}
            strokeWidth="6"
            strokeDasharray={strokeDash}
            strokeLinecap="round"
            style={{
              filter: isHot ? 'drop-shadow(0 0 6px rgba(79, 242, 176, 0.4))' : 'none',
              transition: 'stroke-dasharray 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {scoreVal}
          </div>
          <div style={{ fontSize: '0.58rem', color: isHot ? 'var(--brand-primary)' : 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            {category}
          </div>
        </div>
      </div>
    );
  }

  let badgeClass = 'badge-cold';
  let Icon = Snowflake;
  let label = 'Cold';

  if (scoreVal >= 85 || category === 'Hot') {
    badgeClass = 'badge-success';
    Icon = Flame;
    label = 'Hot Intent';
  } else if (scoreVal >= 70 || category === 'Warm') {
    badgeClass = 'badge-warm';
    Icon = Zap;
    label = 'Warm';
  } else if (scoreVal >= 50 || category === 'Moderate') {
    badgeClass = 'badge-moderate';
    Icon = Sparkles;
    label = 'Moderate';
  } else {
    badgeClass = 'badge-cold';
    Icon = ShieldAlert;
    label = 'Cold';
  }

  const paddingStyle =
    size === 'sm'
      ? { padding: '0.15rem 0.45rem', fontSize: '0.72rem' }
      : size === 'lg'
      ? { padding: '0.35rem 0.75rem', fontSize: '0.84rem' }
      : { padding: '0.22rem 0.55rem', fontSize: '0.76rem' };

  return (
    <span
      className={`badge ${badgeClass}`}
      style={{
        ...paddingStyle,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        boxShadow: scoreVal >= 85 ? '0 0 12px rgba(79, 242, 176, 0.2)' : 'none'
      }}
    >
      <Icon size={size === 'sm' ? 11 : size === 'lg' ? 15 : 13} />
      <span style={{ fontWeight: 800 }}>{scoreVal}</span>
      {showDetails && <span style={{ opacity: 0.85 }}>/ 100 • {label}</span>}
    </span>
  );
};
