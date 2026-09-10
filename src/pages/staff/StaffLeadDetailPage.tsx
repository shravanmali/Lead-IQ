import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { callService } from '../../services/callService';
import { Lead, LeadActivity } from '../../types/lead';
import { CallRecord } from '../../types/call';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LeadScoreBadge } from '../../components/common/LeadScoreBadge';
import { LeadStatusBadge } from '../../components/common/LeadStatusBadge';
import { CallStudioModal } from '../../components/call/CallStudioModal';
import { AIProcessingOverlay } from '../../components/call/AIProcessingOverlay';
import { CallAudioPlayer } from '../../components/call/CallAudioPlayer';
import { TranscriptViewer } from '../../components/call/TranscriptViewer';
import { AISummaryCard } from '../../components/call/AISummaryCard';
import { AIRecommendationCard } from '../../components/call/AIRecommendationCard';
import { EmailAutomationModal } from '../../components/automation/EmailAutomationModal';
import { TelegramAutomationModal } from '../../components/automation/TelegramAutomationModal';
import { StatusAuditModal } from '../../components/common/StatusAuditModal';
import { LoadingState } from '../../components/common/LoadingState';
import { formatINR, formatIndianDateTime } from '../../utils/formatters';
import {
  Phone,
  Mail,
  Send,
  Building,
  MapPin,
  IndianRupee,
  Clock,
  Sparkles,
  ArrowLeft,
  Activity,
  CheckCircle2,
  FileText,
  ChevronRight,
  Flame
} from 'lucide-react';

interface StaffLeadDetailPageProps {
  leadId: string;
}

