import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Lead } from '../../types/lead';
import { MessageSquare, Sparkles, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { automationService } from '../../services/automationService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface WhatsAppAutomationModalProps {
  isOpen: boolean;
  lead: Lead | null;
  initialBody?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const WhatsAppAutomationModal: React.FC<WhatsAppAutomationModalProps> = ({
  isOpen,
  lead,
  initialBody,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [phone, setPhone] = useState(lead?.phone || '');
  const [body, setBody] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (lead) {
      setPhone(lead.phone || '');
      const firstName = lead.name.split(' ')[0];
      setBody(
        initialBody ||
          `Namaste ${firstName} ji! 👋 ${user?.name?.split(' ')[0] || 'Sneha'} from Lead-IQ here. Thank you for connecting with us regarding ${lead.company}. I've sent over your formal enterprise GST quotation to your email (${lead.email}). Please let me know if you have any questions or would like to test our Whisper AI speech pipeline!`
      );
    }
  }, [lead, initialBody, user]);

  if (!lead) return null;

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const gen = await automationService.generateWhatsApp(lead);
      setBody(gen.message);
      showToast('WhatsApp Message Regenerated', 'Generated customized Indian business greeting with Gemini AI.', 'info');
    } catch (err: any) {
      showToast('Generation Failed', err.message, 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleLaunchWhatsApp = () => {
    if (!phone || !body) {
      showToast('Validation Error', 'Phone number and message are required.', 'warning');
      return;
    }

    automationService.triggerManualWhatsApp(phone, body, lead.id, user?.name);
    showToast('WhatsApp Launched', `Opening WhatsApp conversation for ${phone}.`, 'success');
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="WhatsApp Direct Channel"
      subtitle={`Click-to-chat deep-link for ${lead.name} (${lead.phone})`}
      maxWidth="580px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10b981' }}>
            <ShieldCheck size={14} />
            <span>Click-to-Chat Gateway (wa.me)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleLaunchWhatsApp}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#25D366',
                borderColor: '#25D366',
                color: '#0b1410',
                fontWeight: 700
              }}
            >
              <ExternalLink size={14} />
              <span>[ Manual WhatsApp ]</span>
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div
          style={{
            padding: '0.875rem 1rem',
            backgroundColor: 'rgba(37, 211, 102, 0.08)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(37, 211, 102, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#25D366' }}>
            <Sparkles size={16} />
            <span>Pre-filled proposal text generated from call context</span>
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
            Phone Number (with country code)
          </label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
            WhatsApp Message Body
          </label>
          <textarea
            rows={5}
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{ width: '100%', resize: 'vertical', lineHeight: 1.55 }}
          />
        </div>
      </div>
    </Modal>
  );
};
