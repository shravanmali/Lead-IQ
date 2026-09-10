import React, { useState, useEffect } from 'react';
import { revenueService } from '../../services/revenueService';
import { StaffRevenueMetric } from '../../types/revenue';
import { LoadingState } from '../../components/common/LoadingState';
import { KPICard } from '../../components/common/KPICard';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { Briefcase, Award, TrendingUp, Target, Users, CheckCircle2 } from 'lucide-react';

export const ManagerStaffPage: React.FC = () => {
  const { showToast } = useToast();
  const [staffMetrics, setStaffMetrics] = useState<StaffRevenueMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      setIsLoading(true);
      try {
        const data = await revenueService.getRevenueByStaff();
        setStaffMetrics(data);
      } catch (err: any) {
        showToast('Error Loading Staff Data', err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadStaff();
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading Sales Team Performance Matrix..." count={4} />;
  }

  const topCloser = [...staffMetrics].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  const topConverter = [...staffMetrics].sort((a, b) => b.conversionRate - a.conversionRate)[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Sales Staff & Representative Performance
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Individual revenue generation, deal conversion rates, and quota achievement
        </p>
      </div>

      {/* Highlights Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <KPICard
          title="Top Revenue Producer"
          value={topCloser?.staffName || 'Sneha Kulkarni'}
          subtitle={`${topCloser ? formatINR(topCloser.totalRevenue) : '₹8,75,000'} revenue closed`}
          icon={Award}
          glow
        />
        <KPICard
          title="Highest Conversion Rate"
          value={`${topConverter?.conversionRate}%`}
          subtitle={`Led by ${topConverter?.staffName}`}
          icon={Target}
        />
        <KPICard
          title="Total Active Reps"
          value={staffMetrics.length}
          subtitle="Enterprise SDRs & Account Execs"
          icon={Users}
        />
      </div>

      {/* Staff Leaderboard Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {staffMetrics.map((staff, idx) => (
          <div
            key={staff.staffId}
            className="card card-hover"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              position: 'relative'
            }}
          >
            {idx === 0 && (
              <span
                className="badge badge-ai-priority"
                style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.68rem' }}
              >
                #1 PRODUCER
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={staff.avatar}
                alt={staff.staffName}
                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-primary)' }}
              />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {staff.staffName}
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Senior Enterprise AE
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                padding: '0.875rem',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Closed Revenue</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  {formatINR(staff.totalRevenue)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Conversion Rate</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>
                  {staff.conversionRate}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deals Closed</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {staff.dealsClosed} deals
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Deal Size</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatINR(staff.avgDealSize)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Monthly Target Progress</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>+{staff.trend}% vs quota</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
