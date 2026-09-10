import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const StaffAIChatbotPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', textAlign: 'center' }}>
      <div className="card card-glow" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 18px rgba(59, 130, 246, 0.45)'
          }}
        >
          <Sparkles size={28} />
        </div>

        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, marginBottom: '0.35rem' }}>
            Lead-IQ AI Floating Assistant Active
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Your Staff AI Assistant is always available as a persistent floating copilot in the <strong>bottom-right corner</strong> of your screen. Click the glowing AI button anytime to check priority leads, review transcripts, or get contact recommendations.
          </p>
        </div>

        <a href="#/staff/dashboard" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          <span>Return to Staff Dashboard</span>
          <ArrowRight size={15} />
        </a>
      </div>
    </div>
  );
};
