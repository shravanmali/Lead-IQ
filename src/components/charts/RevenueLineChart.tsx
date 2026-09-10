import React, { useState } from 'react';
import { RevenueDataPoint } from '../../types/revenue';
import { formatINR, formatINRShort } from '../../utils/formatters';

interface RevenueLineChartProps {
  data: RevenueDataPoint[];
  height?: number;
}

export const RevenueLineChart: React.FC<RevenueLineChartProps> = ({ data, height = 300 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => Math.max(d.actualRevenue, d.targetRevenue))) * 1.15;
  const minVal = 0;
  const paddingX = 45;
  const paddingY = 30;
  const width = 700;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
  const getY = (val: number) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);

  // Generate Actual Path
  const actualPoints = data.map((d, i) => `${getX(i)},${getY(d.actualRevenue)}`).join(' ');
  const actualAreaPoints = `${getX(0)},${height - paddingY} ${actualPoints} ${getX(data.length - 1)},${height - paddingY}`;

  // Generate Target Path
  const targetPoints = data.map((d, i) => `${getX(i)},${getY(d.targetRevenue)}`).join(' ');

  return (
    <div style={{ width: '100%', position: 'relative', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = height - paddingY - ratio * (height - paddingY * 2);
          const val = Math.round(minVal + ratio * (maxVal - minVal));
          return (
            <g key={i}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="var(--border-subtle)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="var(--text-muted)"
              >
                {formatINRShort(val)}
              </text>
            </g>
          );
        })}

        {/* Actual Area */}
        <polygon points={actualAreaPoints} fill="url(#actualGradient)" />

        {/* Target Line (Dashed) */}
        <polyline
          points={targetPoints}
          fill="none"
          stroke="var(--border-strong)"
          strokeDasharray="5 5"
          strokeWidth="2"
          opacity="0.7"
        />

        {/* Actual Line */}
        <polyline
          points={actualPoints}
          fill="none"
          stroke="url(#lineGlow)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & X labels */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.actualRevenue);
          const isHovered = hoveredIndex === i;

          return (
            <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} style={{ cursor: 'pointer' }}>
              <text
                x={cx}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill={isHovered ? 'var(--brand-primary)' : 'var(--text-secondary)'}
                fontWeight={isHovered ? 700 : 500}
              >
                {d.period.split(' ')[0]}
              </text>

              {/* Dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : 4}
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth={isHovered ? 3 : 2}
                style={{ transition: 'all 0.15s ease' }}
              />

              {isHovered && (
                <g>
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={height - paddingY}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  {/* Tooltip Card */}
                  <rect
                    x={cx - 75}
                    y={cy - 48}
                    width="150"
                    height="38"
                    rx="6"
                    fill="var(--bg-surface-elevated)"
                    stroke="var(--brand-primary)"
                    strokeWidth="1"
                    filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
                  />
                  <text
                    x={cx}
                    y={cy - 32}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="var(--text-primary)"
                  >
                    {formatINR(d.actualRevenue)}
                  </text>
                  <text
                    x={cx}
                    y={cy - 18}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--text-muted)"
                  >
                    Target: {formatINR(d.targetRevenue)} ({d.dealsClosed} deals)
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span style={{ width: '12px', height: '3px', borderRadius: '2px', background: 'var(--brand-gradient)' }} />
          <span>Actual Recognized Revenue (₹)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <span style={{ width: '12px', height: '2px', borderRadius: '2px', borderTop: '2px dashed var(--border-strong)' }} />
          <span>Target Milestone (₹)</span>
        </div>
      </div>
    </div>
  );
};
