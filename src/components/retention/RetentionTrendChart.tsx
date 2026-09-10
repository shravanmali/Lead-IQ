import React, { useState } from 'react';
import { TrendingUp, Activity } from 'lucide-react';
import { RetentionTrendPoint } from '../../types/retention';
import { useTheme } from '../../context/ThemeContext';

interface RetentionTrendChartProps {
  data: RetentionTrendPoint[];
  range: '30D' | '90D' | '6M' | '1Y';
  onRangeChange: (range: '30D' | '90D' | '6M' | '1Y') => void;
  status?: 'improving' | 'stable' | 'declining';
}

export const RetentionTrendChart: React.FC<RetentionTrendChartProps> = ({
  data,
  range,
  onRangeChange,
  status = 'improving'
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const ranges: Array<'30D' | '90D' | '6M' | '1Y'> = ['30D', '90D', '6M', '1Y'];

  const width = 580;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const minVal = 50;
  const maxVal = 90;

  const getX = (index: number) => {
    if (data.length <= 1) return width / 2;
    return paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
  };

  const getY = (val: number) => {
    return height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
  };

  // Generate smooth cubic bezier SVG path
  const pathD = data.reduce((acc, pt, i, arr) => {
    const x = getX(i);
    const y = getY(pt.rate);
    if (i === 0) return `M ${x} ${y}`;
    const prevX = getX(i - 1);
    const prevY = getY(arr[i - 1].rate);
    const cx1 = prevX + (x - prevX) / 2;
    const cx2 = prevX + (x - prevX) / 2;
    return `${acc} C ${cx1} ${prevY}, ${cx2} ${y}, ${x} ${y}`;
  }, '');

  const areaD = data.length > 0
    ? `${pathD} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`
    : '';

  const activePoint = hoveredIndex !== null && data[hoveredIndex] ? data[hoveredIndex] : data[data.length - 1];
  const activeX = hoveredIndex !== null ? getX(hoveredIndex) : getX(data.length - 1);
  const activeY = hoveredIndex !== null && data[hoveredIndex] ? getY(data[hoveredIndex].rate) : getY(activePoint.rate);

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem 1.6rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: isLight ? '#FFFFFF' : undefined,
        border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.22)',
        boxShadow: isLight
          ? '0 2px 16px rgba(0, 0, 0, 0.04)'
          : '0 8px 32px rgba(0, 0, 0, 0.35), 0 0 20px rgba(79, 242, 176, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%',
        minHeight: '340px'
      }}
    >
      {/* Header with Title, Trend Status, & Date Range Filters */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
              Retention Rate
            </h3>
            {/* Status Badge */}
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                backgroundColor: status === 'improving'
                  ? (isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.15)')
                  : status === 'declining'
                    ? (isLight ? '#FEE2E2' : 'rgba(239, 68, 68, 0.15)')
                    : (isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.08)'),
                color: status === 'improving'
                  ? (isLight ? '#065F46' : 'var(--brand-primary)')
                  : status === 'declining'
                    ? (isLight ? '#DC2626' : '#EF4444')
                    : 'var(--text-secondary)',
                border: status === 'improving'
                  ? (isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.3)')
                  : status === 'declining'
                    ? (isLight ? '1px solid #FECACA' : '1px solid rgba(239, 68, 68, 0.3)')
                    : '1px solid var(--border-subtle)'
              }}
            >
              <TrendingUp size={11} />
              {status === 'improving' ? 'Improving' : status === 'declining' ? 'Declining' : 'Stable'}
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            30-day customer retention over time
          </div>
        </div>

        {/* Date Range Selector Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.05)',
            padding: '3px',
            borderRadius: '10px',
            border: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)'
          }}
        >
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => onRangeChange(r)}
              style={{
                background: range === r
                  ? (isLight ? '#FFFFFF' : 'var(--brand-primary)')
                  : 'transparent',
                color: range === r
                  ? (isLight ? '#065F46' : '#06110F')
                  : 'var(--text-secondary)',
                fontWeight: range === r ? 700 : 500,
                fontSize: '0.70rem',
                border: 'none',
                padding: '0.25rem 0.65rem',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: range === r && isLight ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Value & Subtext */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span
          style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: 'var(--brand-primary)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '-0.02em'
          }}
        >
          {activePoint.rate}%
        </span>
        <span style={{ fontSize: '0.75rem', color: isLight ? '#059669' : '#10B981', fontWeight: 700 }}>
          {activePoint.changePP >= 0 ? `+${activePoint.changePP} pp` : `${activePoint.changePP} pp`} vs previous
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          • {activePoint.retained} / {activePoint.total} customers
        </span>
      </div>

      {/* SVG Interactive Line & Area Chart */}
      <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '170px' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4FF2B0" stopOpacity={isLight ? '0.35' : '0.45'} />
              <stop offset="100%" stopColor="#20C997" stopOpacity="0.0" />
            </linearGradient>
            <filter id="retentionGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[60, 70, 80].map(val => (
            <g key={val}>
              <line
                x1={paddingX}
                y1={getY(val)}
                x2={width - paddingX}
                y2={getY(val)}
                stroke={isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.05)'}
                strokeDasharray="3 3"
              />
              <text
                x={paddingX - 8}
                y={getY(val) + 3}
                fill={isLight ? '#94A3B8' : 'rgba(255, 255, 255, 0.3)'}
                fontSize="9"
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {val}%
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaD} fill="url(#retentionGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--brand-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={isLight ? undefined : 'url(#retentionGlow)'}
          />

          {/* Vertical Crosshair Line when hovered */}
          {hoveredIndex !== null && (
            <line
              x1={activeX}
              y1={paddingY}
              x2={activeX}
              y2={height - paddingY}
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.8"
            />
          )}

          {/* Data Points */}
          {data.map((pt, idx) => {
            const x = getX(idx);
            const y = getY(pt.rate);
            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                style={{ cursor: 'pointer' }}
              >
                {/* Transparent hit area */}
                <circle cx={x} cy={y} r="14" fill="transparent" />

                {/* Outer halo */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 7 : 4.5}
                  fill="var(--brand-primary)"
                  opacity={isHovered ? 0.9 : 0.4}
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Inner core */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 4 : 2.5}
                  fill={isLight ? '#FFFFFF' : '#06110F'}
                  stroke="var(--brand-primary)"
                  strokeWidth="2"
                />

                {/* X-axis Label */}
                <text
                  x={x}
                  y={height - paddingY + 16}
                  fill={isHovered ? 'var(--text-primary)' : isLight ? '#64748B' : 'var(--text-muted)'}
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '500'}
                  textAnchor="middle"
                >
                  {pt.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Rich Interactive Tooltip */}
        {hoveredIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: `${Math.min(Math.max((activeX / width) * 100, 15), 85)}%`,
              transform: 'translateX(-50%)',
              backgroundColor: isLight ? '#FFFFFF' : 'rgba(6, 17, 15, 0.95)',
              border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.35)',
              boxShadow: isLight
                ? '0 6px 20px rgba(0, 0, 0, 0.08)'
                : '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 16px rgba(79, 242, 176, 0.2)',
              borderRadius: '12px',
              padding: '0.6rem 0.85rem',
              pointerEvents: 'none',
              zIndex: 10,
              backdropFilter: 'blur(12px)',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {activePoint.month} {activePoint.year}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>
                {activePoint.rate}%
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: isLight ? '#059669' : '#10B981' }}>
                {activePoint.changePP >= 0 ? `↑ ${activePoint.changePP} pp` : `↓ ${Math.abs(activePoint.changePP)} pp`}
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={10} style={{ color: 'var(--brand-primary)' }} />
              <span>{activePoint.retained} / {activePoint.total} customers retained</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
