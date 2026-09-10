import React, { useState } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ConversionTrendCardProps {
  currentRate?: number | string;
  timeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

export const ConversionTrendCard: React.FC<ConversionTrendCardProps> = ({
  currentRate = '24.8%',
  timeframe = 'Last 30 days'
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; rate: number; cx: number; cy: number } | null>(null);

  const points = [
    { date: 'Aug 12', rate: 14.2 },
    { date: 'Aug 19', rate: 18.5 },
    { date: 'Aug 26', rate: 16.8 },
    { date: 'Sep 2', rate: 21.4 },
    { date: 'Sep 9', rate: 24.8 }
  ];

  const width = 340;
  const height = 135;
  const paddingX = 25;
  const paddingY = 20;

  const minVal = 0;
  const maxVal = 40;

  const getX = (index: number) => paddingX + (index / (points.length - 1)) * (width - paddingX * 2);
  const getY = (val: number) => height - paddingY - (val / maxVal) * (height - paddingY * 2);

  // Generate cubic bezier smooth path
  const pathD = points.reduce((acc, pt, i, arr) => {
    const x = getX(i);
    const y = getY(pt.rate);
    if (i === 0) return `M ${x} ${y}`;
    const prevX = getX(i - 1);
    const prevY = getY(arr[i - 1].rate);
    const cx1 = prevX + (x - prevX) / 2;
    const cx2 = prevX + (x - prevX) / 2;
    return `${acc} C ${cx1} ${prevY}, ${cx2} ${y}, ${x} ${y}`;
  }, '');

  const areaD = `${pathD} L ${getX(points.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

  const lastPoint = points[points.length - 1];
  const lastX = getX(points.length - 1);
  const lastY = getY(lastPoint.rate);

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem 1.4rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '210px',
        backgroundColor: isLight ? '#FFFFFF' : undefined,
        border: isLight ? '1px solid #E2E8F0' : undefined,
        boxShadow: isLight ? '0 2px 12px rgba(0, 0, 0, 0.03)' : undefined
      }}
    >
      {/* Header with Title & Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Conversion Trend
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '2px' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>
              {currentRate}
            </span>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#059669' : '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <TrendingUp size={12} style={{ marginRight: '2px' }} />
              +6.4%
            </span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <select
            value={selectedTimeframe}
            onChange={e => setSelectedTimeframe(e.target.value)}
            style={{
              padding: '0.25rem 1.6rem 0.25rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              backgroundColor: isLight ? '#F8FAF9' : 'rgba(255, 255, 255, 0.04)',
              border: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: isLight ? '#475569' : 'var(--text-secondary)',
              cursor: 'pointer',
              appearance: 'none'
            }}
          >
            <option value="Last 30 days">Last 30 days</option>
            <option value="Last 90 days">Last 90 days</option>
            <option value="This Year">This Year</option>
          </select>
          <ChevronDown
            size={12}
            style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}
          />
        </div>
      </div>

      {/* Area Chart SVG */}
      <div style={{ width: '100%', position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isLight ? '#10B981' : '#4FF2B0'} stopOpacity={isLight ? 0.24 : 0.32} />
              <stop offset="100%" stopColor={isLight ? '#10B981' : '#4FF2B0'} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="trendLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={isLight ? '#059669' : '#20C997'} />
              <stop offset="60%" stopColor={isLight ? '#10B981' : '#4FF2B0'} />
              <stop offset="100%" stopColor={isLight ? '#3B82F6' : '#38BDF8'} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 10, 20, 30, 40].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke={isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.05)'}
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                  fill={isLight ? '#94A3B8' : 'var(--text-muted)'}
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Area polygon */}
          <path d={areaD} fill="url(#trendGradient)" />

          {/* Smooth line */}
          <path d={pathD} fill="none" stroke="url(#trendLine)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Current Rate Pulse on Last Point */}
          <circle
            cx={lastX}
            cy={lastY}
            r="7"
            fill="none"
            stroke={isLight ? '#10B981' : '#4FF2B0'}
            strokeWidth="1.5"
            style={{ opacity: 0.7, animation: 'pulseDot 2s infinite' }}
          />
          <circle
            cx={lastX}
            cy={lastY}
            r="4"
            fill={isLight ? '#10B981' : '#4FF2B0'}
            stroke={isLight ? '#FFFFFF' : '#06110F'}
            strokeWidth="2"
            style={{ filter: isLight ? 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))' : 'drop-shadow(0 0 6px rgba(79, 242, 176, 0.8))' }}
          />

          {/* X Axis Date Labels & Hover targets */}
          {points.map((pt, i) => {
            const cx = getX(i);
            const cy = getY(pt.rate);
            const isHovered = hoveredPoint?.date === pt.date;

            return (
              <g
                key={pt.date}
                onMouseEnter={() => setHoveredPoint({ date: pt.date, rate: pt.rate, cx, cy })}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                <text
                  x={cx}
                  y={height - 2}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight={isHovered ? 700 : 500}
                  fill={isHovered ? (isLight ? '#10B981' : 'var(--brand-primary)') : (isLight ? '#64748B' : 'var(--text-muted)')}
                >
                  {pt.date}
                </text>

                {/* Invisible hover area */}
                <rect x={cx - 15} y={0} width={30} height={height} fill="transparent" />

                {isHovered && (
                  <g>
                    <line x1={cx} y1={paddingY} x2={cx} y2={height - paddingY} stroke={isLight ? '#10B981' : '#4FF2B0'} strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={cx} cy={cy} r="4" fill={isLight ? '#10B981' : '#4FF2B0'} stroke={isLight ? '#FFFFFF' : '#06110F'} strokeWidth="2" />
                    <rect
                      x={cx - 30}
                      y={cy - 24}
                      width="60"
                      height="18"
                      rx="4"
                      fill={isLight ? '#FFFFFF' : '#0B1C17'}
                      stroke={isLight ? '#10B981' : 'var(--brand-primary)'}
                      strokeWidth="1"
                      style={{ filter: isLight ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))' : 'none' }}
                    />
                    <text x={cx} y={cy - 12} textAnchor="middle" fontSize="9" fontWeight="800" fill={isLight ? '#0B1324' : 'var(--text-primary)'} fontFamily="var(--font-mono)">
                      {pt.rate}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <style>{`
          @keyframes pulseDot {
            0% { r: 4px; opacity: 1; }
            70% { r: 10px; opacity: 0; }
            100% { r: 10px; opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
};
