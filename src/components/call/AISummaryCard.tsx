import React from 'react';
import { AISummary } from '../../types/call';
import { Sparkles, CheckCircle2, AlertCircle, Clock, HeartHandshake, Zap } from 'lucide-react';

interface AISummaryCardProps {
  summary: AISummary;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ summary }) => {
  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--brand-primary)' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            AI Executive Call Summary
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge" style={{ backgroundColor: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
            Sentiment: {summary.sentimentScore}%
          </span>
          <span className="badge badge-warm">
            Intent: {summary.buyingIntentScore}%
          </span>
        </div>
      </div>

      {/* Overview */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
        {summary.overview}
      </p>

      {/* Dual Column: Discussion Points vs Objections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Key Points */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: '#10b981', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={15} />
            <span>Key Discussion Points</span>
          </div>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0 }}>
            {summary.keyDiscussionPoints.map((pt, i) => (
              <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {pt}
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Objections / Nuances */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem' }}>
            <AlertCircle size={15} />
            <span>Customer Objections / Questions</span>
          </div>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0 }}>
            {summary.customerObjections.map((obj, i) => (
              <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
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
          backgroundColor: 'var(--brand-primary-light)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          fontSize: '0.8125rem',
          color: 'var(--brand-primary)'
        }}
      >
        <Clock size={16} />
        <span><strong>AI Recommended Timeline:</strong> {summary.recommendedTimeline}</span>
      </div>
    </div>
  );
};
