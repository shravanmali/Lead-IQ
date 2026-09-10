import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number | string;
    isPositive: boolean;
    label?: string;
  };
  icon?: LucideIcon;
  badge?: string;
  glow?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  badge,
  glow = false
}) => {
  return (
    <div
      className={`card card-hover ${glow ? 'card-glow' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={18} />
          </div>
        )}
        {badge && (
          <span className="badge badge-warm" style={{ fontSize: '0.7rem' }}>
            {badge}
          </span>
        )}
      </div>

      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {subtitle}
          </div>
        )}
      </div>

      {trend && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.875rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: trend.isPositive ? 'var(--success-text)' : '#ef4444'
          }}
        >
          {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend.value}</span>
          {trend.label && (
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
};
