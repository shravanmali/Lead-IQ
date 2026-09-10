import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { Lead, LeadStatus } from '../../types/lead';
import { LeadTable } from '../../components/leads/LeadTable';
import { PipelineKanban } from '../../components/leads/PipelineKanban';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';
import { LeadScoreBadge } from '../../components/common/LeadScoreBadge';
import { LeadStatusBadge } from '../../components/common/LeadStatusBadge';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatters';
import {
  Flame,
  Sparkles,
  Zap,
  ArrowDownWideNarrow,
  Shield,
  LayoutGrid,
  List
} from 'lucide-react';

export const ManagerSmartLeadsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [smartLeads, setSmartLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [isLoading, setIsLoading] = useState(true);
  const [activeLeadModal, setActiveLeadModal] = useState<Lead | null>(null);

  const loadSmartLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getSmartLeads();
      setSmartLeads(data);
    } catch (err: any) {
      showToast('Smart Leads Error', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSmartLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const leadToUpdate = smartLeads.find(l => l.id === leadId);
    if (!leadToUpdate) return;
    try {
      await leadService.updateLeadStatus({
        leadId,
        previousStatus: leadToUpdate.status,
        newStatus,
        updatedBy: user?.name || 'Manager',
        reason: 'Manager Kanban Reorganization'
      });
      showToast('Stage Updated', `Lead stage moved to ${newStatus}`, 'success');
      loadSmartLeads();
    } catch (err: any) {
      showToast('Error Updating Stage', err.message, 'error');
    }
  };

  if (isLoading) {
    return <LoadingState message="Ranking leads via AI Predictive Algorithm (Score DESC)..." count={5} />;
  }

  const top1 = smartLeads[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. HEADER BANNER */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(79, 242, 176, 0.2) 0%, rgba(32, 201, 151, 0.1) 100%)',
              border: '2px solid rgba(79, 242, 176, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)',
              boxShadow: '0 0 16px rgba(79, 242, 176, 0.2)'
            }}
          >
            <Flame size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Team Smart Leads & Pipeline
              </h2>
              <span className="badge" style={{ backgroundColor: 'rgba(79, 242, 176, 0.1)', color: 'var(--brand-primary)', fontSize: '0.72rem' }}>
                Sorted by AI Score (DESC)
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Autonomous ordering algorithm prioritizing high-probability conversion deals across all sales reps.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                backgroundColor: viewMode === 'table' ? 'rgba(79, 242, 176, 0.15)' : 'transparent',
                color: viewMode === 'table' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                border: 'none',
                fontWeight: viewMode === 'table' ? 700 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <List size={15} />
              <span>Table</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                backgroundColor: viewMode === 'kanban' ? 'rgba(79, 242, 176, 0.15)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                border: 'none',
                fontWeight: viewMode === 'kanban' ? 700 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <LayoutGrid size={15} />
              <span>Pipeline Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOP PRIORITY SHOWCASE (When in Table View) */}
      {viewMode === 'table' && top1 && (
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem 1.75rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(79, 242, 176, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #4FF2B0 0%, #20C997 100%)'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span className="badge" style={{ backgroundColor: 'rgba(79, 242, 176, 0.15)', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.75rem' }}>
                AI PRIORITY #1 DEAL
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Highest conversion probability in active pipeline
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LeadStatusBadge status={top1.status} />
              <LeadScoreBadge score={top1.score} size="md" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lead & Company</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                {top1.name} ({top1.company})
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Account Exec</div>
              <div style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.9375rem' }}>
                {top1.assignedStaffName}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pipeline Deal Size</div>
              <div style={{ fontWeight: 800, color: 'var(--brand-primary)', fontSize: '1rem' }}>
                {formatINR(top1.dealValue)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recommended Next Action</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {top1.nextAction}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN TABLE OR PIPELINE KANBAN */}
      {viewMode === 'table' ? (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <LeadTable
            leads={smartLeads}
            highlightTopLead={true}
            onSelectLead={l => setActiveLeadModal(l)}
          />
        </div>
      ) : (
        <div>
          <PipelineKanban
            leads={smartLeads}
            onSelectLead={l => setActiveLeadModal(l)}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}

      {/* Lead Detail Modal */}
      <Modal
        isOpen={Boolean(activeLeadModal)}
        onClose={() => setActiveLeadModal(null)}
        title={activeLeadModal ? `${activeLeadModal.name} — ${activeLeadModal.company}` : ''}
        subtitle="Smart Lead Scoring Inspection"
        maxWidth="600px"
      >
        {activeLeadModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STATUS</div>
                <LeadStatusBadge status={activeLeadModal.status} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PREDICTIVE SCORE</div>
                <LeadScoreBadge score={activeLeadModal.score} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>DEAL VALUE</div>
                <div style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>
                  {formatINR(activeLeadModal.dealValue)}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                AI Conversion Probability Factors
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {activeLeadModal.score.factors.map((f, i) => (
                  <li key={i} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
