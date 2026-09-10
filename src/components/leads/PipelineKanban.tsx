import React from 'react';
import { Lead, LeadStatus } from '../../types/lead';
import { formatINR } from '../../utils/formatters';
import { LeadScoreBadge } from '../common/LeadScoreBadge';
import { LeadStatusBadge } from '../common/LeadStatusBadge';
import { Flame, PhoneCall, ArrowRight, User, MoreHorizontal } from 'lucide-react';

export interface PipelineKanbanProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
  onStatusChange?: (leadId: string, newStatus: LeadStatus) => void;
}

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'New', label: 'New Inbound', color: '#94A7A0' },
  { id: 'Contacted', label: 'Contacted', color: '#60A5FA' },
  { id: 'Interested', label: 'Qualified Interest', color: '#FBBF24' },
  { id: 'Approved', label: 'Proposal & Approved', color: '#4FF2B0' },
  { id: 'Hold', label: 'On Hold', color: '#F87171' },
  { id: 'Converted', label: 'Closed Won', color: '#20C997' }
];

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({ leads, onSelectLead, onStatusChange }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        overflowX: 'auto',
        paddingBottom: '1rem'
      }}
    >
      {STAGES.map(stage => {
        const stageLeads = leads.filter(l => l.status === stage.id);
        const stageValue = stageLeads.reduce((acc, l) => acc + l.dealValue, 0);

        return (
          <div
            key={stage.id}
            className="glass-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem',
              minHeight: '480px'
            }}
          >
            {/* Stage Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.65rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: stage.color,
                    boxShadow: `0 0 8px ${stage.color}`
                  }}
                />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {stage.label}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.35rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {stageLeads.length}
                </span>
              </div>

              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                {formatINR(stageValue)}
              </span>
            </div>

            {/* Stage Cards Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, overflowY: 'auto' }}>
              {stageLeads.length === 0 ? (
                <div
                  style={{
                    padding: '2.5rem 1rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  No opportunities in this stage
                </div>
              ) : (
                stageLeads.map(lead => (
                  <div
                    key={lead.id}
                    className="glass-card card-hover"
                    onClick={() => onSelectLead ? onSelectLead(lead) : (window.location.hash = `#/staff/leads/${lead.id}`)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {lead.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {lead.company}
                        </div>
                      </div>
                      <LeadScoreBadge score={lead.score} size="sm" />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>
                        {formatINR(lead.dealValue)}
                      </span>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={11} />
                        {lead.assignedStaffName.split(' ')[0]}
                      </span>
                    </div>

                    {lead.score.score >= 85 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
                        <Flame size={11} />
                        <span>High conversion signal</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
