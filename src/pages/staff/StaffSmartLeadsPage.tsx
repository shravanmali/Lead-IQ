import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { callService } from '../../services/callService';
import { Lead, LeadStatus } from '../../types/lead';
import { useAuth } from '../../context/AuthContext';
import { LeadTable } from '../../components/leads/LeadTable';
import { PipelineKanban } from '../../components/leads/PipelineKanban';
import { LoadingState } from '../../components/common/LoadingState';
import { CallStudioModal } from '../../components/call/CallStudioModal';
import { AIProcessingOverlay } from '../../components/call/AIProcessingOverlay';
import { LeadScoreBadge } from '../../components/common/LeadScoreBadge';
import { LeadStatusBadge } from '../../components/common/LeadStatusBadge';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import {
  Flame,
  Sparkles,
  Phone,
  ArrowRight,
  Zap,
  Target,
  LayoutGrid,
  List,
  Filter
} from 'lucide-react';

export const StaffSmartLeadsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [smartLeads, setSmartLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [isLoading, setIsLoading] = useState(true);

  // Call Studio State
  const [callingLead, setCallingLead] = useState<Lead | null>(null);
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<'transcribing' | 'summarizing' | 'scoring' | 'recommending' | 'saving' | 'complete' | null>(null);

  const loadSmartLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getSmartLeads(user?.id);
      setSmartLeads(data);
    } catch (err: any) {
      showToast('Error Loading Smart Leads', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSmartLeads();
  }, [user]);

  const handleStartCall = (lead: Lead) => {
    setCallingLead(lead);
    setIsCallingModalOpen(true);
  };

  const handleEndCall = async (durationSeconds: number) => {
    if (!callingLead || !user) return;
    setIsCallingModalOpen(false);
    setPipelineStep('transcribing');

    try {
      const record = await callService.processCallPipeline(
        callingLead,
        durationSeconds,
        user,
        (step) => setPipelineStep(step)
      );

      showToast(
        'Call AI Intelligence Processed',
        `New lead predictive score: ${record.resultingScore.score}/100.`,
        'success'
      );
      setPipelineStep(null);
      window.location.hash = `#/staff/leads/${callingLead.id}`;
    } catch (err: any) {
      showToast('AI Pipeline Error', err.message, 'error');
      setPipelineStep(null);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const leadToUpdate = smartLeads.find(l => l.id === leadId);
    if (!leadToUpdate) return;
    try {
      await leadService.updateLeadStatus({
        leadId,
        previousStatus: leadToUpdate.status,
        newStatus,
        updatedBy: user?.name || 'Staff User',
        reason: 'Pipeline Drag & Drop'
      });
      showToast('Stage Updated', `Lead moved to ${newStatus}`, 'success');
      loadSmartLeads();
    } catch (err: any) {
      showToast('Error Updating Stage', err.message, 'error');
    }
  };

  if (isLoading) {
    return <LoadingState message="Executing Smart Leads Predictive Ranking Engine (Score DESC)..." count={5} />;
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
                Smart Leads & Pipeline Engine
              </h2>
              <span className="badge" style={{ backgroundColor: 'rgba(79, 242, 176, 0.1)', color: 'var(--brand-primary)', fontSize: '0.72rem' }}>
                AI Ranked (Score DESC)
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Calculates purchase intent and prioritizes high-conversion sales opportunities in real time.
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

          {top1 && (
            <button
              onClick={() => handleStartCall(top1)}
              className="btn btn-primary"
              style={{ boxShadow: '0 4px 16px rgba(79, 242, 176, 0.35)', fontWeight: 700 }}
            >
              <Phone size={14} />
              <span>Call Priority #1</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TOP 1 SPOTLIGHT CARD (When in Table View) */}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge" style={{ backgroundColor: 'rgba(79, 242, 176, 0.15)', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.75rem' }}>
                🔥 #1 TOP CONVERSION CANDIDATE
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {top1.score.probability}% probability • High Intent
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <LeadStatusBadge status={top1.status} />
              <LeadScoreBadge score={top1.score} size="md" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', padding: '1rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PROSPECT & TITLE</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{top1.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{top1.title}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ORGANIZATION</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{top1.company}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--brand-primary)' }}>{top1.industry}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CONTRACT VALUE</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--brand-primary)' }}>
                {formatINR(top1.dealValue)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PRIMARY BUYING SIGNAL</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {top1.score.factors[0]}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <strong>Prescribed Step:</strong> {top1.nextAction}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href={`#/staff/leads/${top1.id}`} className="btn btn-secondary btn-sm">
                <span>View Dossier</span>
                <ArrowRight size={13} />
              </a>
              <button onClick={() => handleStartCall(top1)} className="btn btn-primary btn-sm">
                <Phone size={14} />
                <span>Call Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT: TABLE OR PIPELINE KANBAN */}
      {viewMode === 'table' ? (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <LeadTable
            leads={smartLeads}
            highlightTopLead={true}
            onSelectLead={l => {
              window.location.hash = `#/staff/leads/${l.id}`;
            }}
            onCallLead={l => handleStartCall(l)}
          />
        </div>
      ) : (
        <div>
          <PipelineKanban
            leads={smartLeads}
            onSelectLead={l => {
              window.location.hash = `#/staff/leads/${l.id}`;
            }}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}

      {/* Call Studio Modal */}
      <CallStudioModal
        isOpen={isCallingModalOpen}
        lead={callingLead}
        onClose={() => setIsCallingModalOpen(false)}
        onEndCall={handleEndCall}
      />

      {/* Stepped AI Pipeline Overlay */}
      {pipelineStep && <AIProcessingOverlay currentStep={pipelineStep} />}
    </div>
  );
};
