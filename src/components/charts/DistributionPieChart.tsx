import React from 'react';
import { SourceRevenueMetric } from '../../types/revenue';
import { formatINR } from '../../utils/formatters';

interface DistributionPieChartProps {
  data: SourceRevenueMetric[];
}

export const DistributionPieChart: React.FC<DistributionPieChartProps> = ({ data }) => {
  const total = data.reduce((acc, d) => acc + d.revenue, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Visual Multi-Segment Bar */}
      <div
        style={{
          display: 'flex',
          height: '14px',
          width: '100%',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {data.map(d => {
          const percent = (d.revenue / total) * 100;
          return (
            <div
              key={d.source}
              style={{
                width: `${percent}%`,
                backgroundColor: d.color,
                transition: 'width 0.3s ease'
              }}
              title={`${d.source}: ${formatINR(d.revenue)} (${percent.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* List breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.map(d => {
          const percent = ((d.revenue / total) * 100).toFixed(1);
          return (
            <div
              key={d.source}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.84rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: d.color,
                    boxShadow: `0 0 8px ${d.color}80`,
                    flexShrink: 0
                  }}
                />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{d.source}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({d.leadsCount} leads)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {formatINR(d.revenue)}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--brand-primary)',
                    backgroundColor: 'rgba(79, 242, 176, 0.1)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-sm)',
                    minWidth: '46px',
                    textAlign: 'right'
                  }}
                >
                  {percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