export const StaffLeadDetailPage: React.FC<StaffLeadDetailPageProps> = ({ leadId }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Call Studio State
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<'transcribing' | 'summarizing' | 'scoring' | 'recommending' | 'saving' | 'complete' | null>(null);

  // Modals
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Active tab inside profile: 'intelligence' vs 'history'
  const [activeTab, setActiveTab] = useState<'intelligence' | 'history'>('intelligence');

  const loadLeadDossier = async () => {
    setIsLoading(true);
    try {
      const [l, callList, actList] = await Promise.all([
        leadService.getLeadById(leadId),
        callService.getCallHistory(undefined, leadId),
        leadService.getLeadActivities(leadId)
      ]);
      setLead(l);
      setCalls(callList);
      setActivities(actList);
    } catch (err: any) {
      showToast('Error Loading Lead', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeadDossier();
  }, [leadId]);

  const handleStartCall = () => {
    setIsCallingModalOpen(true);
  };

  const handleEndCall = async (durationSeconds: number) => {
    if (!lead || !user) return;
    setIsCallingModalOpen(false);
    setPipelineStep('transcribing');

    try {
      const record = await callService.processCallPipeline(
        lead,
        durationSeconds,
        user,
        (step) => setPipelineStep(step)
      );

      showToast(
        'Call AI Pipeline Completed',
        `Whisper transcript analyzed. Score updated to ${record.resultingScore.score}/100.`,
        'success'
      );
      setPipelineStep(null);
      await loadLeadDossier();
    } catch (err: any) {
      showToast('AI Pipeline Failed', err.message, 'error');
      setPipelineStep(null);
    }
  };

  if (isLoading || !lead) {
    return <LoadingState message="Loading Lead Dossier & Call Intelligence..." count={5} />;
  }

  const latestCall = calls[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Navigation Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="#/staff/smart-leads"
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} />
            <span>Smart Leads</span>
          </a>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {lead.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setIsStatusModalOpen(true)} className="btn btn-secondary btn-sm">
            <span>Change Status ({lead.status})</span>
          </button>
          <button
            onClick={handleStartCall}
            className="btn btn-primary btn-sm"
            style={{ boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
          >
            <Phone size={14} />
            <span>Start Simulated Call</span>
          </button>
        </div>
      </div>

      {/* LEAD HERO PROFILE CARD */}
      <div
        className="card card-glow"
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          border: '1px solid var(--border-accent)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '1.6rem',
                fontWeight: 800,
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.45)'
              }}
            >
              {lead.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {lead.name}
                </h2>
                <LeadStatusBadge status={lead.status} />
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>
                {lead.title} at <strong style={{ color: 'var(--text-primary)' }}>{lead.company}</strong> ({lead.industry})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              AI Predictive Conversion Score
            </div>
            <LeadScoreBadge score={lead.score} size="lg" />
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              {lead.score.probability}% Conversion Probability ({lead.score.confidence}% Confidence)
            </div>
          </div>
        </div>

        {/* Contact Info Quick Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Phone size={16} style={{ color: 'var(--brand-primary)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Direct Phone</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {lead.phone}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Mail size={16} style={{ color: 'var(--brand-primary)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Email Address</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {lead.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Send size={16} style={{ color: 'var(--brand-secondary)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Telegram Detected</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: lead.telegramUsername ? 'var(--brand-secondary)' : 'var(--text-muted)' }}>
                {lead.telegramUsername ? `@${lead.telegramUsername}` : 'None Detected'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <IndianRupee size={16} style={{ color: '#10b981' }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Deal Size</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatINR(lead.dealValue)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('intelligence')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: activeTab === 'intelligence' ? 'var(--brand-primary-light)' : 'transparent',
            color: activeTab === 'intelligence' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'intelligence' ? 700 : 500,
            fontSize: '0.875rem'
          }}
        >
          <Sparkles size={16} />
          <span>Call Intelligence & AI Recommendations</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: activeTab === 'history' ? 'var(--brand-primary-light)' : 'transparent',
            color: activeTab === 'history' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'history' ? 700 : 500,
            fontSize: '0.875rem'
          }}
        >
          <Activity size={16} />
          <span>Activity Audit Trail ({activities.length})</span>
        </button>
      </div>

      {/* TAB 1: CALL INTELLIGENCE & AI PIPELINE RESULTS */}
      {activeTab === 'intelligence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {latestCall ? (
            <>
              {/* Audio Player */}
              <CallAudioPlayer
                durationSeconds={latestCall.durationSeconds}
                waveformData={latestCall.waveformData}
              />

              {/* AI Recommended Next Actions (Email / Telegram) */}
              <AIRecommendationCard
                lead={lead}
                callRecord={latestCall}
                onOpenEmailModal={() => setIsEmailModalOpen(true)}
                onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
              />

              {/* Dual Column: AI Executive Summary & Whisper Transcript */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
                <AISummaryCard summary={latestCall.summary} />

                <div className="card card-hover" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={18} style={{ color: 'var(--brand-primary)' }} />
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        Whisper Audio Transcript
                      </h4>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                      100% Neural Diarized
                    </span>
                  </div>
                  <TranscriptViewer transcript={latestCall.transcript} />
                </div>
              </div>
            </>
          ) : (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '3.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-primary-light)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  No Recorded Calls Yet
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.25rem 0 1.25rem' }}>
                  Click "Start Simulated Call" to begin speaking with {lead.name}. The AI pipeline will automatically transcribe and summarize the call.
                </p>
                <button onClick={handleStartCall} className="btn btn-primary">
                  <Phone size={15} />
                  <span>Launch Call Studio Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVITY AUDIT TRAIL */}
      {activeTab === 'history' && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Lead Timeline & Action Audit Trail
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activities.map(act => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor:
                      act.type === 'call'
                        ? 'var(--brand-primary-light)'
                        : act.type === 'email_sent'
                        ? 'rgba(59, 130, 246, 0.15)'
                        : act.type === 'telegram_sent'
                        ? 'rgba(139, 92, 246, 0.15)'
                        : 'var(--success-bg)',
                    color:
                      act.type === 'call'
                        ? 'var(--brand-primary)'
                        : act.type === 'email_sent'
                        ? '#3b82f6'
                        : act.type === 'telegram_sent'
                        ? '#8b5cf6'
                        : '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {act.type === 'call' && <Phone size={16} />}
                  {act.type === 'email_sent' && <Mail size={16} />}
                  {act.type === 'telegram_sent' && <Send size={16} />}
                  {act.type === 'status_change' && <CheckCircle2 size={16} />}
                  {act.type === 'score_update' && <Flame size={16} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {act.title}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {formatIndianDateTime(act.timestamp)}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {act.description}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Logged by: <strong>{act.performedBy}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Call Studio Modal */}
      <CallStudioModal
        isOpen={isCallingModalOpen}
        lead={lead}
        onClose={() => setIsCallingModalOpen(false)}
        onEndCall={handleEndCall}
      />

      {/* Stepped AI Intelligence Overlay */}
      {pipelineStep && <AIProcessingOverlay currentStep={pipelineStep} />}

      {/* Email Automation Modal */}
      <EmailAutomationModal
        isOpen={isEmailModalOpen}
        lead={lead}
        initialSubject={latestCall?.recommendation.generatedContent.subject}
        initialBody={latestCall?.recommendation.generatedContent.body}
        onClose={() => setIsEmailModalOpen(false)}
        onSuccess={() => loadLeadDossier()}
      />

      {/* Telegram Automation Modal */}
      <TelegramAutomationModal
        isOpen={isTelegramModalOpen}
        lead={lead}
        onClose={() => setIsTelegramModalOpen(false)}
        onSuccess={() => loadLeadDossier()}
      />

      {/* Status Audit Modal */}
      <StatusAuditModal
        isOpen={isStatusModalOpen}
        lead={lead}
        onClose={() => setIsStatusModalOpen(false)}
        onSuccess={() => loadLeadDossier()}
      />
    </div>
  );
};
