import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { Lead } from '../../types/lead';
import { LeadTable } from '../../components/leads/LeadTable';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';
import { LeadScoreBadge } from '../../components/common/LeadScoreBadge';
import { LeadStatusBadge } from '../../components/common/LeadStatusBadge';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { Flame, Sparkles, Zap, ArrowDownWideNarrow, Shield } from 'lucide-react';

export const ManagerSmartLeadsPage: React.FC = () => {
  const { showToast } = useToast();
  const [smartLeads, setSmartLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLeadModal, setActiveLeadModal] = useState<Lead | null>(null);

  useEffect(() => {
    const loadSmartLeads = async () => {
      setIsLoading(true);
      try {
        // Backend returns strictly DESCENDING sorted leads
        const data = await leadService.getSmartLeads();
        setSmartLeads(data);
      } catch (err: any) {
        showToast('Smart Leads Error', err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadSmartLeads();
  }, []);

  if (isLoading) {
    return <LoadingState message="Ranking leads via AI Predictive Algorithm (Score DESC)..." count={5} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Banner */}
      <div
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-glow)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Flame size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Smart Leads Prioritization
              </h2>
              <span className="badge" style={{ backgroundColor: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
                Sorted by AI Score (DESC)
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Autonomous ordering algorithm prioritizing high-probability conversion deals across all sales reps.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <ArrowDownWideNarrow size={16} style={{ color: 'var(--brand-primary)' }} />
          <span>Descending AI Probability Order</span>
        </div>
      </div>

      {/* Top Priority Showcase Card */}
      {smartLeads.length > 0 && (
        <div
          className="card card-glow"
          style={{
            padding: '1.5rem',
            border: '2px solid var(--brand-primary)',
            background: 'radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.12), transparent 60%), var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span className="badge badge-ai-priority" style={{ fontSize: '0.75rem' }}>
                AI PRIORITY #1 DEAL
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Highest conversion probability in active pipeline
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LeadStatusBadge status={smartLeads[0].status} />
              <LeadScoreBadge score={smartLeads[0].score} size="lg" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead & Company</div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                {smartLeads[0].name} ({smartLeads[0].company})
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Account Exec</div>
              <div style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.9375rem' }}>
                {smartLeads[0].assignedStaffName}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pipeline Deal Size</div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                {formatINR(smartLeads[0].dealValue)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recommended Next Action</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                {smartLeads[0].nextAction}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table with highlightTopLead */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <LeadTable
          leads={smartLeads}
          highlightTopLead={true}
          onSelectLead={l => setActiveLeadModal(l)}
        />
      </div>

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</div>
                <LeadStatusBadge status={activeLeadModal.status} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PREDICTIVE SCORE</div>
                <LeadScoreBadge score={activeLeadModal.score} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DEAL VALUE</div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
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
