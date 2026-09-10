import React, { useState, useEffect } from 'react';
import { RetentionKPICard } from './RetentionKPICard';
import { RetentionTrendChart } from './RetentionTrendChart';
import { RetentionInsightCard } from './RetentionInsightCard';
import { AtRiskCustomersCard } from './AtRiskCustomersCard';
import { ReengagementModal } from './ReengagementModal';
import { retentionService } from '../../services/retentionService';
import {
  RetentionTrendPoint,
  AtRiskCustomer,
  RetentionMetrics,
  ReengagementCampaignState
} from '../../types/retention';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Eye,
  RefreshCw,
  Clock
} from 'lucide-react';

interface ManagerRetentionSectionProps {
  className?: string;
}

export const ManagerRetentionSection: React.FC<ManagerRetentionSectionProps> = ({
  className = ''
}) => {
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [metrics, setMetrics] = useState<RetentionMetrics | null>(null);
  const [trendData, setTrendData] = useState<RetentionTrendPoint[]>([]);
  const [range, setRange] = useState<'30D' | '90D' | '6M' | '1Y'>('6M');
  const [atRiskCustomers, setAtRiskCustomers] = useState<AtRiskCustomer[]>([]);
  const [campaignState, setCampaignState] = useState<ReengagementCampaignState | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSingleCustomer, setSelectedSingleCustomer] = useState<AtRiskCustomer | null>(null);

  const loadData = async () => {
    try {
      const [m, t, c] = await Promise.all([
        retentionService.getMetrics(),
        retentionService.getTrend(range),
        retentionService.getAtRiskCustomers()
      ]);
      setMetrics(m);
      setTrendData(t);
      setAtRiskCustomers(c);
      setCampaignState(retentionService.getStoredCampaignState());
    } catch (err: any) {
      showToast('Error Loading Retention Data', err.message, 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, [range]);

  const handleRangeChange = async (newRange: '30D' | '90D' | '6M' | '1Y') => {
    setRange(newRange);
    const updatedTrend = await retentionService.getTrend(newRange);
    setTrendData(updatedTrend);
  };

  const handleReengageAll = () => {
    setSelectedSingleCustomer(null);
    setIsModalOpen(true);
  };

  const handleReengageSingle = (customer: AtRiskCustomer) => {
    setSelectedSingleCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCampaignSuccess = () => {
    setCampaignState(retentionService.getStoredCampaignState());
  };

  const handleResetDemoCampaign = () => {
    retentionService.resetCampaignState();
    setCampaignState(null);
    showToast('Demo State Reset', 'Re-engagement campaign state reset for testing.', 'info');
  };

  if (!metrics || trendData.length === 0) {
    return null;
  }

  return (
    <section className={`manager-retention-section ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.15)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.25)'
              }}
            >
              <ShieldCheck size={16} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Retention Intelligence
            </h2>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isLight ? '#D1FAE5' : 'rgba(79, 242, 176, 0.15)',
                color: isLight ? '#065F46' : 'var(--brand-primary)',
                border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.3)'
              }}
            >
              AI Cohorts
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Your CRM tells you what happened. LeadIQ tells you what to do next to prevent churn.
          </p>
        </div>

        {campaignState?.isSent && (
          <button
            onClick={handleResetDemoCampaign}
            style={{
              background: 'transparent',
              border: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.70rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Reset demo campaign state"
          >
            <RefreshCw size={11} />
            <span>Reset Demo Campaign</span>
          </button>
        )}
      </div>

      {/* 2-COLUMN SECTION: Left (Retention Trend Chart) | Right (AI Insight + Follow-up) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)',
          gap: '1.5rem',
          alignItems: 'stretch'
        }}
        className="retention-grid-responsive"
      >
        {/* LEFT: Interactive Retention Line Chart */}
        <div style={{ minWidth: 0 }}>
          <RetentionTrendChart
            data={trendData}
            range={range}
            onRangeChange={handleRangeChange}
            status={metrics.status}
          />
        </div>

        {/* RIGHT: AI Retention Insight & Post-Campaign Action Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          <RetentionInsightCard
            onViewRetained={() => {
              showToast('Retained Cohort', 'Displaying 392 active customers retained for >30 days.', 'info');
            }}
          />

          {/* If campaign is sent, show follow-up AI Recommendation Card */}
          {campaignState?.isSent ? (
            <div
              className="glass-card"
              style={{
                padding: '1.25rem 1.4rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: isLight ? '#FFFFFF' : undefined,
                border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem',
                flex: 1
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={14} style={{ color: 'var(--brand-primary)' }} />
                  <span style={{ fontSize: '0.80rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ✦ AI Follow-up Recommendation
                  </span>
                </div>

                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.45 }}>
                  Monitor these 43 customers over the next 7 days. Customers who reopen the email or return to the product should receive higher priority.
                </p>
              </div>

              <div>
                <button
                  onClick={() => {
                    showToast('Response Stream', 'Tracking opens and replies for 43 recipients in real time.', 'info');
                  }}
                  style={{
                    background: isLight ? '#F0FDF4' : 'rgba(79, 242, 176, 0.12)',
                    border: isLight ? '1px solid #BBF7D0' : '1px solid rgba(79, 242, 176, 0.3)',
                    color: isLight ? '#166534' : 'var(--brand-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={12} />
                  <span>View Responses</span>
                </button>
              </div>
            </div>
          ) : (
            /* Pre-campaign summary card */
            <div
              className="glass-card"
              style={{
                padding: '1.25rem 1.4rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: isLight ? '#FFFFFF' : undefined,
                border: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.65rem',
                flex: 1
              }}
            >
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Active Cohort Summary
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  392 Retained <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 500 total</span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  78.4% of your customers actively used the platform in the last 30 days. 43 accounts require immediate re-engagement.
                </p>
              </div>

              <div style={{ borderTop: isLight ? '1px solid #F1F5F9' : '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span style={{ color: isLight ? '#059669' : '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <TrendingUp size={12} />
                  +4.2 pp vs prior period
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  30-Day Cohort
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULL-WIDTH SECTION: Customers at Risk Table & Primary CTA */}
      <AtRiskCustomersCard
        customers={atRiskCustomers}
        totalAtRiskCount={metrics.atRiskCount}
        totalRevenueAtRisk={metrics.revenueAtRisk}
        onReengageAll={handleReengageAll}
        onReengageSingle={handleReengageSingle}
        isCampaignSent={campaignState?.isSent}
        onViewCampaign={() => setIsModalOpen(true)}
      />

      {/* RE-ENGAGEMENT MODAL (Review, Personalization, Tone, Sending & Success Flow) */}
      <ReengagementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSingleCustomer(null);
        }}
        targetCustomer={selectedSingleCustomer}
        allCustomers={atRiskCustomers}
        onSuccess={handleCampaignSuccess}
      />
    </section>
  );
};
