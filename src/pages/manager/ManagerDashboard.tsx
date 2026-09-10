import React, { useState, useEffect } from 'react';
import { revenueService, ManagerKPIs } from '../../services/revenueService';
import { leadService } from '../../services/leadService';
import { Lead } from '../../types/lead';
import { RevenueDataPoint, StaffRevenueMetric, SourceRevenueMetric } from '../../types/revenue';
import { KPICard } from '../../components/common/KPICard';
import { RevenueLineChart } from '../../components/charts/RevenueLineChart';
import { RevenueBarChart } from '../../components/charts/RevenueBarChart';
import { DistributionPieChart } from '../../components/charts/DistributionPieChart';
import { LeadScoreBadge } from '../../components/common/LeadScoreBadge';
import { LeadStatusBadge } from '../../components/common/LeadStatusBadge';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import {
  IndianRupee,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Flame,
  Sparkles,
  ArrowRight,
  Target
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [kpis, setKpis] = useState<ManagerKPIs | null>(null);
  const [timeline, setTimeline] = useState<RevenueDataPoint[]>([]);
  const [staffMetrics, setStaffMetrics] = useState<StaffRevenueMetric[]>([]);
  const [sourceMetrics, setSourceMetrics] = useState<SourceRevenueMetric[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadManagerData = async () => {
      setIsLoading(true);
      try {
        const [k, t, s, src, l] = await Promise.all([
          revenueService.getManagerKPIs(),
          revenueService.getRevenueTimeline(),
          revenueService.getRevenueByStaff(),
          revenueService.getRevenueBySource(),
          leadService.getLeads()
        ]);
        setKpis(k);
        setTimeline(t);
        setStaffMetrics(s);
        setSourceMetrics(src);
        setLeads(l);
      } catch (err: any) {
        showToast('Error Loading CRM Data', err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadManagerData();
  }, []);

  if (isLoading || !kpis) {
    return <LoadingState message="Loading Manager Executive Dashboard..." count={4} />;
  }

  const topSmartLeads = [...leads].sort((a, b) => b.score.score - a.score.score).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner with AI Forecast Quick Insight */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Executive Revenue & CRM Intelligence
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              AI Model Forecast: Q3 revenue projected at <strong>₹7,68,000 (+86.2%)</strong> with 94.6% confidence
            </div>
          </div>
        </div>

        <a href="#/manager/ai-revenue-prediction" className="btn btn-primary btn-sm">
          <TrendingUp size={14} />
          <span>View 90-Day AI Forecast</span>
        </a>
      </div>

      {/* TOP 8 KPI METRIC CARDS */}
      <div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.875rem' }}>
          Key Performance Indicators (Backend API Synced)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <KPICard
            title="Total Revenue (YTD)"
            value={formatINR(kpis.totalRevenue)}
            trend={{ value: '+18.4%', isPositive: true, label: 'vs last year' }}
            icon={IndianRupee}
            glow
          />
          <KPICard
            title="Revenue This Month"
            value={formatINR(kpis.revenueThisMonth)}
            trend={{ value: `+${kpis.monthlyGrowthPercent}%`, isPositive: true, label: 'vs target' }}
            icon={TrendingUp}
          />
          <KPICard
            title="Conversion Rate"
            value={`${kpis.conversionRate}%`}
            trend={{ value: '+4.2%', isPositive: true, label: 'closing speed' }}
            icon={Target}
          />
          <KPICard
            title="Average Lead Score"
            value={`${kpis.averageLeadScore} / 100`}
            subtitle="AI Predictive Health"
            icon={Flame}
          />
          <KPICard
            title="Total Leads"
            value={kpis.totalLeads}
            subtitle="Active In-Flight Pipeline"
            icon={Users}
          />
          <KPICard
            title="Approved Deals"
            value={kpis.approvedLeads}
            subtitle="Ready for Contract Closing"
            icon={CheckCircle2}
          />
          <KPICard
            title="On-Hold Leads"
            value={kpis.holdLeads}
            subtitle="Pending Fiscal Clearance"
            icon={PauseCircle}
          />
          <KPICard
            title="Declined / Cold"
            value={kpis.declinedLeads}
            subtitle="Nurture Sequence Active"
            icon={XCircle}
          />
        </div>
      </div>

      {/* CHARTS ROW: Revenue Growth + Staff Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* Revenue Growth Timeline */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Revenue Growth Timeline
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Monthly actual vs targeted ARR milestones
              </p>
            </div>
            <a href="#/manager/revenue" className="btn-ghost btn-sm" style={{ color: 'var(--brand-primary)' }}>
              Full Details →
            </a>
          </div>
          <RevenueLineChart data={timeline} height={240} />
        </div>

        {/* Staff Performance Ranking */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Revenue by Sales Staff
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Individual deal closing performance
              </p>
            </div>
            <a href="#/manager/staff" className="btn-ghost btn-sm" style={{ color: 'var(--brand-primary)' }}>
              Team Analytics →
            </a>
          </div>
          <RevenueBarChart data={staffMetrics} height={240} />
        </div>
      </div>

      {/* LOWER ROW: Smart Leads Priority Queue & Source Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Top Smart Leads Queue */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                AI Smart Leads (Priority Ranked)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Sorted strictly in descending order by AI Predictive Score
              </p>
            </div>
            <a href="#/manager/smart-leads" className="btn-ghost btn-sm" style={{ color: 'var(--brand-primary)' }}>
              View All (Score DESC) →
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topSmartLeads.map((lead, idx) => (
              <div
                key={lead.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
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
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', width: '20px' }}>
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
                  <LeadStatusBadge status={lead.status} size="sm" />
                  <LeadScoreBadge score={lead.score} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Source Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Revenue by Acquisition Channel
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Conversion volume per lead source
              </p>
            </div>
          </div>
          <DistributionPieChart data={sourceMetrics} />
        </div>
      </div>
    </div>
  );
};
