import React from 'react';
import { Sparkles, Flame, PhoneCall, TrendingUp, CheckCircle2, Clock, X } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNotification?: (targetPath: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, onSelectNotification }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      type: 'hot_lead',
      title: 'High-Purchase Intent Detected',
      message: 'Rahul Sharma (Shree Enterprises) opened proposal 3× and visited pricing. AI Score upgraded to 92/100.',
      time: '2 min ago',
      unread: true,
      path: '#/staff/leads/lead-1',
      icon: Flame,
      color: '#EF4444'
    },
    {
      id: 'notif-2',
      type: 'transcript',
      title: 'Whisper Call Transcribed',
      message: 'Natural Indian English dialogue processed for Priya Deshmukh. Telegram handle @priya_mbs extracted.',
      time: '18 min ago',
      unread: true,
      path: '#/staff/calls',
      icon: PhoneCall,
      color: '#4FF2B0'
    },
    {
      id: 'notif-3',
      type: 'revenue',
      title: 'Monthly Revenue Pacing Milestone',
      message: 'September recognized revenue crossed ₹5,80,000 (+17.2% above baseline quota).',
      time: '1 hour ago',
      unread: false,
      path: '#/manager/revenue',
      icon: TrendingUp,
      color: '#20C997'
    },
    {
      id: 'notif-4',
      type: 'recommendation',
      title: 'AI Priority Action Required',
      message: 'Follow-up with Amit Patil (Patil Industries, ₹8,50,000) recommended within 2 hours.',
      time: '3 hours ago',
      unread: false,
      path: '#/staff/ai-recommendations',
      icon: Sparkles,
      color: '#4FF2B0'
    }
  ];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8990
        }}
      />
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '52px',
          right: '80px',
          width: '360px',
          borderRadius: '16px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 24px rgba(79, 242, 176, 0.12)',
          zIndex: 8999,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Notifications & Alerts
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)'
              }}
            >
              2 new
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '0.2rem', color: 'var(--text-muted)' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {notifications.map(n => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => {
                  if (onSelectNotification) onSelectNotification(n.path);
                  else window.location.hash = n.path;
                  onClose();
                }}
                style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: n.unread ? 'rgba(79, 242, 176, 0.04)' : 'transparent',
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)'
                }}
                className="notification-item"
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: n.color
                  }}
                >
                  <Icon size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {n.title}
                    </span>
                    {n.unread && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    {n.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.5rem 1rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: 'var(--brand-primary)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={onClose}
        >
          Mark all as read
        </div>
      </div>
    </>
  );
};
