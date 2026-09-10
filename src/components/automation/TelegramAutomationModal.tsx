import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Lead } from '../../types/lead';
import { Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { automationService } from '../../services/automationService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface TelegramAutomationModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const TelegramAutomationModal: React.FC<TelegramAutomationModalProps> = ({
  isOpen,
  lead,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [username, setUsername] = useState(lead?.telegramUsername || '');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  React.useEffect(() => {
    if (lead) {
      const handle = lead.telegramUsername || '';
      setUsername(handle);
      setBody(
        `Namaste ${lead.name.split(' ')[0]} ji! 👋 ${user?.name?.split(' ')[0] || 'Sneha'} from Lead-IQ here. Just sent over the full enterprise proposal and GST quotation to your email (${lead.email}). Feel free to ping me here if you need quick answers on contract terms or onboarding!`
      );
    }
  }, [lead, user]);

  if (!lead) return null;

  const handleSend = async () => {
    if (!username || !body) {
      showToast('Validation Error', 'Telegram handle and message body are required.', 'warning');
      return;
    }

    setIsSending(true);
    try {
      await automationService.sendTelegramMessage({
        leadId: lead.id,
        username,
        body,
        sentBy: user?.name || 'Staff'
      });

      showToast('Telegram Message Sent', `Delivered to @${username} via Lead-IQ Bot.`, 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast('Dispatch Failed', err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Telegram Dispatch"
      subtitle={`Direct Lead-IQ Telegram Bot Gateway`}
      maxWidth="540px"
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
                <span>Send Telegram Message</span>
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
            backgroundColor: 'rgba(139, 92, 246, 0.12)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8125rem',
            color: 'var(--brand-secondary)'
          }}
        >
          <Sparkles size={16} />
          <span>Telegram handle detected from Whisper call transcription (@{username})</span>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Telegram Handle (@username)
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value.replace('@', ''))}
            style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
            placeholder="username"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Telegram Message Content
          </label>
          <textarea
            rows={5}
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{ width: '100%', resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>
      </div>
    </Modal>
  );
};
