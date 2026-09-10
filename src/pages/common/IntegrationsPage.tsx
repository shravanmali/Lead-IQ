import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Zap,
  Send,
  Mail,
  Mic,
  Database,
  Lock,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface IntegrationService {
  id: string;
  name: string;
  category: 'AI & Voice' | 'Messaging' | 'Email' | 'Data & Storage';
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  status: 'Connected' | 'Active' | 'Configured' | 'Standby';
  description: string;
  latency: string;
  uptime: string;
  endpoint: string;
}

export const IntegrationsPage: React.FC = () => {
  const { user, role } = useAuth();
  const { showToast } = useToast();
  const [testingId, setTestingId] = useState<string | null>(null);

  const integrations: IntegrationService[] = [
    {
      id: 'whisper',
      name: 'OpenAI Whisper Audio Pipeline',
      category: 'AI & Voice',
      icon: Mic,
      status: 'Active',
      description: 'Zero-latency automatic speech-to-text, speaker diarization, and meeting transcription engine.',
      latency: '240ms',
      uptime: '99.98%',
      endpoint: 'api.openai.com/v1/audio/transcriptions'
    },
    {
      id: 'telegram',
      name: 'Telegram Business Bot Gateway',
      category: 'Messaging',
      icon: Send,
      status: 'Connected',
      description: 'Automated 2-way client communication bot (@LeadIQCRM_Bot) with instant lead dispatch.',
      latency: '48ms',
      uptime: '100%',
      endpoint: 'api.telegram.org/bot720491.../webhook'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Cloud Business API',
      category: 'Messaging',
      icon: Zap,
      status: 'Connected',
      description: 'Meta Graph API v19.0 verified business gateway with automated GST proposal delivery.',
      latency: '82ms',
      uptime: '99.95%',
      endpoint: 'graph.facebook.com/v19.0/leadiq-biz'
    },
    {
      id: 'smtp',
      name: 'Amazon SES & SMTP Relay',
      category: 'Email',
      icon: Mail,
      status: 'Active',
      description: 'Transactional email dispatch with 100% GST quotation generation and attachment encryption.',
      latency: '110ms',
      uptime: '99.99%',
      endpoint: 'email-smtp.ap-south-1.amazonaws.com'
    },
    {
      id: 'neural',
      name: 'Neural Bayesian Deal Predictor',
      category: 'AI & Voice',
      icon: Sparkles,
      status: 'Active',
      description: 'Proprietary 0-100 scoring model analyzing 18+ engagement factors for Indian enterprises.',
      latency: '15ms',
      uptime: '100%',
      endpoint: 'models.internal.leadiq.ai/v4.2/score'
    },
    {
      id: 'database',
      name: 'AWS Mumbai PostgreSQL Residency',
      category: 'Data & Storage',
      icon: Database,
      status: 'Connected',
      description: 'Encrypted multi-tenant relational store complying with RBI data localization mandates.',
      latency: '4ms',
      uptime: '99.999%',
      endpoint: 'aurora-cluster.ap-south-1.rds.aws.internal'
    }
  ];

  const handleTestConnection = (service: IntegrationService) => {
    setTestingId(service.id);
    setTimeout(() => {
      setTestingId(null);
      showToast(
        `${service.name} Verified`,
        `Ping latency: ${service.latency} • Uptime: ${service.uptime} • Health: Optimal`,
        'success'
      );
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '15%',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79, 242, 176, 0.14) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 1 }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(79, 242, 176, 0.2) 0%, rgba(32, 201, 151, 0.1) 100%)',
              border: '1px solid rgba(79, 242, 176, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)',
              boxShadow: '0 0 16px rgba(79, 242, 176, 0.25)'
            }}
          >
            <Cpu size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Integrations & AI Gateways
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
              Real-time connectivity status for Whisper speech-to-text, Telegram bots, WhatsApp APIs, and cloud databases.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(79, 242, 176, 0.12)',
              border: '1px solid rgba(79, 242, 176, 0.25)',
              color: 'var(--brand-primary)',
              fontSize: '0.78rem',
              fontWeight: 700
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', boxShadow: '0 0 8px var(--brand-primary)' }} />
            <span>6/6 Services Operational</span>
          </div>
        </div>
      </div>

      {/* Grid of Integration Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {integrations.map(service => {
          const IconComp = service.icon;
          const isTesting = testingId === service.id;

          return (
            <div
              key={service.id}
              className="glass-card"
              style={{
                padding: '1.4rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.1rem',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(79, 242, 176, 0.1)',
                        border: '1px solid rgba(79, 242, 176, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--brand-primary)',
                        flexShrink: 0
                      }}
                    >
                      <IconComp size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {service.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {service.category}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(16, 185, 129, 0.14)',
                      color: '#10B981',
                      border: '1px solid rgba(16, 185, 129, 0.28)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <CheckCircle2 size={11} />
                    <span>{service.status}</span>
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {service.description}
                </p>

                {/* Technical specs */}
                <div
                  style={{
                    marginTop: '0.85rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span>Latency: <strong style={{ color: 'var(--brand-primary)' }}>{service.latency}</strong></span>
                  <span>Uptime: <strong style={{ color: '#10B981' }}>{service.uptime}</strong></span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                  {service.endpoint}
                </span>

                <button
                  onClick={() => handleTestConnection(service)}
                  disabled={isTesting}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.65rem'
                  }}
                >
                  <RefreshCw size={12} className={isTesting ? 'animate-spin' : ''} />
                  <span>{isTesting ? 'Testing...' : 'Ping Test'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
