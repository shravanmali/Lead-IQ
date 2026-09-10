import React from 'react';
import { Lead } from '../../types/lead';
import { LeadScoreBadge } from '../common/LeadScoreBadge';
import { LeadStatusBadge } from '../common/LeadStatusBadge';
import { Phone, ArrowRight, Sparkles, Send, MapPin } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface LeadTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onCallLead?: (lead: Lead) => void;
  highlightTopLead?: boolean;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onSelectLead,
  onCallLead,
  highlightTopLead = false
}) => {
  if (leads.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        No matching leads found for current filter criteria.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table-custom">
        <thead>
          <tr>
            {highlightTopLead && <th style={{ width: '110px' }}>Priority</th>}
            <th>Lead Name & Company</th>
            <th>Location & Contact</th>
            <th>Pipeline Status</th>
            <th>AI Predictive Score</th>
            <th>Assigned Staff</th>
            <th>Est. Deal Value</th>
            <th>Next Action</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, idx) => {
            const isTop1 = highlightTopLead && idx === 0;

            return (
              <tr
                key={lead.id}
                style={{
                  backgroundColor: isTop1 ? 'var(--brand-primary-light)' : undefined
                }}
              >
                {highlightTopLead && (
                  <td>
                    {isTop1 ? (
                      <span className="badge badge-ai-priority">
                        #1 PRIORITY
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '0.5rem' }}>
                        #{idx + 1}
                      </span>
                    )}
                  </td>
                )}

                <td>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{lead.name}</span>
                      {lead.telegramUsername && (
                        <span title={`Telegram: @${lead.telegramUsername}`} style={{ color: 'var(--brand-secondary)' }}>
                          <Send size={12} />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {lead.title} • <strong style={{ color: 'var(--text-primary)' }}>{lead.company}</strong>
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    <MapPin size={12} style={{ color: 'var(--brand-primary)' }} />
                    <span>{lead.country}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{lead.phone}</div>
                </td>

                <td>
                  <LeadStatusBadge status={lead.status} />
                </td>

                <td>
                  <LeadScoreBadge score={lead.score} />
                </td>

                <td>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lead.assignedStaffName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {lead.lastContact}
                  </div>
                </td>

                <td>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {formatINR(lead.dealValue)}
                  </span>
                </td>

                <td style={{ maxWidth: '200px' }}>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={lead.nextAction}
                  >
                    {lead.nextAction}
                  </div>
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {onCallLead && (
                      <button
                        onClick={() => onCallLead(lead)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.35rem 0.65rem' }}
                        title="Start AI Simulated Call"
                      >
                        <Phone size={13} />
                        <span>Call</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectLead(lead)}
                      className="btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem' }}
                      title="View Complete Lead Profile"
                    >
                      <span>Profile</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
