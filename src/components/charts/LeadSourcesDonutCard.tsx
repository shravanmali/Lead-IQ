import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LeadSourcesDonutCardProps {
  totalLeads?: number;
  sources?: {
    name: string;
    count: number;
    percent: number;
    color: string;
  }[];
  onViewDetails?: () => void;
}

export const LeadSourcesDonutCard: React.FC<LeadSourcesDonutCardProps> = ({
  totalLeads = 1284,
  sources = [
    { name: 'Website', count: 482, percent: 37.5, color: '#10B981' },
    { name: 'Instagram', count: 295, percent: 23.0, color: '#3B82F6' },
    { name: 'WhatsApp', count: 210, percent: 16.4, color: '#059669' },
    { name: 'Email', count: 142, percent: 11.1, color: '#8B5CF6' },
    { name: 'Facebook', count: 98, percent: 7.6, color: '#EF4444' },
    { name: 'Referral', count: 57, percent: 4.4, color: '#F59E0B' }
  ],
  onViewDetails
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);

  // SVG Donut Calculations
  const size = 150;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem 1.4rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: isLight ? '#FFFFFF' : undefined,
        border: isLight ? '1px solid #E2E8F0' : undefined,
        boxShadow: isLight ? '0 2px 12px rgba(0, 0, 0, 0.03)' : undefined
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Lead Sources
        </div>
        <a
          href="#/manager/leads"
          onClick={e => {
            if (onViewDetails) {
              e.preventDefault();
              onViewDetails();
            }
          }}
          className="btn-ghost btn-sm"
          style={{
            fontSize: '0.72rem',
            padding: '0.2rem 0.45rem',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            textDecoration: 'none'
          }}
        >
          <span>View Details</span>
          <ArrowRight size={12} />
        </a>
      </div>

      {/* Donut Graphic + Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '0.25rem 0' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {sources.map((s) => {
            const strokeDasharray = `${(s.percent / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += s.percent;
            const isHovered = hoveredSource === s.name;

            return (
              <circle
                key={s.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={s.color}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                onMouseEnter={() => setHoveredSource(s.name)}
                onMouseLeave={() => setHoveredSource(null)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: hoveredSource && !isHovered ? 0.35 : 1,
                  filter: isHovered ? `drop-shadow(0 0 6px ${s.color})` : 'none'
                }}
              />
            );
          })}
        </svg>

        {/* Center Total Counter */}
        <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
            {totalLeads.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Leads
          </div>
        </div>
      </div>

      {/* Source Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem 0.75rem', borderTop: isLight ? '1px solid #F1F5F9' : '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
        {sources.map((s) => {
          const isHovered = hoveredSource === s.name;
          return (
            <div
              key={s.name}
              onMouseEnter={() => setHoveredSource(s.name)}
              onMouseLeave={() => setHoveredSource(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.2rem 0.35rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isHovered ? (isLight ? '#F8FAF9' : 'rgba(255, 255, 255, 0.04)') : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflow: 'hidden' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: s.color,
                    flexShrink: 0,
                    boxShadow: isHovered ? `0 0 6px ${s.color}` : 'none'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isHovered ? 700 : 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {s.name}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {s.percent}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
