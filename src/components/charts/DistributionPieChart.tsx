import React from 'react';
import { SourceRevenueMetric } from '../../types/revenue';
import { formatINR } from '../../utils/formatters';

interface DistributionPieChartProps {
  data: SourceRevenueMetric[];
}

export const DistributionPieChart: React.FC<DistributionPieChartProps> = ({ data }) => {
  const total = data.reduce((acc, d) => acc + d.revenue, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Visual Multi-Segment Bar */}
      <div
        style={{
          display: 'flex',
          height: '14px',
          width: '100%',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface-elevated)'
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
        {data.map(d => {
          const percent = ((d.revenue / total) * 100).toFixed(1);
          return (
            <div
              key={d.source}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.84rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: d.color,
                    flexShrink: 0
                  }}
                />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{d.source}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({d.leadsCount} leads)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatINR(d.revenue)}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    minWidth: '42px',
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
