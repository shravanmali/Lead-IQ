import React from 'react';
import { Lead } from '../../types/lead';
import { formatINR } from '../../utils/formatters';
import { LeadScoreBadge } from '../common/LeadScoreBadge';
import { LeadStatusBadge } from '../common/LeadStatusBadge';
import {
  Sparkles,
  Flame,
  PhoneCall,
  Send,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle2,
  Building,
  MapPin
} from 'lucide-react';

export interface AIPriorityQueueProps {
  leads: Lead[];
  onCallLead?: (lead: Lead) => void;
  onSendTelegram?: (lead: Lead) => void;
  onViewLead?: (lead: Lead) => void;
  maxItems?: number;
}

export const AIPriorityQueue: React.FC<AIPriorityQueueProps> = ({
  leads,
  onCallLead,
  onSendTelegram,
  onViewLead,
  maxItems = 4
}) => {
  const sortedLeads = [...leads].sort((a, b) => b.score.score - a.score.score);
  const heroLead = sortedLeads[0];
  const secondaryLeads = sortedLeads.slice(1, maxItems);

  if (!heroLead) return null;

  const handleLeadNav = (lead: Lead) => {
    if (onViewLead) {
      onViewLead(lead);
    } else {
      window.location.hash = `#/staff/leads/${lead.id}`;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #4FF2B0 0%, #20C997 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06110F',
              boxShadow: '0 2px 8px rgba(79, 242, 176, 0.3)'
            }}
          >
            <Sparkles size={14} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            AI Priority Queue
          </h3>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.1rem 0.45rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(79, 242, 176, 0.12)',
              color: 'var(--brand-primary)',
              border: '1px solid var(--brand-primary-border)'
            }}
          >
            Real-time Intent
          </span>
        </div>

        <a
          href="#/staff/smart-leads"
          className="btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--brand-primary)' }}
        >
          <span>View All Ranked Leads</span>
          <ArrowRight size={13} />
        </a>
      </div>

      {/* Hero #1 Prioritized Lead Card */}
      <div
        className="glass-card card-hover"
        style={{
          padding: '1.4rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(79, 242, 176, 0.28)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 24px rgba(79, 242, 176, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Priority Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-primary)',
                color: '#06110F',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Flame size={12} />
              #1 PRIORITY OPPORTUNITY
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Probability: <strong>{heroLead.score.probability}%</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LeadStatusBadge status={heroLead.status} size="sm" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
              {formatINR(heroLead.dealValue)}
            </span>
          </div>
        </div>

        {/* Lead Main Info & Radial Score Ring */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <LeadScoreBadge score={heroLead.score} size="radial" />
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
                {heroLead.name}
              </h4>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {heroLead.title} • <strong style={{ color: 'var(--text-primary)' }}>{heroLead.company}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>{heroLead.country}</span>
                <span>•</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{heroLead.phone}</span>
              </div>
            </div>
          </div>

          {/* Key Buying Signals */}
          <div
            style={{
              padding: '0.65rem 0.95rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '340px'
            }}
          >
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
              Primary Buying Signals
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
              • {heroLead.score.factors[0] || 'High purchase intent observed'}
            </div>
            {heroLead.score.factors[1] && (
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                • {heroLead.score.factors[1]}
              </div>
            )}
          </div>
        </div>

        {/* Actionable Recommendation Bar & CTAs */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(79, 242, 176, 0.08)',
            border: '1px solid rgba(79, 242, 176, 0.20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <Clock size={15} style={{ color: 'var(--brand-primary)' }} />
            <span>
              <strong>AI Recommendation:</strong> {heroLead.nextAction}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onCallLead && (
              <button
                onClick={() => onCallLead(heroLead)}
                className="btn btn-primary btn-sm"
                title="Initiate Whisper Audio Call"
              >
                <PhoneCall size={13} />
                <span>Call Lead</span>
              </button>
            )}

            {onSendTelegram && heroLead.telegramUsername && (
              <button
                onClick={() => onSendTelegram(heroLead)}
                className="btn btn-secondary btn-sm"
                title="Direct Follow-up"
              >
                <Send size={13} />
                <span>Message</span>
              </button>
            )}

            <button
              onClick={() => handleLeadNav(heroLead)}
              className="btn-ghost btn-sm"
              style={{ padding: '0.35rem 0.5rem', color: 'var(--brand-primary)' }}
            >
              <span>View Dossier</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Priority Leads Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
        {secondaryLeads.map((lead, idx) => (
          <div
            key={lead.id}
            className="glass-card card-hover"
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    #{idx + 2}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {lead.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {lead.company} • {lead.country}
                </div>
              </div>

              <LeadScoreBadge score={lead.score} size="sm" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>
                {formatINR(lead.dealValue)}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                {lead.nextAction}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
              <button
                onClick={() => handleLeadNav(lead)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
              >
                <span>Call / Profile</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
