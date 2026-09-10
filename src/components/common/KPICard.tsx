import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
  sparklineData?: number[];
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  badge,
  glow = false,
  sparklineData = [12, 16, 14, 22, 19, 28, 32]
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Generate SVG Sparkline Path
  const sWidth = 80;
  const sHeight = 28;
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;

  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * sWidth;
    const y = sHeight - ((val - minVal) / range) * (sHeight - 6) - 3;
    return `${x},${y}`;
  });

  const pathD = points.reduce((acc, pt, i) => {
    const [x, y] = pt.split(',');
    if (i === 0) return `M ${x} ${y}`;
    const [prevX, prevY] = points[i - 1].split(',');
    const cx = (parseFloat(prevX) + parseFloat(x)) / 2;
    return `${acc} C ${cx} ${prevY}, ${cx} ${y}, ${x} ${y}`;
  }, '');

  const areaD = `${pathD} L ${sWidth} ${sHeight} L 0 ${sHeight} Z`;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem 1.4rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.2s ease',
        border: glow
          ? (isLight ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(79, 242, 176, 0.3)')
          : (isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)'),
        backgroundColor: isLight ? '#FFFFFF' : undefined,
        boxShadow: glow
          ? (isLight ? '0 4px 20px rgba(16, 185, 129, 0.1), 0 1px 3px rgba(0,0,0,0.02)' : '0 12px 36px rgba(0,0,0,0.25), 0 0 20px rgba(79, 242, 176, 0.12)')
          : (isLight ? '0 2px 10px rgba(0, 0, 0, 0.03)' : undefined)
      }}
    >
      {/* Card Header: Title & Glowing Icon Container */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.01em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.1)',
              border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.25)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isLight ? '0 2px 6px rgba(16, 185, 129, 0.15)' : '0 0 10px rgba(79, 242, 176, 0.2)'
            }}
          >
            <Icon size={16} />
          </div>
        )}
        {badge && (
          <span className="badge badge-warm" style={{ fontSize: '0.68rem' }}>
            {badge}
          </span>
        )}
      </div>

      {/* Metric Display & Sparkline Row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '0.2rem' }}>
        <div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1, fontFamily: 'var(--font-mono)' }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Mini Sparkline Curve */}
        <div style={{ width: '80px', height: '28px', opacity: 0.85 }}>
          <svg width={sWidth} height={sHeight} viewBox={`0 0 ${sWidth} ${sHeight}`} style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id={`kpiSparkle-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isLight ? '#10B981' : '#4FF2B0'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isLight ? '#10B981' : '#4FF2B0'} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#kpiSparkle-${title.replace(/\s+/g, '')})`} />
            <path d={pathD} fill="none" stroke={isLight ? '#10B981' : '#4FF2B0'} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Trend Row */}
      {trend && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: trend.isPositive ? (isLight ? '#059669' : 'var(--brand-primary)') : '#EF4444'
          }}
        >
          {trend.isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span style={{ fontFamily: 'var(--font-mono)' }}>{trend.value}</span>
          {trend.label && (
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
};
