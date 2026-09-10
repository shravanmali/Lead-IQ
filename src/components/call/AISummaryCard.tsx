import React from 'react';
import { AISummary } from '../../types/call';
import { Sparkles, CheckCircle2, AlertCircle, Clock, HeartHandshake, Zap } from 'lucide-react';

interface AISummaryCardProps {
  summary: AISummary;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ summary }) => {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--brand-primary)' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            AI Executive Call Summary
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
            Sentiment: {summary.sentimentScore}%
          </span>
          <span className="badge badge-warm" style={{ fontSize: '0.75rem' }}>
            Intent: {summary.buyingIntentScore}%
          </span>
        </div>
      </div>

      {/* Overview */}
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
        {summary.overview}
      </p>

      {/* Dual Column: Discussion Points vs Objections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Key Points */}
        <div
          style={{
            padding: '1rem 1.15rem',
            backgroundColor: 'rgba(79, 242, 176, 0.04)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(79, 242, 176, 0.18)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.625rem' }}>
            <CheckCircle2 size={15} />
            <span>Key Discussion Points</span>
          </div>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
            {summary.keyDiscussionPoints.map((pt, i) => (
              <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {pt}
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Objections / Nuances */}
        <div
          style={{
            padding: '1rem 1.15rem',
            backgroundColor: 'rgba(245, 158, 11, 0.04)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.625rem' }}>
            <AlertCircle size={15} />
            <span>Customer Objections / Questions</span>
          </div>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
            {summary.customerObjections.map((obj, i) => (
              <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Timeline Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(79, 242, 176, 0.08)',
          border: '1px solid rgba(79, 242, 176, 0.22)',
          fontSize: '0.8125rem',
          color: 'var(--brand-primary)'
        }}
      >
        <Clock size={15} />
        <span><strong>AI Recommended Timeline:</strong> {summary.recommendedTimeline}</span>
      </div>
    </div>
  );
};
