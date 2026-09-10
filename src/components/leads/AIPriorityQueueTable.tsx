import React from 'react';
import { Lead } from '../../types/lead';
import { Sparkles, PhoneCall, Mail, Send, Calendar, Clock, ArrowRight } from 'lucide-react';
import { LeadScoreBadge } from '../common/LeadScoreBadge';
import { useTheme } from '../../context/ThemeContext';

export interface AIPriorityQueueTableProps {
  leads: Lead[];
  onCallLead?: (lead: Lead) => void;
  onSendEmail?: (lead: Lead) => void;
  onSendTelegram?: (lead: Lead) => void;
  onSelectLead?: (lead: Lead) => void;
  maxItems?: number;
}

export const AIPriorityQueueTable: React.FC<AIPriorityQueueTableProps> = ({
  leads,
  onCallLead,
  onSendEmail,
  onSendTelegram,
  onSelectLead,
  maxItems = 5
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Sort descending by AI score
  const sortedLeads = [...leads].sort((a, b) => b.score.score - a.score.score).slice(0, maxItems);

  const getIntentBadge = (score: number) => {
    if (score >= 88) {
      return {
        label: 'High',
        bg: isLight ? '#FEE2E2' : 'rgba(239, 68, 68, 0.14)',
        text: isLight ? '#DC2626' : '#F87171',
        border: isLight ? '1px solid #FECACA' : '1px solid rgba(239, 68, 68, 0.28)'
      };
    } else if (score >= 70) {
      return {
        label: 'Warm',
        bg: isLight ? '#FEF3C7' : 'rgba(245, 158, 11, 0.14)',
        text: isLight ? '#D97706' : '#FBBF24',
        border: isLight ? '1px solid #FDE68A' : '1px solid rgba(245, 158, 11, 0.28)'
      };
    } else {
      return {
        label: 'Nurture',
        bg: isLight ? '#E0F2FE' : 'rgba(56, 189, 248, 0.14)',
        text: isLight ? '#0284C7' : '#38BDF8',
        border: isLight ? '1px solid #BAE6FD' : '1px solid rgba(56, 189, 248, 0.28)'
      };
    }
  };

  const getActionDetails = (lead: Lead) => {
    const action = lead.nextAction.toLowerCase();
    if (action.includes('call') || lead.score.score >= 88) {
      return {
        label: 'Call Now',
        icon: PhoneCall,
        handler: () => (onCallLead ? onCallLead(lead) : (window.location.hash = `#/staff/leads/${lead.id}`)),
        primary: true
      };
    }
    if (action.includes('email') || action.includes('proposal')) {
      return {
        label: 'Send Email',
        icon: Mail,
        handler: () => (onSendEmail ? onSendEmail(lead) : (window.location.hash = `#/staff/leads/${lead.id}`)),
        primary: false
      };
    }
    if (action.includes('telegram') || action.includes('whatsapp')) {
      return {
        label: lead.telegramUsername ? 'WhatsApp / TG' : 'Message',
        icon: Send,
        handler: () => (onSendTelegram ? onSendTelegram(lead) : (window.location.hash = `#/staff/leads/${lead.id}`)),
        primary: false
      };
    }
    if (action.includes('schedule') || action.includes('demo')) {
      return {
        label: 'Schedule',
        icon: Calendar,
        handler: () => (onSelectLead ? onSelectLead(lead) : (window.location.hash = `#/staff/leads/${lead.id}`)),
        primary: false
      };
    }
    return {
      label: 'Follow Up',
      icon: Clock,
      handler: () => (onSelectLead ? onSelectLead(lead) : (window.location.hash = `#/staff/leads/${lead.id}`)),
      primary: false
    };
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.4rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        backgroundColor: isLight ? '#FFFFFF' : undefined,
        border: isLight ? '1px solid #E2E8F0' : undefined,
        boxShadow: isLight ? '0 2px 14px rgba(0, 0, 0, 0.03)' : undefined
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: isLight ? '#ECFDF5' : 'linear-gradient(135deg, rgba(79, 242, 176, 0.25) 0%, rgba(32, 201, 151, 0.1) 100%)',
              border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)',
              boxShadow: isLight ? '0 2px 6px rgba(16, 185, 129, 0.15)' : '0 0 12px rgba(79, 242, 176, 0.25)'
            }}
          >
            <Sparkles size={17} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              AI Priority Queue
            </h3>
            <p style={{ fontSize: '0.78rem', color: isLight ? '#64748B' : 'var(--text-secondary)', margin: 0 }}>
              Top leads to contact based on AI analysis
            </p>
          </div>
        </div>

        <a
          href="#/staff/smart-leads"
          className="btn-ghost btn-sm"
          style={{
            fontSize: '0.78rem',
            color: 'var(--brand-primary)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            textDecoration: 'none'
          }}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </a>
      </div>

      {/* Leads Table */}
      <div className="table-container" style={{ margin: 0, border: isLight ? '1px solid #E2E8F0' : undefined }}>
        <table className="table-custom">
          <thead>
            <tr>
              <th style={{ width: '38px', textAlign: 'center' }}>#</th>
              <th>Lead</th>
              <th>Company</th>
              <th style={{ textAlign: 'center' }}>AI Score</th>
              <th style={{ textAlign: 'center' }}>Intent</th>
              <th>Last Activity</th>
              <th style={{ textAlign: 'right' }}>Next Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeads.map((lead, idx) => {
              const intent = getIntentBadge(lead.score.score);
              const action = getActionDetails(lead);
              const ActionIcon = action.icon;
              const lastActivity = lead.score.factors[0] || 'Active discussion stage';

              return (
                <tr
                  key={lead.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectLead ? onSelectLead(lead) : (window.location.hash = `#/staff/leads/${lead.id}`)}
                >
                  {/* Rank Column */}
                  <td style={{ textAlign: 'center', fontWeight: 800, color: idx === 0 ? 'var(--brand-primary)' : 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    {idx + 1}
                  </td>

                  {/* Lead Name & Location */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: idx === 0
                            ? (isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.15)')
                            : (isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.05)'),
                          border: idx === 0
                            ? (isLight ? '1.5px solid #10B981' : '1.5px solid rgba(79, 242, 176, 0.4)')
                            : (isLight ? '1px solid #CBD5E1' : '1px solid var(--border-subtle)'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.8125rem',
                          color: idx === 0 ? 'var(--brand-primary)' : 'var(--text-primary)',
                          flexShrink: 0
                        }}
                      >
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                          {lead.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {lead.title}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {lead.company}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {lead.country}
                    </div>
                  </td>

                  {/* AI Score (Circular Radial Indicator) */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LeadScoreBadge score={lead.score} size="radial" />
                    </div>
                  </td>

                  {/* Intent Badge */}
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.18rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: intent.bg,
                        color: intent.text,
                        border: intent.border
                      }}
                    >
                      {intent.label}
                    </span>
                  </td>

                  {/* Last Activity */}
                  <td>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                      {lastActivity}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                      <Clock size={11} />
                      <span>{lead.lastContact ? new Date(lead.lastContact).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent interaction'}</span>
                    </div>
                  </td>

                  {/* Next Action Button */}
                  <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={action.handler}
                      className={action.primary ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.75rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: !action.primary && isLight ? '#ECFDF5' : undefined,
                        borderColor: !action.primary && isLight ? '#A7F3D0' : undefined,
                        color: !action.primary && isLight ? '#065F46' : undefined,
                        boxShadow: action.primary ? (isLight ? '0 2px 8px rgba(16, 185, 129, 0.25)' : '0 2px 10px rgba(79, 242, 176, 0.3)') : 'none'
                      }}
                    >
                      <ActionIcon size={13} />
                      <span>{action.label}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
