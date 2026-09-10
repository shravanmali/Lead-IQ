import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Zap, Activity, MessageSquareQuote } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('staff@leadiq.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Validation Error', 'Please enter your corporate email address.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login({ email, password, rememberMe });
      showToast(
        'Authentication Successful',
        `Welcome back, ${user.name}! Redirecting to ${user.role} workspace...`,
        'success'
      );

      // Redirect to role-specific dashboard
      switch (user.role) {
        case 'ADMIN':
          window.location.hash = '#/admin/dashboard';
          break;
        case 'MANAGER':
          window.location.hash = '#/manager/dashboard';
          break;
        case 'STAFF':
          window.location.hash = '#/staff/dashboard';
          break;
      }
    } catch (err: any) {
      showToast('Login Failed', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('LeadIQ@2026');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)'
      }}
    >
      {/* LEFT SIDE: Brand Hero & AI Value Proposition */}
      <div
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.18), transparent 70%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.18), transparent 70%), var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '3.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.45)'
              }}
            >
              <Sparkles size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Lead-IQ</span>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', fontWeight: 700 }}>
                  INDIA
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Next-Gen AI Lead Intelligence & CRM Platform
              </div>
            </div>
          </div>

          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
              background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--brand-primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Turn every lead into an opportunity.
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '480px', marginBottom: '2.5rem' }}>
            Lead-IQ empowers Indian enterprise sales teams with real-time Whisper speech transcription, predictive conversion scoring, and automated multi-channel follow-ups.
          </p>

          {/* Testimonial & Value Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '460px' }}>
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-glass-card)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.84rem',
                lineHeight: 1.5,
                color: 'var(--text-secondary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-primary)', fontWeight: 700, marginBottom: '0.35rem' }}>
                <MessageSquareQuote size={16} />
                <span>Enterprise Spotlight</span>
              </div>
              "Lead-IQ helped our sales team in Pune and Mumbai prioritize high-value leads and significantly improve our follow-up process."
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.5rem', fontSize: '0.78rem' }}>
                — Priya Deshmukh, Head of Revenue Operations, Mumbai
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-glass-card)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ color: 'var(--brand-primary)', flexShrink: 0 }}>
                <Zap size={20} />
              </div>
              <div style={{ fontSize: '0.84rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Smart Leads Prioritization:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>Automated descending ranking prioritizing 90+ Hot score opportunities first.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Security Badging */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
          <ShieldCheck size={16} style={{ color: '#10b981' }} />
          <span>GST Ready • AWS Mumbai Cloud Data Residency • 3-Role Isolation</span>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 2rem',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
          <ThemeToggle />
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              Sign in to Lead-IQ
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Enter your corporate credentials. Role is detected automatically.
            </p>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div
            style={{
              padding: '0.875rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.75rem'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Quick Demo Fill (Click to select account):
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('staff@leadiq.in')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
              >
                Staff (Sneha Kulkarni)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('manager@leadiq.in')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
              >
                Manager (Priya Deshmukh)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@leadiq.in')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
              >
                Admin (Aditya Mehta)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Corporate Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@leadiq.in"
                  style={{ width: '100%', paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <a
                  href="#/login"
                  onClick={e => {
                    e.preventDefault();
                    showToast('Password Reset', 'Password reset instructions sent to your email.', 'info');
                  }}
                  style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width: '100%', paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ width: 'auto', margin: 0 }}
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
