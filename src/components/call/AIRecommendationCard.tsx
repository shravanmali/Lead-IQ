import React from 'react';
import { Lead } from '../../types/lead';
import { CallRecord } from '../../types/call';
import { Mail, Send, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AIRecommendationCardProps {
  lead: Lead;
  callRecord: CallRecord;
  onOpenEmailModal: () => void;
  onOpenTelegramModal: () => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  lead,
  callRecord,
  onOpenEmailModal,
  onOpenTelegramModal
}) => {
  const emailRec = callRecord.recommendation;
  const telegramHandle =
    callRecord.transcript.detectedTelegramHandle || lead.telegramUsername;

  return (
    <div className="card card-glow" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--brand-secondary)' }} />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            AI Recommended Next Steps
          </h4>
        </div>
        <span className="badge badge-hot" style={{ fontSize: '0.72rem' }}>
          Action Required
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {/* OPTION 1: EMAIL AUTOMATION */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.92rem' }}>
                <Mail size={16} />
                <span>Option 1: Personalized Proposal Email</span>
              </div>
              <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '0.68rem' }}>
                High Priority
              </span>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
              <strong>Why AI recommended this:</strong> {emailRec.reason}
            </div>

            {/* Email Preview Snippet */}
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Subject: {emailRec.generatedContent.subject || 'Lead-IQ Commercial Proposal'}
              </div>
              <div style={{ whiteSpace: 'pre-line', maxHeight: '70px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {emailRec.generatedContent.body.slice(0, 180)}...
              </div>
            </div>
          </div>

          <button onClick={onOpenEmailModal} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            <Mail size={14} />
            Review & Send Email Proposal
          </button>
        </div>

        {/* OPTION 2: TELEGRAM AUTOMATION */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--brand-secondary)', fontSize: '0.92rem' }}>
                <Send size={16} />
                <span>Option 2: Telegram Automation</span>
              </div>
              {telegramHandle ? (
                <span className="badge" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', fontSize: '0.68rem' }}>
                  Detected @{telegramHandle}
                </span>
              ) : (
                <span className="badge badge-cold" style={{ fontSize: '0.68rem' }}>
                  Not Detected
                </span>
              )}
            </div>

            {telegramHandle ? (
              <>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  <strong>Why AI recommended this:</strong> Prospect shared Telegram handle (@{telegramHandle}) for rapid turnaround on contract questions.
                </div>

                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Telegram Recipient: @{telegramHandle}
                  </div>
                  <div style={{ whiteSpace: 'pre-line', maxHeight: '70px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Hey {lead.name.split(' ')[0]}! 👋 Just sent over the full enterprise proposal to your email...
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  padding: '1.25rem 1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-medium)',
                  textAlign: 'center'
                }}
              >
                <AlertCircle size={20} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  No Telegram contact detected from the call
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  The prospect did not mention or provide a Telegram handle during this call.
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onOpenTelegramModal}
            disabled={!telegramHandle}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            <Send size={14} />
            {telegramHandle ? 'Review & Dispatch Telegram Message' : 'Telegram Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};
