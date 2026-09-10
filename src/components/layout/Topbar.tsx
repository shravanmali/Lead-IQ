import React, { useState } from 'react';
import {
  LogOut,
  User as UserIcon,
  Shield,
  ChevronDown,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { Role } from '../../types/auth';
import { useToast } from '../../context/ToastContext';

interface TopbarProps {
  pageTitle: string;
  pageSubtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ pageTitle, pageSubtitle }) => {
  const { user, role, logout, switchRoleDemo } = useAuth();
  const { showToast } = useToast();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleLogout = async () => {
    await logout();
    showToast('Signed Out', 'You have been safely logged out.', 'info');
    window.location.hash = '#/login';
  };

  const handleRoleSwitch = async (targetRole: Role) => {
    if (targetRole === role) return;
    setIsSwitching(true);
    try {
      const switched = await switchRoleDemo(targetRole);
      showToast(
        `Switched to ${targetRole} Role`,
        `Logged in as ${switched.name} (${switched.email})`,
        'success'
      );
      // Redirect to target role dashboard
      switch (targetRole) {
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
      showToast('Role Switch Failed', err.message, 'error');
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}
    >
      {/* Left: Page Title & Subtitle */}
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
          {pageTitle}
        </h1>
        {pageSubtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            {pageSubtitle}
          </p>
        )}
      </div>

      {/* Right: Actions, Role Demo Switcher, Theme, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Quick Role Switcher Pill Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            gap: '2px'
          }}
          title="Demo Role Switcher: Instantly test different role permissions and views"
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0 0.5rem', textTransform: 'uppercase' }}>
            Demo:
          </span>
          {(['ADMIN', 'MANAGER', 'STAFF'] as Role[]).map(r => {
            const isActive = role === r;
            const roleName = r === 'ADMIN' ? 'Admin (Aditya)' : r === 'MANAGER' ? 'Manager (Priya)' : 'Staff (Sneha)';
            return (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                disabled={isSwitching}
                title={`Switch to ${roleName}`}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                  background: isActive ? 'var(--brand-gradient)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: isActive ? '0 2px 8px rgba(59, 130, 246, 0.4)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
              {user?.name?.split(' ')[0] || 'Account'}
            </span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {isProfileOpen && (
            <div
              className="card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                padding: '0.75rem',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000
              }}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                <div style={{ marginTop: '0.35rem' }}>
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.68rem',
                      backgroundColor: 'var(--brand-primary-light)',
                      color: 'var(--brand-primary)'
                    }}
                  >
                    {user?.role} ROLE
                  </span>
                </div>
              </div>

              <a
                href={
                  role === 'ADMIN'
                    ? '#/admin/settings'
                    : role === 'MANAGER'
                    ? '#/manager/settings'
                    : '#/staff/settings'
                }
                className="btn-ghost"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.65rem',
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => setIsProfileOpen(false)}
              >
                <UserIcon size={15} />
                <span>Account Settings</span>
              </a>

              <button
                onClick={handleLogout}
                className="btn-ghost"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.65rem',
                  fontSize: '0.8125rem',
                  color: '#ef4444',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '0.25rem'
                }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
