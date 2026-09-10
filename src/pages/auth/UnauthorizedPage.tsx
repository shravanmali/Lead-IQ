import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';

export const UnauthorizedPage: React.FC<{ requiredRoles?: Role[] }> = ({ requiredRoles = [] }) => {
  const { user } = useAuth();

  const getAuthorizedPath = () => {
    if (!user) return '#/login';
    switch (user.role) {
      case 'ADMIN':
        return '#/admin/dashboard';
      case 'MANAGER':
        return '#/manager/dashboard';
      case 'STAFF':
        return '#/staff/dashboard';
      default:
        return '#/login';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '85vh',
        padding: '2rem',
        backgroundColor: 'var(--bg-app)'
      }}
    >
      <div
        className="card card-glow"
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '3rem 2rem'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <ShieldAlert size={32} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Access Restricted
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          You don't have permission to access this resource. Your account role is{' '}
          <strong style={{ color: 'var(--brand-primary)' }}>{user?.role || 'Guest'}</strong>, but this
          area requires{' '}
          <strong style={{ color: '#ef4444' }}>
            {requiredRoles.length > 0 ? requiredRoles.join(' / ') : 'elevated'}
          </strong>{' '}
          permissions.
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            marginBottom: '2rem'
          }}
        >
          <Lock size={14} />
          <span>Strict Enterprise Role-Based Access Control Active</span>
        </div>

        <div>
          <a href={getAuthorizedPath()} className="btn btn-primary" style={{ width: '100%' }}>
            <ArrowLeft size={16} />
            Return to My {user?.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : ''} Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};
