import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { callService } from '../../services/callService';
import { Lead } from '../../types/lead';
import { CallRecord } from '../../types/call';
import { useAuth } from '../../context/AuthContext';
import { KPICard } from '../../components/common/KPICard';
import { LeadScoreBadge } from '../../components/common/LeadScoreBadge';
import { LeadStatusBadge } from '../../components/common/LeadStatusBadge';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import {
  Users,
  Flame,
  PhoneCall,
  Sparkles,
  ArrowRight,
  Phone,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [smartLeads, setSmartLeads] = useState<Lead[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaffData = async () => {
      setIsLoading(true);
      try {
        const staffId = user?.id;
        const [allLeads, sortedSmart, callList] = await Promise.all([
          leadService.getLeads({ assignedStaffId: staffId }),
          leadService.getSmartLeads(staffId),
          callService.getCallHistory(staffId)
        ]);
        setLeads(allLeads);
        setSmartLeads(sortedSmart);
        setCalls(callList);
      } catch (err: any) {
        showToast('Error Loading Data', err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadStaffData();
  }, [user]);

  if (isLoading) {
    return <LoadingState message="Loading your assigned lead portfolio..." count={4} />;
  }

  const hotLeads = smartLeads.filter(l => l.score.score >= 85);
  const pendingFollowups = smartLeads.filter(l => l.status === 'Interested' || l.status === 'Contacted');
  const topSmartLead = smartLeads[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-glow)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-primary)' }}
          />
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Marcus'}! 👋
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              You have <strong>{hotLeads.length} Hot Leads (Score 85+)</strong> ready for follow-up today.
            </div>
          </div>
        </div>

        {topSmartLead && (
          <a
            href={`#/staff/leads/${topSmartLead.id}`}
            className="btn btn-primary"
            style={{ boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)' }}
          >
            <Phone size={15} />
            <span>Call AI Priority #1 ({topSmartLead.name})</span>
          </a>
        )}
      </div>

      {/* KPI Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <KPICard
          title="Assigned Active Leads"
          value={leads.length}
          subtitle="Direct Account Portfolio"
          icon={Users}
        />
        <KPICard
          title="Hot Conversion Leads"
          value={hotLeads.length}
          subtitle="Score >= 85 (High Intent)"
          icon={Flame}
          glow
        />
        <KPICard
          title="Call Transcripts Completed"
          value={calls.length}
          subtitle="Whisper STT Analyzed"
          icon={PhoneCall}
        />
        <KPICard
          title="Pending Actions"
          value={pendingFollowups.length}
          subtitle="Proposals & Next Steps"
          icon={Sparkles}
        />
      </div>

      {/* DUAL SECTION: Smart Leads Queue + Recent Call Intelligence */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* Smart Leads Priority Queue */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Smart Leads Priority Queue
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Sorted in descending order by AI Lead Score
                </p>
              </div>
              <a href="#/staff/smart-leads" className="btn-ghost btn-sm" style={{ color: 'var(--brand-primary)' }}>
                View All →
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {smartLeads.slice(0, 4).map((lead, idx) => (
                <div
                  key={lead.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: idx === 0 ? 'var(--brand-primary-light)' : 'var(--bg-surface-elevated)',
                    border: idx === 0 ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {idx === 0 ? (
                      <span className="badge badge-ai-priority" style={{ fontSize: '0.65rem' }}>
                        #1
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', width: '18px' }}>
                        #{idx + 1}
                      </span>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {lead.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {lead.company} • {formatINR(lead.dealValue)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <LeadScoreBadge score={lead.score} size="sm" />
                    <a
                      href={`#/staff/leads/${lead.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                    >
                      <span>Call Lead</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Call Intelligence & Recordings */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Recent Call Intelligence
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Processed Whisper recordings and summaries
                </p>
              </div>
              <a href="#/staff/calls" className="btn-ghost btn-sm" style={{ color: 'var(--brand-primary)' }}>
                All Records →
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {calls.slice(0, 3).map(call => (
                <div
                  key={call.id}
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      Call with {call.leadName}
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                      Whisper Transcribed
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                    "{call.summary.overview.slice(0, 140)}..."
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem' }}>
                    <span>Duration: {Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s</span>
                    <a href={`#/staff/leads/${call.leadId}`} style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
                      Open Full Dossier →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
