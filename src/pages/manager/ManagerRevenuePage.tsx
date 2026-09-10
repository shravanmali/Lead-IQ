import React, { useState, useEffect } from 'react';
import { revenueService } from '../../services/revenueService';
import { RevenueDataPoint, StaffRevenueMetric, SourceRevenueMetric } from '../../types/revenue';
import { RevenueLineChart } from '../../components/charts/RevenueLineChart';
import { RevenueBarChart } from '../../components/charts/RevenueBarChart';
import { DistributionPieChart } from '../../components/charts/DistributionPieChart';
import { KPICard } from '../../components/common/KPICard';
import { RetentionKPICard } from '../../components/retention/RetentionKPICard';
import { ManagerRetentionSection } from '../../components/retention/ManagerRetentionSection';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import {
  IndianRupee,
  TrendingUp,
  Download,
  RefreshCw,
  Calendar,
  Layers,
  Server,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const ManagerRevenuePage: React.FC = () => {
  const { showToast } = useToast();
  const [timeline, setTimeline] = useState<RevenueDataPoint[]>([]);
  const [staffMetrics, setStaffMetrics] = useState<StaffRevenueMetric[]>([]);
  const [sourceMetrics, setSourceMetrics] = useState<SourceRevenueMetric[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [dateRange, setDateRange] = useState('2026-Q3');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [t, s, src] = await Promise.all([
        revenueService.getRevenueTimeline(),
        revenueService.getRevenueByStaff(),
        revenueService.getRevenueBySource()
      ]);
      setTimeline(t);
      setStaffMetrics(s);
      setSourceMetrics(src);
    } catch (err: any) {
      showToast('Revenue API Error', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadData();
      showToast('Revenue Data Refreshed', 'Synced latest metrics from GET /api/manager/revenue', 'success');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Period,Actual Revenue,Target Revenue,Deals Closed\n' +
      timeline.map(t => `${t.period},${t.actualRevenue},${t.targetRevenue},${t.dealsClosed}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LeadIQ_Revenue_Report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Complete', 'Downloaded LeadIQ_Revenue_Report.csv', 'info');
  };

  if (isLoading) {
    return <LoadingState message="Connecting to GET /api/manager/revenue..." count={5} />;
  }

  const totalActual = timeline.reduce((acc, t) => acc + t.actualRevenue, 0);
  const totalTarget = timeline.reduce((acc, t) => acc + t.targetRevenue, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Header Controls & Backend Endpoint Indicator */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Enterprise Analytics & Intelligence
            </h2>
            <span
              className="badge"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                backgroundColor: 'rgba(79, 242, 176, 0.12)',
                color: 'var(--brand-primary)',
                border: '1px solid var(--brand-primary-border)'
              }}
            >
              LIVE ANALYTICS
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
            Aggregated financials, cohort retention intelligence, and pipeline conversion analytics
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Timeframe Toggle */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {(['daily', 'weekly', 'monthly'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: timeframe === tf ? 700 : 500,
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'calc(var(--radius-md) - 2px)',
                  backgroundColor: timeframe === tf ? 'rgba(79, 242, 176, 0.18)' : 'transparent',
                  color: timeframe === tf ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tf}
              </button>
            ))}
          </div>

          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button onClick={handleRefresh} disabled={isRefreshing} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Strip including Retention Rate */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <KPICard
          title="Recognized Revenue"
          value={formatINR(totalActual)}
          trend={{ value: '+18.4%', isPositive: true, label: 'vs last year' }}
          icon={IndianRupee}
          glow
        />
        <RetentionKPICard
          rate="78.4%"
          trendPP="+4.2 pp"
          retainedCount={392}
          totalCount={500}
          periodLabel="30-day retention"
        />
        <KPICard
          title="Average Deal Size"
          value={formatINR(425000)}
          trend={{ value: '+12.0%', isPositive: true, label: 'expansion' }}
          icon={Layers}
        />
        <KPICard
          title="Annual Run Rate (ARR)"
          value={formatINR(38500000)}
          subtitle="Projected annualized ARR"
          icon={Server}
        />
      </div>

      {/* =================================================================== */}
      {/* RETENTION INTELLIGENCE SECTION                                      */}
      {/* Complete with Chart, AI Insights, Customers at Risk & 1-Click CTA   */}
      {/* =================================================================== */}
      <ManagerRetentionSection />

      {/* Main Interactive Revenue Chart */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.875rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Revenue Performance vs Target Milestones ({dateRange})
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              Hover over points to inspect closed deals and target deviations
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
            <Calendar size={14} />
            <span>Fiscal Year 2026</span>
          </div>
        </div>

        <RevenueLineChart data={timeline} height={300} />
      </div>

      {/* Dual Column: Staff Breakdown & Lead Source Contribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* Staff Revenue Contribution */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Revenue Contribution by Sales Representative
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              Closed revenue per account executive
            </p>
          </div>
          <RevenueBarChart data={staffMetrics} height={260} />
        </div>

        {/* Lead Source Distribution */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Revenue Contribution by Lead Channel
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              Channel profitability & volume distribution
            </p>
          </div>
          <DistributionPieChart data={sourceMetrics} />
        </div>
      </div>
    </div>
  );
};

