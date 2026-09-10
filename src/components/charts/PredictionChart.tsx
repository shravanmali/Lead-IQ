import React, { useState } from 'react';
import { RevenuePredictionPoint } from '../../types/revenue';
import { formatINR, formatINRShort } from '../../utils/formatters';
import { Sparkles, TrendingUp } from 'lucide-react';

interface PredictionChartProps {
  data: RevenuePredictionPoint[];
  height?: number;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ data, height = 340 }) => {
  const [hoveredPoint, setHoveredPoint] = useState<RevenuePredictionPoint | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.upperConfidence)) * 1.12;
  const minVal = 1800000;
  const paddingX = 50;
  const paddingY = 40;
  const width = 820;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
  const getY = (val: number) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);

  // Confidence Interval Path (Upper -> Lower in reverse)
  const upperPoints = data.map((d, i) => `${getX(i)},${getY(d.upperConfidence)}`).join(' ');
  const lowerPointsRev = [...data].reverse().map((d, i) => `${getX(data.length - 1 - i)},${getY(d.lowerConfidence)}`).join(' ');
  const confidenceArea = `${upperPoints} ${lowerPointsRev}`;

  // Actual vs Predicted points
  const actualData = data.filter(d => d.actual !== undefined);
  const actualPath = actualData.map((d, i) => `${getX(i)},${getY(d.actual!)}`).join(' ');

  // Predicted Path
  const predictedPath = data.map((d, i) => `${getX(i)},${getY(d.predicted)}`).join(' ');

  return (
    <div style={{ width: '100%', position: 'relative', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="emeraldConfidenceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4FF2B0" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#4FF2B0" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="predictedEmeraldGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#4FF2B0" />
            <stop offset="100%" stopColor="#20C997" />
          </linearGradient>
        </defs>

        {/* Horizontal grid */}
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
              <text x={paddingX - 10} y={y + 4} textAnchor="end" fontSize="11" fontFamily="var(--font-mono)" fill="var(--text-muted)">
                {formatINRShort(val)}
              </text>
            </g>
          );
        })}

        {/* AI Confidence Band */}
        <polygon points={confidenceArea} fill="url(#emeraldConfidenceGradient)" />

        {/* AI Predicted Line */}
        <polyline
          points={predictedPath}
          fill="none"
          stroke="url(#predictedEmeraldGradient)"
          strokeWidth="3.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Actual Line */}
        <polyline
          points={actualPath}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Vertical divider indicating Current Baseline */}
        {(() => {
          const currentIndex = data.findIndex(d => d.date.includes('Current'));
          if (currentIndex === -1) return null;
          const cx = getX(currentIndex);
          return (
            <g>
              <line
                x1={cx}
                y1={paddingY}
                x2={cx}
                y2={height - paddingY}
                stroke="var(--brand-primary)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <rect
                x={cx - 50}
                y={paddingY - 14}
                width="100"
                height="20"
                rx="4"
                fill="var(--brand-primary)"
              />
              <text
                x={cx}
                y={paddingY}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill="#06110F"
              >
                NOW (AI SPLIT)
              </text>
            </g>
          );
        })()}

        {/* Points & Interactive Tooltips */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.predicted);
          const isActual = d.actual !== undefined;
          const isHovered = hoveredPoint?.date === d.date;

          return (
            <g
              key={d.date}
              onMouseEnter={() => setHoveredPoint(d)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Point Dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 7 : 5}
                fill={isActual ? '#38bdf8' : '#4FF2B0'}
                stroke="#091914"
                strokeWidth={isHovered ? 3 : 2}
                style={{ transition: 'all 0.15s ease' }}
              />

              {/* X Date Label */}
              <text
                x={cx}
                y={height - 12}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isHovered ? 700 : 500}
                fill={isHovered ? 'var(--brand-primary)' : 'var(--text-secondary)'}
              >
                {d.date.split('(')[0]}
              </text>

              {/* Milestone badge above point if present */}
              {d.milestone && !isHovered && (
                <g>
                  <text
                    x={cx}
                    y={cy - 12}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fill="var(--brand-primary)"
                  >
                    {d.milestone}
                  </text>
                </g>
              )}

              {/* Hovered Tooltip Card */}
              {isHovered && (
                <g>
                  <rect
                    x={cx - 95}
                    y={cy - 68}
                    width="190"
                    height="58"
                    rx="8"
                    fill="#0B1C17"
                    stroke="var(--brand-primary)"
                    strokeWidth="1.5"
                    filter="drop-shadow(0 8px 24px rgba(0,0,0,0.6))"
                  />
                  <text x={cx} y={cy - 48} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
                    {d.date}
                  </text>
                  <text x={cx} y={cy - 32} textAnchor="middle" fontSize="12" fontWeight="800" fontFamily="var(--font-mono)" fill="var(--brand-primary)">
                    Predicted: {formatINR(d.predicted)}
                  </text>
                  <text x={cx} y={cy - 18} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--text-muted)">
                    Confidence: {formatINRShort(d.lowerConfidence)} – {formatINRShort(d.upperConfidence)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend & Confidence explanation */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '1rem',
          padding: '0.875rem 1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
            <span style={{ width: '14px', height: '4px', backgroundColor: '#38bdf8', borderRadius: '2px' }} />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Historical Actual (₹)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
            <span style={{ width: '14px', height: '3px', borderTop: '3px dashed #4FF2B0', borderRadius: '2px' }} />
            <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>AI Forecast Curve (₹)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
            <span style={{ width: '14px', height: '10px', backgroundColor: 'rgba(79, 242, 176, 0.25)', borderRadius: '2px' }} />
            <span style={{ color: 'var(--text-muted)' }}>95% Confidence Band</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
          <Sparkles size={14} />
          <span>Continuous ML Bayesian Forecast Model (India Region)</span>
        </div>
      </div>
    </div>
  );
};
