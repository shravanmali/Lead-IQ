import React from 'react';
import { Sparkles, CheckCircle2, Loader2, Bot, Brain, Target, Mail } from 'lucide-react';

interface AIProcessingOverlayProps {
  currentStep: 'transcribing' | 'summarizing' | 'scoring' | 'recommending' | 'saving' | 'complete';
}

export const AIProcessingOverlay: React.FC<AIProcessingOverlayProps> = ({ currentStep }) => {
  const steps = [
    {
      id: 'transcribing',
      title: 'Transcribing Audio Recording',
      description: 'Running Whisper STT neural model & speaker diarization...',
      icon: Bot
    },
    {
      id: 'summarizing',
      title: 'Generating Executive AI Summary',
      description: 'Extracting key topics, customer sentiments & objections...',
      icon: Brain
    },
    {
      id: 'scoring',
      title: 'Calculating Predictive Lead Score',
      description: 'Evaluating conversion probability and engagement vectors...',
      icon: Target
    },
    {
      id: 'recommending',
      title: 'Formulating Recommended Next Steps',
      description: 'Synthesizing personalized email proposal & Telegram actions...',
      icon: Mail
    }
  ];

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['transcribing', 'summarizing', 'scoring', 'recommending', 'saving', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const targetIndex = stepOrder.indexOf(stepId);

    if (targetIndex < currentIndex || currentStep === 'complete') return 'completed';
    if (targetIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div
        className="card card-glow"
        style={{
          maxWidth: '540px',
          width: '100%',
          padding: '2.5rem 2rem',
          textAlign: 'center'
        }}
      >
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
            margin: '0 auto 1.25rem',
            boxShadow: '0 0 35px rgba(59, 130, 246, 0.5)'
          }}
        >
          <Sparkles size={32} />
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Lead-IQ AI Intelligence Pipeline
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Processing multi-modal speech analytics and updating CRM database
        </p>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
          {steps.map(s => {
            const status = getStepStatus(s.id);
            const Icon = s.icon;

            return (
              <div
                key={s.id}
                className={`pipeline-step ${status === 'active' ? 'active' : status === 'completed' ? 'completed' : ''}`}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor:
                      status === 'completed'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : status === 'active'
                        ? 'var(--brand-primary-light)'
                        : 'var(--bg-surface)',
                    color:
                      status === 'completed'
                        ? '#10b981'
                        : status === 'active'
                        ? 'var(--brand-primary)'
                        : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 size={20} />
                  ) : status === 'active' ? (
                    <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: status === 'active' ? 'var(--brand-primary)' : 'var(--text-primary)'
                    }}
                  >
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {s.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};
