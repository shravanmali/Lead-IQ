import React, { useState, useEffect } from 'react';
import { callService } from '../../services/callService';
import { leadService } from '../../services/leadService';
import { CallRecord } from '../../types/call';
import { Lead } from '../../types/lead';
import { useAuth } from '../../context/AuthContext';
import { LoadingState } from '../../components/common/LoadingState';
import { EmailAutomationModal } from '../../components/automation/EmailAutomationModal';
import { TelegramAutomationModal } from '../../components/automation/TelegramAutomationModal';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Mail, Send, CheckCircle2, ArrowRight, Clock, Zap, MessageSquare } from 'lucide-react';

export const StaffAIRecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [callList, leadList] = await Promise.all([
        callService.getCallHistory(user?.id),
        leadService.getLeads({ assignedStaffId: user?.id })
      ]);
      setCalls(callList);
      setLeads(leadList);
    } catch (err: any) {
      showToast('Error Loading Recommendations', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenEmail = (call: CallRecord) => {
    const lead = leads.find(l => l.id === call.leadId) || null;
    setSelectedLead(lead);
    setSelectedCall(call);
    setIsEmailModalOpen(true);
  };

  const handleOpenTelegram = (call: CallRecord) => {
    const lead = leads.find(l => l.id === call.leadId) || null;
    setSelectedLead(lead);
    setSelectedCall(call);
    setIsTelegramModalOpen(true);
  };

  if (isLoading) {
    return <LoadingState message="Loading AI Follow-Up Recommendations Queue..." count={4} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(79, 242, 176, 0.12)', border: '1px solid rgba(79, 242, 176, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
              <Zap size={18} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              AI Recommended Follow-Up Actions
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '2.625rem' }}>
            Multi-channel proposals synthesized directly from your call transcripts with tailored Indian business proposals
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="glass-card" style={{ padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Action Queue:</span>
            <span style={{ color: 'var(--brand-primary)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{calls.length}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {calls.map(call => {
          const lead = leads.find(l => l.id === call.leadId);
          const rec = call.recommendation;
          const hasTelegram = Boolean(call.transcript.detectedTelegramHandle || lead?.telegramUsername);

          return (
            <div
              key={call.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                padding: '1.75rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    {call.leadName} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>({lead?.company || 'Enterprise'})</span>
                  </div>
                  <span className="badge badge-hot" style={{ fontSize: '0.72rem' }}>
                    High Priority
                  </span>
                </div>

                <div
                  style={{
                    padding: '0.875rem 1rem',
                    backgroundColor: 'rgba(79, 242, 176, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(79, 242, 176, 0.22)',
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={15} />
                    <span>{rec.title}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {rec.reason}
                  </div>
                </div>

                {/* Email Draft Preview */}
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={13} style={{ color: 'var(--brand-primary)' }} />
                    <span>Subject: {rec.generatedContent.subject}</span>
                  </div>
                  <div style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.45, color: 'var(--text-secondary)' }}>
                    {rec.generatedContent.body.slice(0, 160)}...
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                  <button onClick={() => handleOpenEmail(call)} className="btn btn-primary btn-sm">
                    <Mail size={14} />
                    <span>Send Proposal Email</span>
                  </button>

                  <button
                    onClick={() => handleOpenTelegram(call)}
                    disabled={!hasTelegram}
                    className="btn btn-secondary btn-sm"
                  >
                    <Send size={14} />
                    <span>{hasTelegram ? 'Send Telegram' : 'No Telegram'}</span>
                  </button>
                </div>

                <a href={`#/staff/leads/${call.leadId}`} className="btn-ghost btn-sm" style={{ color: 'var(--brand-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>Dossier</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <EmailAutomationModal
        isOpen={isEmailModalOpen}
        lead={selectedLead}
        initialSubject={selectedCall?.recommendation.generatedContent.subject}
        initialBody={selectedCall?.recommendation.generatedContent.body}
        onClose={() => setIsEmailModalOpen(false)}
        onSuccess={() => loadData()}
      />

      <TelegramAutomationModal
        isOpen={isTelegramModalOpen}
        lead={selectedLead}
        onClose={() => setIsTelegramModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};
