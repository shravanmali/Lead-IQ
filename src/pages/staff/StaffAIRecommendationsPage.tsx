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
import { Sparkles, Mail, Send, CheckCircle2, ArrowRight, Clock } from 'lucide-react';

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
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          AI Recommended Follow-Up Actions
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Automated multi-channel proposals synthesized directly from your call transcripts
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {calls.map(call => {
          const lead = leads.find(l => l.id === call.leadId);
          const rec = call.recommendation;
          const hasTelegram = Boolean(call.transcript.detectedTelegramHandle || lead?.telegramUsername);

          return (
            <div
              key={call.id}
              className="card card-glow"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                padding: '1.75rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                    {call.leadName} ({lead?.company || 'Enterprise'})
                  </div>
                  <span className="badge badge-hot" style={{ fontSize: '0.72rem' }}>
                    High Priority
                  </span>
                </div>

                <div
                  style={{
                    padding: '0.875rem 1rem',
                    backgroundColor: 'var(--brand-primary-light)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={15} />
                    <span>{rec.title}</span>
                  </div>
                  {rec.reason}
                </div>

                {/* Email Draft Preview */}
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    Subject: {rec.generatedContent.subject}
                  </div>
                  <div style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rec.generatedContent.body.slice(0, 160)}...
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
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

                <a href={`#/staff/leads/${call.leadId}`} className="btn-ghost btn-sm" style={{ color: 'var(--brand-primary)' }}>
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
