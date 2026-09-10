import React, { useState, useEffect, useRef } from 'react';
import { getStoredLeads } from '../../services/leadService';
import { Lead } from '../../types/lead';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatters';
import { LeadScoreBadge } from './LeadScoreBadge';
import {
  Search,
  Users,
  LayoutDashboard,
  TrendingUp,
  Flame,
  PhoneCall,
  Settings,
  Sparkles,
  ArrowRight,
  Command,
  X
} from 'lucide-react';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const leads = getStoredLeads();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Navigation pages based on role
  const navItems = role === 'MANAGER'
    ? [
        { label: 'Executive Overview', path: '#/manager/dashboard', icon: LayoutDashboard, category: 'Navigation' },
        { label: 'All Company Leads', path: '#/manager/leads', icon: Users, category: 'Navigation' },
        { label: 'Smart Leads (AI Ranked)', path: '#/manager/smart-leads', icon: Flame, category: 'Navigation' },
        { label: 'Revenue Analytics', path: '#/manager/revenue', icon: TrendingUp, category: 'Navigation' },
        { label: 'AI Revenue Forecast (+90 Days)', path: '#/manager/ai-revenue-prediction', icon: Sparkles, category: 'Navigation' },
        { label: 'Staff Performance', path: '#/manager/staff', icon: Users, category: 'Navigation' },
        { label: 'CRM Preferences', path: '#/manager/settings', icon: Settings, category: 'Navigation' }
      ]
    : [
        { label: 'Staff Lead Workspace', path: '#/staff/dashboard', icon: LayoutDashboard, category: 'Navigation' },
        { label: 'My Assigned Leads', path: '#/staff/my-leads', icon: Users, category: 'Navigation' },
        { label: 'Smart Leads Priority Queue', path: '#/staff/smart-leads', icon: Flame, category: 'Navigation' },
        { label: 'Call Recordings & Transcripts', path: '#/staff/calls', icon: PhoneCall, category: 'Navigation' },
        { label: 'AI Next Step Proposals', path: '#/staff/ai-recommendations', icon: Sparkles, category: 'Navigation' },
        { label: 'Staff Preferences', path: '#/staff/settings', icon: Settings, category: 'Navigation' }
      ];

  const filteredLeads = query.trim()
    ? leads.filter(
        l =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.company.toLowerCase().includes(query.toLowerCase()) ||
          l.country.toLowerCase().includes(query.toLowerCase())
      )
    : leads.slice(0, 4);

  const filteredNav = query.trim()
    ? navItems.filter(n => n.label.toLowerCase().includes(query.toLowerCase()))
    : navItems;

  const totalResults = [...filteredLeads, ...filteredNav];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (totalResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalResults.length) % (totalResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = totalResults[selectedIndex];
      if (selected) {
        if ('path' in selected) {
          window.location.hash = selected.path;
        } else {
          window.location.hash = role === 'MANAGER' ? `#/manager/leads` : `#/staff/leads/${selected.id}`;
        }
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="glass-panel"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          animation: 'scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <Search size={18} style={{ color: 'var(--brand-primary)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search leads, companies, locations, actions..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              padding: 0,
              boxShadow: 'none'
            }}
          />
          <kbd
            style={{
              padding: '0.2rem 0.45rem',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)'
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results Stream */}
        <div style={{ padding: '0.75rem', overflowY: 'auto', maxHeight: '420px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Leads Section */}
          {filteredLeads.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0.35rem 0.5rem' }}>
                CRM Opportunities & Contacts
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {filteredLeads.map((lead, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => {
                        window.location.hash = role === 'MANAGER' ? `#/manager/leads` : `#/staff/leads/${lead.id}`;
                        onClose();
                      }}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'transparent',
                        border: isSelected ? '1px solid var(--brand-primary-border)' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-surface-elevated)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--brand-primary)'
                          }}
                        >
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {lead.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {lead.company} • {lead.country} • {formatINR(lead.dealValue)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LeadScoreBadge score={lead.score} size="sm" />
                        <ArrowRight size={13} style={{ color: isSelected ? 'var(--brand-primary)' : 'var(--text-muted)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Navigation Section */}
          {filteredNav.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0.35rem 0.5rem' }}>
                Workspaces & Views
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {filteredNav.map((nav, idx) => {
                  const globalIdx = filteredLeads.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = nav.icon;
                  return (
                    <div
                      key={nav.path}
                      onClick={() => {
                        window.location.hash = nav.path;
                        onClose();
                      }}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'transparent',
                        border: isSelected ? '1px solid var(--brand-primary-border)' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Icon size={16} style={{ color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {nav.label}
                        </span>
                      </div>
                      <ArrowRight size={13} style={{ color: isSelected ? 'var(--brand-primary)' : 'var(--text-muted)' }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.6rem 1rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>LeadIQ Global Search</span>
        </div>
      </div>
    </div>
  );
};
