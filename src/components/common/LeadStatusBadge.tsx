import React from 'react';
import { LeadStatus } from '../../types/lead';

interface LeadStatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status, size = 'md' }) => {
  let style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
    fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
    padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.625rem',
  };

  let dotColor = '#64748b';

  switch (status) {
    case 'New':
      style = { ...style, backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.25)' };
      dotColor = '#3b82f6';
      break;
    case 'Contacted':
      style = { ...style, backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.25)' };
      dotColor = '#8b5cf6';
      break;
    case 'Interested':
      style = { ...style, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
      dotColor = '#f59e0b';
      break;
    case 'Approved':
      style = { ...style, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' };
      dotColor = '#10b981';
      break;
    case 'Converted':
      style = { ...style, background: 'var(--brand-gradient)', color: '#ffffff', boxShadow: '0 0 12px rgba(59, 130, 246, 0.3)' };
      dotColor = '#ffffff';
      break;
    case 'Hold':
      style = { ...style, backgroundColor: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.3)' };
      dotColor = '#94a3b8';
      break;
    case 'Declined':
      style = { ...style, backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)' };
      dotColor = '#ef4444';
      break;
  }

  return (
    <span style={style}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block'
        }}
      />
      {status}
    </span>
  );
};
