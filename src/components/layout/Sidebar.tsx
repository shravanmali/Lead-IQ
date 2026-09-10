import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  Sparkles,
  TrendingUp,
  DollarSign,
  PhoneCall,
  Bot,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';

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
  const { user, role } = useAuth();

  const getNavItems = (userRole: Role | null): NavItem[] => {
    switch (userRole) {
      case 'ADMIN':
        return [
          { label: 'Admin Dashboard', path: '#/admin/dashboard', icon: LayoutDashboard },
          { label: 'User Management', path: '#/admin/users', icon: Users },
          { label: 'Create User', path: '#/admin/create-user', icon: UserPlus },
          { label: 'System Settings', path: '#/admin/settings', icon: Settings }
        ];

      case 'MANAGER':
        return [
          { label: 'Overview', path: '#/manager/dashboard', icon: LayoutDashboard },
          { label: 'All Leads', path: '#/manager/leads', icon: Users, badge: '9' },
          { label: 'Smart Leads', path: '#/manager/smart-leads', icon: Flame, badge: 'AI', badgeType: 'hot' },
          { label: 'Revenue Analytics', path: '#/manager/revenue', icon: DollarSign },
          { label: 'AI Revenue Forecast', path: '#/manager/ai-revenue-prediction', icon: TrendingUp, badge: '+86%', badgeType: 'primary' },
          { label: 'Staff Performance', path: '#/manager/staff', icon: Briefcase },
          { label: 'Settings', path: '#/manager/settings', icon: Settings }
        ];

      case 'STAFF':
        return [
          { label: 'My Dashboard', path: '#/staff/dashboard', icon: LayoutDashboard },
          { label: 'My Leads', path: '#/staff/my-leads', icon: Users, badge: '6' },
          { label: 'Smart Leads', path: '#/staff/smart-leads', icon: Flame, badge: 'Hot #1', badgeType: 'hot' },
          { label: 'Call Records', path: '#/staff/calls', icon: PhoneCall },
          { label: 'AI Recommendations', path: '#/staff/ai-recommendations', icon: Sparkles, badge: 'New', badgeType: 'primary' },
          { label: 'Settings', path: '#/staff/settings', icon: Settings }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems(role);

  return (
    <aside
      style={{
        width: isCollapsed ? '78px' : '260px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width var(--transition-normal)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        overflow: 'hidden'
      }}
    >
      {/* Top Brand Section */}
      <div>
        <div
          style={{
            padding: '1.25rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                flexShrink: 0
              }}
            >
              <Sparkles size={20} />
            </div>
            {!isCollapsed && (
              <div style={{ whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Lead-IQ</span>
                  <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', fontWeight: 700 }}>
                    AI
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Intelligent CRM Platform
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="btn-ghost"
              style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Role Scope Indicator */}
        {!isCollapsed && role && (
          <div
            style={{
              margin: '0.875rem 1rem 0.375rem',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={13} style={{ color: role === 'ADMIN' ? '#ef4444' : role === 'MANAGER' ? '#8b5cf6' : '#3b82f6' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                {role} ROLE
              </span>
            </div>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          </div>
        )}

        {/* Navigation List */}
        <nav style={{ padding: '0.75rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(item => {
            const isActive = currentPath === item.path || (item.path !== '#/' && currentPath.startsWith(item.path));
            const IconComponent = item.icon;

            return (
              <a
                key={item.path}
                href={item.path}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '0.75rem' : '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                  background: isActive ? 'var(--brand-gradient)' : 'transparent',
                  boxShadow: isActive ? '0 4px 16px rgba(59, 130, 246, 0.35)' : 'none',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <IconComponent size={18} style={{ flexShrink: 0 }} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive
                        ? 'rgba(255, 255, 255, 0.25)'
                        : item.badgeType === 'hot'
                        ? 'var(--status-hot-bg)'
                        : 'var(--brand-primary-light)',
                      color: isActive
                        ? '#ffffff'
                        : item.badgeType === 'hot'
                        ? 'var(--status-hot-text)'
                        : 'var(--brand-primary)',
                      border: isActive
                        ? 'none'
                        : item.badgeType === 'hot'
                        ? '1px solid var(--status-hot-border)'
                        : '1px solid rgba(59, 130, 246, 0.2)'
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

      {/* Bottom User Profile Section */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="btn-ghost"
            style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.625rem 0' }}
            title="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-elevated)'
            }}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-medium)' }}
            />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Authorized User'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email || 'user@leadiq.com'}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
