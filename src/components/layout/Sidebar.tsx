import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  CheckSquare,
  BarChart3,
  MessageSquare,
  Cpu,
  Settings,
  HelpCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  Zap,
  LogOut,
  User as UserIcon,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Role } from '../../types/auth';
import { useToast } from '../../context/ToastContext';

interface SidebarProps {
  currentPath: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  badge?: string;
  badgeType?: 'primary' | 'hot' | 'warm';
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, isCollapsed, onToggleCollapse }) => {
  const { user, role, logout } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isLight = theme === 'light';

  const getNavItems = (userRole: Role | null): NavItem[] => {
    switch (userRole) {
      case 'ADMIN':
        return [
          { label: 'Dashboard', path: '#/admin/dashboard', icon: LayoutDashboard },
          { label: 'Users', path: '#/admin/users', icon: Users, badge: '5' },
          { label: 'Provision User', path: '#/admin/create-user', icon: GitBranch },
          { label: 'System Settings', path: '#/admin/settings', icon: Settings },
          { label: 'Integrations', path: '#/admin/integrations', icon: Cpu }
        ];

      case 'MANAGER':
        return [
          { label: 'Dashboard', path: '#/manager/dashboard', icon: LayoutDashboard },
          { label: 'Leads', path: '#/manager/leads', icon: Users, badge: '9' },
          { label: 'Pipeline', path: '#/manager/smart-leads', icon: GitBranch, badge: 'AI', badgeType: 'hot' },
          { label: 'Tasks', path: '#/manager/staff', icon: CheckSquare },
          { label: 'Analytics', path: '#/manager/revenue', icon: BarChart3, badge: '+22%', badgeType: 'primary' },
          { label: 'Messages', path: '#/manager/ai-chatbot', icon: MessageSquare },
          { label: 'Integrations', path: '#/manager/integrations', icon: Cpu }
        ];

      case 'STAFF':
      default:
        return [
          { label: 'Dashboard', path: '#/staff/dashboard', icon: LayoutDashboard },
          { label: 'Leads', path: '#/staff/my-leads', icon: Users, badge: '6' },
          { label: 'Pipeline', path: '#/staff/smart-leads', icon: GitBranch, badge: 'Hot', badgeType: 'hot' },
          { label: 'Tasks', path: '#/staff/calls', icon: CheckSquare },
          { label: 'Analytics', path: '#/staff/ai-recommendations', icon: BarChart3, badge: 'New', badgeType: 'primary' },
          { label: 'Messages', path: '#/staff/ai-chatbot', icon: MessageSquare },
          { label: 'Integrations', path: '#/staff/integrations', icon: Cpu }
        ];
    }
  };

  const navItems = getNavItems(role);

  const isItemActive = (itemPath: string) => {
    if (currentPath === itemPath) return true;
    if (itemPath === '#/staff/my-leads' && currentPath.startsWith('#/staff/leads/')) return true;
    if (itemPath === '#/manager/leads' && currentPath.startsWith('#/manager/leads/')) return true;
    return false;
  };

  const getSettingsPath = () => {
    if (role === 'ADMIN') return '#/admin/settings';
    if (role === 'MANAGER') return '#/manager/settings';
    return '#/staff/settings';
  };

  const handleUpgradeClick = () => {
    showToast('Pro Plan Active', 'Your LeadIQ Enterprise Pro subscription is active with unlimited AI leads & Whisper transcription.', 'success');
  };

  const handleHelpClick = () => {
    showToast('LeadIQ Support', 'Antigravity AI Assistant & 24/7 dedicated support is available in your workspace.', 'info');
  };

  return (
    <aside
      className="glass-panel"
      style={{
        width: isCollapsed ? '72px' : '240px',
        minWidth: isCollapsed ? '72px' : '240px',
        borderTop: 'none',
        borderLeft: 'none',
        borderBottom: 'none',
        borderRight: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(6, 17, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: isLight ? '0 4px 20px rgba(0, 0, 0, 0.03)' : '4px 0 24px rgba(0, 0, 0, 0.35)'
      }}
    >
      {/* Top Brand Section */}
      <div>
        <div
          style={{
            padding: '1.25rem 1rem 1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: isLight ? '1px solid #F1F5F9' : '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
            <img
              src="/logo.png"
              alt="Lead-IQ Logo"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                objectFit: 'contain',
                boxShadow: isLight ? '0 2px 8px rgba(16, 185, 129, 0.2)' : '0 2px 12px rgba(79, 242, 176, 0.35)',
                backgroundColor: isLight ? '#FFFFFF' : '#06110F',
                flexShrink: 0
              }}
            />
            {!isCollapsed && (
              <div style={{ whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Lead-IQ</span>
                  <span
                    style={{
                      fontSize: '0.58rem',
                      padding: '0.1rem 0.3rem',
                      borderRadius: '4px',
                      background: isLight ? '#ECFDF5' : 'linear-gradient(135deg, rgba(79, 242, 176, 0.2) 0%, rgba(32, 201, 151, 0.1) 100%)',
                      color: 'var(--brand-primary)',
                      fontWeight: 800,
                      border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.3)'
                    }}
                  >
                    AI
                  </span>
                </div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  FIND. PRIORITIZE. CONVERT.
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="btn-ghost"
              style={{ padding: '0.3rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}
              title="Collapse sidebar"
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '0.85rem 0.55rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(item => {
            const isActive = isItemActive(item.path);
            const IconComponent = item.icon;

            return (
              <a
                key={item.label}
                href={item.path}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '0.65rem' : '0.55rem 0.8rem',
                  borderRadius: '10px',
                  color: isActive
                    ? (isLight ? '#0B1324' : '#FFFFFF')
                    : 'var(--text-secondary)',
                  background: isActive
                    ? (isLight ? '#DFF7EE' : 'linear-gradient(135deg, rgba(79, 242, 176, 0.22) 0%, rgba(32, 201, 151, 0.12) 100%)')
                    : 'transparent',
                  border: isActive
                    ? (isLight ? '1px solid rgba(16, 185, 129, 0.28)' : '1px solid rgba(79, 242, 176, 0.35)')
                    : '1px solid transparent',
                  boxShadow: isActive
                    ? (isLight ? '0 2px 8px rgba(16, 185, 129, 0.12)' : '0 4px 16px rgba(79, 242, 176, 0.18), inset 0 1px 0 rgba(79, 242, 176, 0.3)')
                    : 'none',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.825rem',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <IconComponent
                    size={17}
                    style={{
                      flexShrink: 0,
                      color: isActive ? 'var(--brand-primary)' : (isLight ? '#94A3B8' : 'var(--text-muted)'),
                      filter: isActive && !isLight ? 'drop-shadow(0 0 6px rgba(79, 242, 176, 0.6))' : 'none'
                    }}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive
                        ? (isLight ? '#A7F3D0' : 'rgba(79, 242, 176, 0.25)')
                        : item.badgeType === 'hot'
                        ? 'var(--status-hot-bg)'
                        : 'var(--brand-primary-light)',
                      color: isActive
                        ? (isLight ? '#065F46' : '#FFFFFF')
                        : item.badgeType === 'hot'
                        ? 'var(--status-hot-text)'
                        : 'var(--brand-primary)',
                      border: isActive
                        ? 'none'
                        : item.badgeType === 'hot'
                        ? '1px solid var(--status-hot-border)'
                        : '1px solid var(--brand-primary-border)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation & Profile Section */}
      <div style={{ padding: '0.65rem', borderTop: isLight ? '1px solid #F1F5F9' : '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Settings & Help */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <a
            href={getSettingsPath()}
            title={isCollapsed ? 'Settings' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '0.7rem',
              padding: isCollapsed ? '0.55rem' : '0.45rem 0.8rem',
              borderRadius: '8px',
              color: isItemActive(getSettingsPath()) ? 'var(--brand-primary)' : 'var(--text-secondary)',
              backgroundColor: isItemActive(getSettingsPath()) ? (isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.1)') : 'transparent',
              textDecoration: 'none',
              fontSize: '0.8125rem',
              fontWeight: 500,
              transition: 'background 0.15s ease'
            }}
          >
            <Settings size={16} style={{ color: isItemActive(getSettingsPath()) ? 'var(--brand-primary)' : (isLight ? '#94A3B8' : 'var(--text-muted)') }} />
            {!isCollapsed && <span>Settings</span>}
          </a>

          <button
            onClick={handleHelpClick}
            title={isCollapsed ? 'Help & Support' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '0.7rem',
              padding: isCollapsed ? '0.55rem' : '0.45rem 0.8rem',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <HelpCircle size={16} style={{ color: isLight ? '#94A3B8' : 'var(--text-muted)' }} />
            {!isCollapsed && <span>Help & Support</span>}
          </button>
        </div>

        {/* Upgrade to Pro Card */}
        {!isCollapsed && (
          <div
            onClick={handleUpgradeClick}
            style={{
              margin: '0.2rem 0',
              padding: '0.75rem 0.85rem',
              borderRadius: '12px',
              background: isLight ? 'linear-gradient(135deg, #ECFDF5 0%, #DFF7EE 100%)' : 'linear-gradient(135deg, rgba(79, 242, 176, 0.12) 0%, rgba(10, 32, 28, 0.8) 100%)',
              border: isLight ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(79, 242, 176, 0.25)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Crown size={14} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Upgrade to Pro
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--brand-primary)',
                  color: isLight ? '#FFFFFF' : '#06110F'
                }}
              >
                PRO
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 0.4rem 0', lineHeight: 1.35 }}>
              Unlock advanced insights and automation.
            </p>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>Upgrade</span>
              <span>→</span>
            </div>
          </div>
        )}

        {/* User Profile Card with Three-Dot Menu */}
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="btn-ghost"
            style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}
            title="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        ) : (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.55rem',
                borderRadius: '12px',
                backgroundColor: isLight ? '#F8FAF9' : 'rgba(255, 255, 255, 0.03)',
                border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'Alex Carter'}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: isLight ? '1.5px solid #10B981' : '1.5px solid rgba(79, 242, 176, 0.4)', flexShrink: 0 }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user?.name || 'Alex Carter'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {role === 'MANAGER' ? 'Sales Manager' : role === 'ADMIN' ? 'System Administrator' : 'Sales Representative'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="btn-ghost"
                style={{ padding: '0.25rem', borderRadius: '6px', color: 'var(--text-muted)' }}
                title="Account options"
              >
                <MoreVertical size={15} />
              </button>
            </div>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  padding: '0.6rem',
                  borderRadius: '14px',
                  backgroundColor: isLight ? '#FFFFFF' : '#071A16',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.25)',
                  boxShadow: isLight ? '0 12px 32px rgba(0, 0, 0, 0.08)' : '0 12px 36px rgba(0, 0, 0, 0.6)',
                  zIndex: 200
                }}
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.email}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--brand-primary)', fontWeight: 600 }}>{role} Plan</div>
                </div>

                <a
                  href={getSettingsPath()}
                  className="btn-ghost"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.5rem',
                    fontSize: '0.76rem',
                    color: 'var(--text-secondary)'
                  }}
                  onClick={() => setShowProfileMenu(false)}
                >
                  <UserIcon size={13} />
                  <span>Profile Settings</span>
                </a>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    window.location.hash = '#/login';
                  }}
                  className="btn-ghost"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.5rem',
                    fontSize: '0.76rem',
                    color: '#EF4444',
                    marginTop: '0.2rem'
                  }}
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
