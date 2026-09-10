import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Lead } from '../../types/lead';
import { Send, Sparkles, CheckCircle2, RefreshCw, ExternalLink, Bot, ShieldCheck } from 'lucide-react';
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
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [botStatus, setBotStatus] = useState<{ configured: boolean; botUsername?: string }>({
    configured: true,
    botUsername: 'Lead_IQ_bot'
  });

  useEffect(() => {
    if (lead) {
      const handle = lead.telegramUsername || 'shravaz_mali';
      setUsername(handle);
      setBody(
        `Namaste ${lead.name.split(' ')[0]} ji! 👋 ${user?.name?.split(' ')[0] || 'Sneha'} from Lead-IQ here. Just sent over the full enterprise proposal and GST quotation to your email (${lead.email}). Feel free to ping me here if you need quick answers on contract terms or onboarding!`
      );

      automationService.checkTelegramStatus().then(st => setBotStatus(st)).catch(() => {});
    }
  }, [lead, user]);

  if (!lead) return null;

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const gen = await automationService.generateTelegram(lead);
      setBody(gen.message);
      showToast('Telegram Message Regenerated', 'Generated concise follow-up with Gemini AI.', 'info');
    } catch (err: any) {
      showToast('Generation Failed', err.message, 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSyncChatId = async () => {
    setIsSyncing(true);
    try {
      const res = await automationService.syncTelegramUpdates();
      showToast('Telegram Synced', res.message || 'Checked latest bot updates.', 'success');
    } catch (err: any) {
      showToast('Sync Failed', err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSendAutomatic = async () => {
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

      showToast('Telegram Message Dispatched', `Delivered to @${username.replace('@', '')} via Lead-IQ Bot.`, 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast('Dispatch Failed', err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendManual = () => {
    if (!username || !body) {
      showToast('Validation Error', 'Please enter a Telegram handle.', 'warning');
      return;
    }

    automationService.triggerManualTelegram(username, body, lead.id, user?.name);
    showToast('Manual Telegram Triggered', `Opened direct Telegram chat for @${username.replace('@', '')}.`, 'info');
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Telegram Automation & Dispatch"
      subtitle={`Lead-IQ Telegram Bot Gateway (@${botStatus.botUsername || 'Lead_IQ_bot'})`}
      maxWidth="600px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: botStatus.configured ? '#10b981' : 'var(--text-muted)' }}>
            <Bot size={15} />
            <span>{botStatus.configured ? `@${botStatus.botUsername || 'Lead_IQ_bot'} Active` : 'Bot Standby'}</span>
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
              title="Opens direct t.me link in web/app"
            >
              <ExternalLink size={14} />
              <span>[ Manual Telegram ]</span>
            </button>
            <button
              onClick={handleSendAutomatic}
              disabled={isSending}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              {isSending ? (
                <span>Dispatching Bot...</span>
              ) : (
                <>
                  <Send size={14} />
                  <span>[ Automatic Telegram ]</span>
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
            <span>Handle detected from Whisper call transcription: @{username || 'prospect'}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              onClick={handleSyncChatId}
              disabled={isSyncing}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem' }}
              title="Poll bot updates to find user Chat ID"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
              <span>Sync Bot</span>
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem' }}
            >
              <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
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
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
            Telegram Message Content
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
