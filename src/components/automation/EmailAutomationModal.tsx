import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Lead } from '../../types/lead';
import { Mail, Sparkles, Send, RefreshCw, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';
import { automationService } from '../../services/automationService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatters';

interface EmailAutomationModalProps {
  isOpen: boolean;
  lead: Lead | null;
  initialSubject?: string;
  initialBody?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const EmailAutomationModal: React.FC<EmailAutomationModalProps> = ({
  isOpen,
  lead,
  initialSubject,
  initialBody,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [to, setTo] = useState(lead?.email || '');
  const [subject, setSubject] = useState(initialSubject || '');
  const [body, setBody] = useState(initialBody || '');
  const [isSending, setIsSending] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<{ configured: boolean; user?: string }>({ configured: true });

  useEffect(() => {
    if (lead) {
      setTo(lead.email || 'sachinshravan836@gmail.com');
      setSubject(initialSubject || `Lead-IQ Commercial Proposal & GST Quotation for ${lead.company}`);
      setBody(
        initialBody ||
          `Dear ${lead.name},\n\nThank you for speaking with me today regarding ${lead.company}'s sales operations in ${lead.country}. As discussed on our call, Lead-IQ provides automated Whisper speech transcription and predictive lead scoring designed to accelerate your pipeline.\n\nAttached is our formal enterprise GST quotation (${formatINR(lead.dealValue)}/year) and our ISO 27001 security dossier with AWS Mumbai cloud residency details.\n\nPlease let me know if tomorrow at 3:00 PM IST works for a 15-minute review with your finance committee.\n\nWarm regards,\n${user?.name || 'Sneha Kulkarni'}\nLead-IQ India Operations`
      );

      automationService.checkEmailStatus().then(st => setSmtpStatus(st)).catch(() => {});
    }
  }, [lead, initialSubject, initialBody, user]);

  if (!lead) return null;

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const generated = await automationService.generateEmail(lead);
      setSubject(generated.subject);
      setBody(generated.body);
      showToast('AI Proposal Regenerated', 'Draft updated via Gemini 2.5 Flash intelligence.', 'info');
    } catch (err: any) {
      showToast('Generation Failed', err.message, 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSendAutomatic = async () => {
    if (!to || !subject || !body) {
      showToast('Validation Error', 'Please complete all email fields.', 'warning');
      return;
    }

    setIsSending(true);
    try {
      await automationService.sendEmail({
        leadId: lead.id,
        to,
        subject,
        body,
        sentBy: user?.name || 'Staff'
      });

      showToast('Proposal Email Sent', `Dispatched via Gmail SMTP to ${to} successfully.`, 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast('SMTP Dispatch Failed', err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendManual = () => {
    if (!to || !subject || !body) {
      showToast('Validation Error', 'Please complete recipient and subject.', 'warning');
      return;
    }

    automationService.triggerManualEmail(to, subject, body, lead.id, user?.name);
    showToast('Manual Email Triggered', `Opened default mail client for ${to}.`, 'info');
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Email Automation & Dispatch"
      subtitle={`Personalized Proposal for ${lead.name} (${lead.company}, ${lead.country})`}
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: smtpStatus.configured ? '#10b981' : 'var(--text-muted)' }}>
            <ShieldCheck size={14} />
            <span>{smtpStatus.configured ? `SMTP Connected (${smtpStatus.user || 'Gmail'})` : 'SMTP Standby'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleSendManual}
              type="button"
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              title="Opens pre-filled mailto: link in local Outlook / Apple Mail / Webmail"
            >
              <ExternalLink size={14} />
              <span>[ Manual Email ]</span>
            </button>
            <button
              onClick={handleSendAutomatic}
              disabled={isSending}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              {isSending ? (
                <span>Dispatching SMTP...</span>
              ) : (
                <>
                  <Send size={14} />
                  <span>[ Automatic Email ]</span>
                </>
              )}
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div
          style={{
            padding: '0.875rem 1rem',
            backgroundColor: 'rgba(79, 242, 176, 0.08)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(79, 242, 176, 0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--brand-primary)' }}>
            <Sparkles size={16} />
            <span>AI extracted context from latest Whisper call transcription</span>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
          >
            <RefreshCw size={13} className={isRegenerating ? 'animate-spin' : ''} />
            <span>Regenerate with Gemini AI</span>
          </button>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
            Recipient (To)
          </label>
          <input
            type="email"
            value={to}
            onChange={e => setTo(e.target.value)}
            style={{ width: '100%' }}
            placeholder="lead@company.in"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
            Message Body
          </label>
          <textarea
            rows={8}
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{ width: '100%', resize: 'vertical', lineHeight: 1.55 }}
          />
        </div>
      </div>
    </Modal>
  );
};
