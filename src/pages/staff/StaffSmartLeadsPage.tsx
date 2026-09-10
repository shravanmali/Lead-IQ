import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { callService } from '../../services/callService';
import { Lead } from '../../types/lead';
import { useAuth } from '../../context/AuthContext';
import { LeadTable } from '../../components/leads/LeadTable';
import { LoadingState } from '../../components/common/LoadingState';
import { CallStudioModal } from '../../components/call/CallStudioModal';
import { AIProcessingOverlay } from '../../components/call/AIProcessingOverlay';
import { LeadScoreBadge } from '../../components/common/LeadScoreBadge';
import { LeadStatusBadge } from '../../components/common/LeadStatusBadge';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { Flame, Sparkles, Phone, ArrowRight, Zap, Target } from 'lucide-react';

export const StaffSmartLeadsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [smartLeads, setSmartLeads] = useState<Lead[]>([]);
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

  if (isLoading) {
    return <LoadingState message="Executing Smart Leads Predictive Ranking Engine (Score DESC)..." count={5} />;
  }

  const top1 = smartLeads[0];

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
                Smart Leads Priority Engine
              </h2>
              <span className="badge" style={{ backgroundColor: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
                Sorted by AI Lead Score (DESC)
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Tells you precisely which prospect to contact first based on continuous neural conversation analysis.
            </p>
          </div>
        </div>

        {top1 && (
          <button
            onClick={() => handleStartCall(top1)}
            className="btn btn-primary"
            style={{ boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
          >
            <Phone size={15} />
            <span>Call #1 Priority ({top1.name})</span>
          </button>
        )}
      </div>

      {/* TOP PRIORITY SPOTLIGHT CARD */}
      {top1 && (
        <div
          className="card card-glow"
          style={{
            padding: '1.75rem',
            border: '2px solid var(--brand-primary)',
            background: 'radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.15), transparent 70%), var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-ai-priority" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
                AI PRIORITY #1 TO CONTACT
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Highest conversion probability ({top1.score.probability}%)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <LeadStatusBadge status={top1.status} />
              <LeadScoreBadge score={top1.score} size="lg" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', padding: '1.25rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PROSPECT & TITLE</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{top1.name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{top1.title}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORGANIZATION</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{top1.company}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--brand-primary)', fontWeight: 600 }}>{top1.industry}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PROJECTED CONTRACT VALUE</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {formatINR(top1.dealValue)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PRIMARY BUYING SIGNAL</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                {top1.score.factors[0]}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <strong>Next Action:</strong> {top1.nextAction}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href={`#/staff/leads/${top1.id}`} className="btn btn-secondary btn-sm">
                <span>View Full Lead Profile</span>
                <ArrowRight size={13} />
              </a>
              <button onClick={() => handleStartCall(top1)} className="btn btn-primary btn-sm">
                <Phone size={14} />
                <span>Launch Call Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table with Priority Column */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <LeadTable
          leads={smartLeads}
          highlightTopLead={true}
          onSelectLead={l => {
            window.location.hash = `#/staff/leads/${l.id}`;
          }}
          onCallLead={l => handleStartCall(l)}
        />
      </div>

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
