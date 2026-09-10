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
      <div style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--text-muted)' }}>
        No matching leads found for current filter criteria.
      </div>
    );
  }

  return (
    <div className="table-container" style={{ overflowX: 'auto' }}>
      <table className="table-custom" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {highlightTopLead && <th style={{ width: '90px' }}>Rank</th>}
            <th>Lead & Organization</th>
            <th>Contact & City</th>
            <th>Status</th>
            <th>AI Score</th>
            <th>Account Owner</th>
            <th>Deal Size</th>
            <th>Recommended Action</th>
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
                  backgroundColor: isTop1 ? 'rgba(79, 242, 176, 0.06)' : undefined,
                  borderLeft: isTop1 ? '3px solid var(--brand-primary)' : undefined,
                  transition: 'background-color var(--transition-fast)'
                }}
              >
                {highlightTopLead && (
                  <td>
                    {isTop1 ? (
                      <span className="badge" style={{ backgroundColor: 'rgba(79, 242, 176, 0.15)', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.68rem' }}>
                        #1 HOT
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', paddingLeft: '0.25rem' }}>
                        #{idx + 1}
                      </span>
                    )}
                  </td>
                )}

                <td>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{lead.name}</span>
                      {lead.telegramUsername && (
                        <span title={`Telegram: @${lead.telegramUsername}`} style={{ color: 'var(--brand-secondary)' }}>
                          <Send size={11} />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                      {lead.title} • <strong style={{ color: 'var(--text-primary)' }}>{lead.company}</strong>
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    <MapPin size={11} style={{ color: 'var(--brand-primary)' }} />
                    <span>{lead.country}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{lead.phone}</div>
                </td>

                <td>
                  <LeadStatusBadge status={lead.status} size="sm" />
                </td>

                <td>
                  <LeadScoreBadge score={lead.score} size="sm" />
                </td>

                <td>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {lead.assignedStaffName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {lead.lastContact}
                  </div>
                </td>

                <td>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {formatINR(lead.dealValue)}
                  </span>
                </td>

                <td style={{ maxWidth: '180px' }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                    {onCallLead && (
                      <button
                        onClick={() => onCallLead(lead)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        title="Start AI Simulated Call"
                      >
                        <Phone size={12} />
                        <span>Call</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectLead(lead)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      title="View Complete Lead Profile"
                    >
                      <span>Dossier</span>
                      <ArrowRight size={12} />
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
