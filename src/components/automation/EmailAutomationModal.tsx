import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Lead } from '../../types/lead';
import { Mail, Sparkles, Send, RefreshCw, CheckCircle2 } from 'lucide-react';
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

  // Sync props when opening
  React.useEffect(() => {
    if (lead) {
      setTo(lead.email);
      setSubject(initialSubject || `Lead-IQ Commercial Proposal & GST Quotation for ${lead.company}`);
      setBody(
        initialBody ||
          `Dear ${lead.name},\n\nThank you for speaking with me today regarding ${lead.company}'s sales operations in ${lead.country}. As discussed on our call, Lead-IQ provides automated Whisper speech transcription and predictive lead scoring designed to accelerate your pipeline.\n\nAttached is our formal enterprise GST quotation (${formatINR(lead.dealValue)}/year) and our ISO 27001 security dossier with AWS Mumbai cloud residency details.\n\nPlease let me know if tomorrow at 3:00 PM IST works for a 15-minute review with your finance committee.\n\nWarm regards,\n${user?.name || 'Sneha Kulkarni'}\nLead-IQ India Operations`
      );
    }
  }, [lead, initialSubject, initialBody, user]);

  if (!lead) return null;

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setBody(
        `Dear ${lead.name},\n\nFollowing up on our discussion regarding ${lead.company} (${lead.country}). I have tailored an enterprise package specifically for your regional operations.\n\nKey Highlights:\n• Automated Whisper Speech Intelligence & 0-100 Lead Scoring\n• 100% GST Invoicing & AWS Mumbai Data Residency\n• 3-Week Rapid Onboarding & Staff Training\n\nLooking forward to your feedback!\n\nWarm regards,\n${user?.name || 'Sneha Kulkarni'}\nLead-IQ India`
      );
      setIsRegenerating(false);
      showToast('AI Email Regenerated', 'Draft updated with executive Indian business tone.', 'info');
    }, 600);
  };

  const handleSend = async () => {
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

      showToast('Proposal Email Sent', `Dispatched to ${to} successfully.`, 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast('Send Failed', err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Email Automation"
      subtitle={`Personalized Proposal for ${lead.name} (${lead.company}, ${lead.country})`}
      maxWidth="640px"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSend} disabled={isSending} className="btn btn-primary">
            {isSending ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send size={15} />
                <span>Send Proposal Email</span>
              </>
            )}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--brand-primary-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--brand-primary)' }}>
            <Sparkles size={16} />
            <span>AI extracted context from latest Whisper call transcription</span>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="btn-ghost btn-sm"
            style={{ color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <RefreshCw size={13} className={isRegenerating ? 'animate-spin' : ''} />
            <span>Regenerate</span>
          </button>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
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
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
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
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Message Body
          </label>
          <textarea
            rows={8}
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{ width: '100%', resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>
      </div>
    </Modal>
  );
};
