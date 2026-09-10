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
import { EmailAutomationModal } from '../../components/automation/EmailAutomationModal';
import { TelegramAutomationModal } from '../../components/automation/TelegramAutomationModal';
import { WhatsAppAutomationModal } from '../../components/automation/WhatsAppAutomationModal';
import { AudioUploadModal } from '../../components/call/AudioUploadModal';
import { StatusAuditModal } from '../../components/common/StatusAuditModal';
import { LoadingState } from '../../components/common/LoadingState';
import { automationService } from '../../services/automationService';
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
  Flame,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Calendar,
  UploadCloud,
  ExternalLink,
  Bot
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

  // Active Call Studio & Upload State
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<'transcribing' | 'summarizing' | 'scoring' | 'recommending' | 'saving' | 'complete' | null>(null);

  // Communication & Action Modals (5 Channels)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

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
    return <LoadingState message="Loading Lead Dossier & AI Intelligence..." count={5} />;
  }

  const latestCall = calls[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP BREADCRUMB & PRIMARY ACTION HEADER */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
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
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {lead.name}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>({lead.company})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button onClick={() => setIsStatusModalOpen(true)} className="btn btn-secondary btn-sm">
            <span>Stage: {lead.status}</span>
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <UploadCloud size={14} />
            <span>Upload Audio</span>
          </button>
          <button
            onClick={handleStartCall}
            className="btn btn-primary btn-sm"
            style={{ boxShadow: '0 4px 16px rgba(79, 242, 176, 0.35)', fontWeight: 700 }}
          >
            <Phone size={14} />
            <span>Launch Call Studio</span>
          </button>
        </div>
      </div>

      {/* 5-CHANNEL INTEGRATED COMMUNICATION & ACTION BAR */}
      <div
        className="glass-card"
        style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          border: '1px solid rgba(79, 242, 176, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(79, 242, 176, 0.12)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Zap size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              5-Channel Engagement Center
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Execute pre-filled manual deep-links or server-side automated bot/SMTP dispatches
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* 1. Manual Email */}
          <button
            onClick={() => {
              const subj = `Lead-IQ Commercial Proposal & Enterprise Onboarding for ${lead.company}`;
              const body = `Dear ${lead.name},\n\nThank you for speaking with us today regarding ${lead.company}. Attached is our formal GST quotation (${formatINR(lead.dealValue)}/year).\n\nWarm regards,\n${user?.name || 'Staff'}\nLead-IQ`;
              automationService.triggerManualEmail(lead.email, subj, body, lead.id, user?.name);
              showToast('Manual Email Triggered', `Opened default mail client for ${lead.email}.`, 'info');
              loadLeadDossier();
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
            title="Open default email client with pre-filled subject and proposal text"
          >
            <ExternalLink size={13} />
            <span>[ Manual Email ]</span>
          </button>

          {/* 2. Automatic Email */}
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', borderColor: 'rgba(59, 130, 246, 0.4)' }}
            title="Dispatch personalized proposal via Gmail SMTP Relay with AI generation"
          >
            <Mail size={13} style={{ color: '#3b82f6' }} />
            <span>[ Automatic Email ]</span>
          </button>

          {/* 3. Manual Telegram */}
          <button
            onClick={() => {
              const handle = lead.telegramUsername || 'prospect';
              const text = `Namaste ${lead.name.split(' ')[0]} ji! 👋 ${user?.name?.split(' ')[0] || 'Sneha'} from Lead-IQ here. Sent the proposal to ${lead.email}!`;
              automationService.triggerManualTelegram(handle, text, lead.id, user?.name);
              showToast('Manual Telegram Triggered', `Opened direct Telegram chat @${handle}.`, 'info');
              loadLeadDossier();
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
            title="Open direct Telegram chat (t.me/{username}) with pre-filled message"
          >
            <ExternalLink size={13} />
            <span>[ Manual Telegram ]</span>
          </button>

          {/* 4. Automatic Telegram */}
          <button
            onClick={() => setIsTelegramModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', borderColor: 'rgba(139, 92, 246, 0.4)' }}
            title="Dispatch direct message via Lead-IQ Telegram Bot"
          >
            <Bot size={13} style={{ color: '#8b5cf6' }} />
            <span>[ Automatic Telegram ]</span>
          </button>

          {/* 5. Manual WhatsApp */}
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', borderColor: 'rgba(37, 211, 102, 0.4)' }}
            title="Open WhatsApp click-to-chat deep-link (wa.me) with pre-filled proposal"
          >
            <MessageSquare size={13} style={{ color: '#25D366' }} />
            <span>[ Manual WhatsApp ]</span>
          </button>
        </div>
      </div>

      {/* 2. THE 3-COLUMN SALES INTELLIGENCE WORKSPACE */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr 340px',
          gap: '1.5rem',
          alignItems: 'start'
        }}
        className="lead-dossier-grid"
      >
        {/* ================= COLUMN 1: LEAD IDENTITY & CONTACTS ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Identity Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(79, 242, 176, 0.2) 0%, rgba(32, 201, 151, 0.1) 100%)',
                  border: '2px solid rgba(79, 242, 176, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-primary)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  boxShadow: '0 0 16px rgba(79, 242, 176, 0.2)'
                }}
              >
                {lead.name.charAt(0)}
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {lead.name}
                </h2>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {lead.title}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Company</span>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>{lead.company}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Industry</span>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--brand-primary)' }}>{lead.industry}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Location</span>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} style={{ color: 'var(--brand-primary)' }} />
                  {lead.country}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Deal Value</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  {formatINR(lead.dealValue)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current Stage</span>
                <LeadStatusBadge status={lead.status} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assigned Owner</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{lead.assignedStaffName}</span>
              </div>
            </div>
          </div>

          {/* Contact Methods Card */}
          <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.875rem' }}>
              Direct Channels
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href={`tel:${lead.phone}`}
                className="glass-card"
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', color: 'inherit' }}
              >
                <Phone size={15} style={{ color: 'var(--brand-primary)' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Phone / WhatsApp</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{lead.phone}</div>
                </div>
              </a>

              <a
                href={`mailto:${lead.email}`}
                className="glass-card"
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', color: 'inherit' }}
              >
                <Mail size={15} style={{ color: 'var(--brand-primary)' }} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Email</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{lead.email}</div>
                </div>
              </a>

              {lead.telegramUsername && (
                <div
                  className="glass-card"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}
                >
                  <Send size={15} style={{ color: 'var(--brand-secondary)' }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Telegram Handle</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand-secondary)' }}>@{lead.telegramUsername}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2: ACTIVITY TIMELINE & WHISPER AUDIO ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Latest Call Audio & Neural Transcript (If exists) */}
          {latestCall ? (
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--brand-primary)' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Latest Call Intelligence & STT
                  </h3>
                </div>
                <span className="badge" style={{ backgroundColor: 'rgba(79, 242, 176, 0.1)', color: 'var(--brand-primary)', fontSize: '0.68rem' }}>
                  Whisper Neural Transcribed
                </span>
              </div>

              {/* Audio Player */}
              <div style={{ marginBottom: '1.25rem' }}>
                <CallAudioPlayer
                  durationSeconds={latestCall.durationSeconds}
                  waveformData={latestCall.waveformData}
                />
              </div>

              {/* Summary */}
              <div style={{ marginBottom: '1.25rem' }}>
                <AISummaryCard summary={latestCall.summary} />
              </div>

              {/* Diarized Transcript Viewer */}
              <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                  Full Dialogue Transcript
                </div>
                <TranscriptViewer transcript={latestCall.transcript} />
              </div>
            </div>
          ) : (
            <div
              className="glass-card"
              style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(79, 242, 176, 0.1)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Phone size={22} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                No Call Transcripts Yet
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '360px', margin: 0 }}>
                Launch Call Studio to simulate a live customer conversation with automated Whisper speech-to-text.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={() => setIsUploadModalOpen(true)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <UploadCloud size={14} />
                  <span>Upload Recording</span>
                </button>
                <button onClick={handleStartCall} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={14} />
                  <span>Simulate Call</span>
                </button>
              </div>
            </div>
          )}

          {/* Activity Audit Timeline */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} style={{ color: 'var(--brand-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Customer Activity Timeline
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {activities.length} Recorded Events
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {activities.map(act => (
                <div
                  key={act.id}
                  className="glass-card"
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.875rem'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor:
                        act.type === 'call'
                          ? 'rgba(79, 242, 176, 0.15)'
                          : act.type === 'email_sent'
                          ? 'rgba(59, 130, 246, 0.15)'
                          : act.type === 'telegram_sent'
                          ? 'rgba(139, 92, 246, 0.15)'
                          : 'rgba(79, 242, 176, 0.1)',
                      color:
                        act.type === 'call'
                          ? 'var(--brand-primary)'
                          : act.type === 'email_sent'
                          ? '#3b82f6'
                          : act.type === 'telegram_sent'
                          ? '#8b5cf6'
                          : 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {act.type === 'call' && <Phone size={15} />}
                    {act.type === 'email_sent' && <Mail size={15} />}
                    {act.type === 'telegram_sent' && <Send size={15} />}
                    {act.type === 'status_change' && <CheckCircle2 size={15} />}
                    {act.type === 'score_update' && <Flame size={15} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                        {act.title}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {formatIndianDateTime(act.timestamp)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      {act.description}
                    </p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      By: <strong>{act.performedBy}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 3: AI INTELLIGENCE & SCORING PANEL ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Score & Purchase Intent Card */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: lead.score.score >= 85 ? '1px solid rgba(79, 242, 176, 0.35)' : undefined
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>AI Lead Intelligence</span>
              <Sparkles size={14} style={{ color: 'var(--brand-primary)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
              <LeadScoreBadge score={lead.score} size="lg" />
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--brand-primary)', marginTop: '0.75rem', textAlign: 'center' }}>
                {lead.score.probability}% Conversion Probability
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Confidence Level: {lead.score.confidence}%
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Purchase Intent:</span>
                <span style={{ fontWeight: 700, color: lead.score.score >= 80 ? '#4FF2B0' : '#94A7A0' }}>
                  {lead.score.category.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Velocity Trend:</span>
                <span style={{ fontWeight: 700, color: '#4FF2B0' }}>
                  {lead.score.score >= 80 ? '↑ Surging (+18%)' : '→ Steady'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Recommended Next Action */}
          <div
            className="glass-card"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(79, 242, 176, 0.2)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={13} />
              <span>AI Prescribed Action</span>
            </div>

            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, margin: '0 0 1rem' }}>
              "{lead.nextAction}"
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={handleStartCall}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Phone size={14} />
                <span>Execute Next Step</span>
              </button>
            </div>
          </div>

          {/* AI Buying Signals Card */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              Neural Buying Signals
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lead.score.factors.map((factor, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    lineHeight: 1.4
                  }}
                >
                  <span style={{ color: 'var(--brand-primary)', fontSize: '0.9rem', lineHeight: 1 }}>•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

      {/* WhatsApp Automation Modal */}
      <WhatsAppAutomationModal
        isOpen={isWhatsAppModalOpen}
        lead={lead}
        initialBody={latestCall ? `Namaste ${lead.name.split(' ')[0]} ji! 👋 Thank you for our discussion today regarding ${lead.company}. I've sent over your formal enterprise GST quotation to ${lead.email}. Please let me know if you need any clarification.` : undefined}
        onClose={() => setIsWhatsAppModalOpen(false)}
        onSuccess={() => loadLeadDossier()}
      />

      {/* Audio Upload Modal */}
      <AudioUploadModal
        isOpen={isUploadModalOpen}
        preselectedLead={lead}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => loadLeadDossier()}
      />

      {/* Status Audit Modal */}
      <StatusAuditModal
        isOpen={isStatusModalOpen}
        lead={lead}
        onClose={() => setIsStatusModalOpen(false)}
        onSuccess={() => loadLeadDossier()}
      />

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 1024px) {
          .lead-dossier-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
