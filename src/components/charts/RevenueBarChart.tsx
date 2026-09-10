import React, { useState } from 'react';
import { StaffRevenueMetric } from '../../types/revenue';
import { formatINR, formatINRShort } from '../../utils/formatters';

interface RevenueBarChartProps {
  data: StaffRevenueMetric[];
  height?: number;
}

export const RevenueBarChart: React.FC<RevenueBarChartProps> = ({ data, height = 260 }) => {
  const [hoveredStaff, setHoveredStaff] = useState<StaffRevenueMetric | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.totalRevenue)) * 1.15;
  const paddingX = 40;
  const paddingY = 30;
  const width = 600;
  const barWidth = 36;

  const getX = (index: number) => paddingX + (index + 0.5) * ((width - paddingX * 2) / data.length);
  const getY = (val: number) => height - paddingY - (val / maxVal) * (height - paddingY * 2);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const y = height - paddingY - ratio * (height - paddingY * 2);
          const val = Math.round(ratio * maxVal);
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
              <text x={paddingX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">
                {formatINRShort(val)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const cx = getX(i);
          const y = getY(d.totalRevenue);
          const barHeight = height - paddingY - y;
          const isHovered = hoveredStaff?.staffId === d.staffId;

          return (
            <g
              key={d.staffId}
              onMouseEnter={() => setHoveredStaff(d)}
              onMouseLeave={() => setHoveredStaff(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={cx - barWidth / 2}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="6"
                fill={isHovered ? 'var(--brand-primary)' : 'url(#barGradient)'}
                opacity={isHovered ? 1 : 0.88}
                style={{ transition: 'all 0.2s ease' }}
              />

              {/* Value on top of bar in Lakhs */}
              <text
                x={cx}
                y={y - 8}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="var(--text-primary)"
              >
                {formatINRShort(d.totalRevenue)}
              </text>

              {/* Staff Name at bottom */}
              <text
                x={cx}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isHovered ? 700 : 500}
                fill={isHovered ? 'var(--brand-primary)' : 'var(--text-secondary)'}
              >
                {d.staffName.split(' ')[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
