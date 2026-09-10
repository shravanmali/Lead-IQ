import React, { useState, useEffect } from 'react';
import { revenueService } from '../../services/revenueService';
import { RevenueDataPoint, StaffRevenueMetric, SourceRevenueMetric } from '../../types/revenue';
import { RevenueLineChart } from '../../components/charts/RevenueLineChart';
import { RevenueBarChart } from '../../components/charts/RevenueBarChart';
import { DistributionPieChart } from '../../components/charts/DistributionPieChart';
import { KPICard } from '../../components/common/KPICard';
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
  Sparkles
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Controls & Backend Endpoint Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Enterprise Revenue Performance
            </h2>
            <span
              className="badge"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.25)'
              }}
            >
              GET /api/manager/revenue
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
            Aggregated financials, staff contributions, and pipeline conversion analytics
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Timeframe Toggle */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)'
            }}
          >
            {(['daily', 'weekly', 'monthly'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: timeframe === tf ? 'var(--brand-primary)' : 'transparent',
                  color: timeframe === tf ? '#ffffff' : 'var(--text-secondary)',
                  textTransform: 'capitalize'
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

          <button onClick={handleRefresh} disabled={isRefreshing} className="btn btn-primary btn-sm">
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Revenue KPI Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <KPICard
          title="Total Recognized Revenue"
          value={formatINR(totalActual)}
          trend={{ value: '+18.4%', isPositive: true, label: 'vs last year' }}
          icon={IndianRupee}
          glow
        />
        <KPICard
          title="Target Revenue Goal"
          value={formatINR(totalTarget)}
          subtitle="Target Achievement: 108.6%"
          icon={TrendingUp}
        />
        <KPICard
          title="Average Deal Size"
          value={formatINR(425000)}
          subtitle="+12% expansion in Q3"
          icon={Layers}
        />
        <KPICard
          title="Annual Run Rate (ARR)"
          value={formatINR(38500000)}
          subtitle="Projected annualized ARR"
          icon={Server}
        />
      </div>

      {/* Main Interactive Revenue Chart */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Revenue Performance vs Target Milestones ({dateRange})
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Hover over points to inspect closed deals and target deviations
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Calendar size={14} />
            <span>Fiscal Year 2026</span>
          </div>
        </div>

        <RevenueLineChart data={timeline} height={300} />
      </div>

      {/* Dual Column: Staff Breakdown & Lead Source Contribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* Staff Revenue Contribution */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Revenue Contribution by Sales Representative
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Closed revenue per account executive
            </p>
          </div>
          <RevenueBarChart data={staffMetrics} height={260} />
        </div>

        {/* Lead Source Distribution */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Revenue Contribution by Lead Channel
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Channel profitability & volume distribution
            </p>
          </div>
          <DistributionPieChart data={sourceMetrics} />
        </div>
      </div>
    </div>
  );
};
