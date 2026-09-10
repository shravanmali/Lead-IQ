import React from 'react';
import { Sparkles, Flame, Zap, ShieldAlert, Snowflake } from 'lucide-react';
import { LeadScore } from '../../types/lead';

interface LeadScoreBadgeProps {
  score: LeadScore | number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
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

  let badgeClass = 'badge-cold';
  let Icon = Snowflake;
  let label = 'Cold';

  if (scoreVal >= 85 || category === 'Hot') {
    badgeClass = 'badge-hot';
    Icon = Flame;
    label = 'Hot';
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
      ? { padding: '0.4rem 0.85rem', fontSize: '0.875rem' }
      : { padding: '0.25rem 0.6rem', fontSize: '0.78rem' };

  return (
    <span
      className={`badge ${badgeClass}`}
      style={{ ...paddingStyle, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
    >
      <Icon size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
      <span style={{ fontWeight: 700 }}>{scoreVal}</span>
      {showDetails && <span style={{ opacity: 0.85 }}>/ 100 • {label}</span>}
    </span>
  );
};
