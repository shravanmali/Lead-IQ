import React, { useState, useEffect } from 'react';
import {
  LogOut,
  User as UserIcon,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { Role } from '../../types/auth';
import { useToast } from '../../context/ToastContext';
import { CommandSearchModal } from '../common/CommandSearchModal';
import { NotificationCenter } from '../common/NotificationCenter';

interface TopbarProps {
  pageTitle?: string;
  pageSubtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = () => {
  const { user, role, logout, switchRoleDemo } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const isLight = theme === 'light';

  // Global ⌘ K / Ctrl K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const firstName = user?.name ? user.name.split(' ')[0] : 'Alex';

  return (
    <>
      <header
        className="glass-panel"
        style={{
          height: '68px',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(6, 17, 15, 0.75)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          borderRadius: 0
        }}
      >
        {/* Left: Search Bar with ⌘ K */}
        <div style={{ flex: 1, maxWidth: '440px' }}>
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.55rem 1rem',
              borderRadius: '12px',
              backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.03)',
              border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: isLight ? '0 1px 3px rgba(0, 0, 0, 0.04)' : 'none'
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = isLight ? '#10B981' : 'rgba(79, 242, 176, 0.35)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)')}
            title="Search leads, companies, or ask AI (⌘ K)"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Search size={15} style={{ color: 'var(--brand-primary)' }} />
              <span style={{ color: isLight ? '#475569' : 'var(--text-secondary)' }}>Search leads, companies, or ask AI...</span>
            </div>
            <kbd
              style={{
                padding: '0.15rem 0.45rem',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                borderRadius: '6px',
                backgroundColor: isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.06)',
                border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isLight ? '#64748B' : 'var(--text-muted)'
              }}
            >
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* Right Controls: Role Switcher, AI Shortcut, Notifications, Date, Greeting & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Quick Demo Role Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.03)',
              border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              padding: '2px',
              gap: '2px'
            }}
            title="Switch Workspace Role"
          >
            {(['ADMIN', 'MANAGER', 'STAFF'] as Role[]).map(r => {
              const isActive = role === r;
              return (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  disabled={isSwitching}
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                    color: isActive ? (isLight ? '#FFFFFF' : '#06110F') : (isLight ? '#64748B' : 'var(--text-muted)'),
                    boxShadow: isActive ? (isLight ? '0 2px 6px rgba(16, 185, 129, 0.3)' : '0 2px 10px rgba(79, 242, 176, 0.35)') : 'none',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  {r}
                </button>
              );
            })}
          </div>

          {/* AI Shortcut Glow Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: isLight ? '#ECFDF5' : 'linear-gradient(135deg, rgba(79, 242, 176, 0.15) 0%, rgba(32, 201, 151, 0.08) 100%)',
              border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)',
              boxShadow: isLight ? '0 2px 8px rgba(16, 185, 129, 0.15)' : '0 0 12px rgba(79, 242, 176, 0.25)',
              cursor: 'pointer'
            }}
            title="Ask AI Copilot"
          >
            <Sparkles size={16} />
          </button>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: isLight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
                border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isLight ? '#475569' : 'var(--text-secondary)',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: isLight ? '0 1px 3px rgba(0, 0, 0, 0.03)' : 'none'
              }}
              title="Notifications & AI Alerts"
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-primary)',
                  boxShadow: '0 0 8px var(--brand-primary)'
                }}
              />
            </button>

            <NotificationCenter
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Vertical Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)' }} />

          {/* Date Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: isLight ? '#F8FAF9' : 'rgba(255, 255, 255, 0.02)',
              border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.06)',
              color: isLight ? '#64748B' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <Calendar size={13} style={{ color: 'var(--brand-primary)' }} />
            <span>{formattedDate}</span>
          </div>

          {/* User Profile Summary */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.3rem 0.6rem',
                borderRadius: '12px',
                backgroundColor: isLight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
                border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                boxShadow: isLight ? '0 1px 3px rgba(0, 0, 0, 0.03)' : 'none'
              }}
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--brand-primary)' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.1 }}>
                  Good morning, {firstName}
                </div>
              </div>
              <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
            </button>

            {isProfileOpen && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  padding: '0.75rem',
                  borderRadius: '16px',
                  backgroundColor: isLight ? '#FFFFFF' : '#071A16',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.25)',
                  boxShadow: isLight ? '0 12px 32px rgba(0, 0, 0, 0.08)' : 'var(--shadow-lg)',
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
                        color: 'var(--brand-primary)',
                        border: '1px solid var(--brand-primary-border)'
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
                  <UserIcon size={14} />
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
                    color: '#EF4444',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '0.25rem'
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global ⌘ K Command Search Palette Modal */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
