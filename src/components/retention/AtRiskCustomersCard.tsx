import React from 'react';
import { AtRiskCustomer } from '../../types/retention';
import { formatINR } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import {
  AlertTriangle,
  Send,
  Sparkles,
  Building2,
  Clock,
  IndianRupee,
  CheckCircle2,
  Mail
} from 'lucide-react';

interface AtRiskCustomersCardProps {
  customers: AtRiskCustomer[];
  totalAtRiskCount?: number;
  totalRevenueAtRisk?: number;
  onReengageAll: () => void;
  onReengageSingle: (customer: AtRiskCustomer) => void;
  isCampaignSent?: boolean;
  onViewCampaign?: () => void;
}

export const AtRiskCustomersCard: React.FC<AtRiskCustomersCardProps> = ({
  customers,
  totalAtRiskCount = 43,
  totalRevenueAtRisk = 840000,
  onReengageAll,
  onReengageSingle,
  isCampaignSent = false,
  onViewCampaign
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (customers.length === 0 && !isCampaignSent) {
    return (
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          backgroundColor: isLight ? '#FFFFFF' : undefined,
          border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.2)'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.15)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}
        >
          <CheckCircle2 size={24} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Excellent retention ✦
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          No customers currently require re-engagement. Your customer retention is healthy.
        </p>
      </div>
    );
  }

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem 1.6rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: isLight ? '#FFFFFF' : undefined,
        border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.22)',
        boxShadow: isLight
          ? '0 2px 16px rgba(0, 0, 0, 0.04)'
          : '0 8px 32px rgba(0, 0, 0, 0.35), 0 0 20px rgba(79, 242, 176, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      {/* Header & Risk Metrics Bar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
              Customers at Risk
            </h3>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isLight ? '#FEE2E2' : 'rgba(239, 68, 68, 0.15)',
                color: isLight ? '#DC2626' : '#F87171',
                border: isLight ? '1px solid #FECACA' : '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <AlertTriangle size={11} />
              {isCampaignSent ? 'Campaign In-Flight' : `${totalAtRiskCount} Inactive`}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Customers who have not returned in the last 30 days.
          </div>
        </div>

        {/* Highlight Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isLight ? '#F8FAF9' : 'rgba(255, 255, 255, 0.04)',
              border: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Non-Retained
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {isCampaignSent ? '43 Contacted' : `${totalAtRiskCount} customers`}
            </span>
          </div>

          <div
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isLight ? '#FEF3C7' : 'rgba(245, 158, 11, 0.12)',
              border: isLight ? '1px solid #FDE68A' : '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span style={{ fontSize: '0.65rem', color: isLight ? '#92400E' : '#FBBF24', textTransform: 'uppercase', fontWeight: 600 }}>
              Revenue at Risk
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#78350F' : '#FDE68A', fontFamily: 'var(--font-mono)' }}>
              {formatINR(totalRevenueAtRisk)}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Re-engagement Action Banner */}
      {!isCampaignSent ? (
        <div
          style={{
            padding: '1.15rem 1.35rem',
            borderRadius: 'var(--radius-md)',
            background: isLight
              ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
              : 'linear-gradient(135deg, rgba(7, 24, 19, 0.95) 0%, rgba(16, 38, 32, 0.95) 100%)',
            border: isLight ? '1.5px solid #A7F3D0' : '1.5px solid rgba(79, 242, 176, 0.35)',
            boxShadow: isLight
              ? '0 4px 20px rgba(16, 185, 129, 0.12)'
              : '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 242, 176, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} style={{ color: isLight ? '#059669' : 'var(--brand-primary)' }} />
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: isLight ? '#065F46' : 'var(--text-primary)' }}>
                Re-engage Customers
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#047857' : 'var(--text-secondary)' }}>
              Send a personalized follow-up to customers who haven't returned in 30 days.
            </span>
          </div>

          <button
            onClick={onReengageAll}
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.84rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: 'var(--radius-md)',
              boxShadow: isLight
                ? '0 4px 14px rgba(16, 185, 129, 0.3)'
                : '0 0 20px rgba(79, 242, 176, 0.4)'
            }}
          >
            <Sparkles size={15} />
            <span>✦ Re-engage {totalAtRiskCount} Customers</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.08)',
            border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} style={{ color: isLight ? '#059669' : 'var(--brand-primary)' }} />
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Re-engagement Campaign Dispatched Today
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                43 recipients contacted • Status: Awaiting response
              </div>
            </div>
          </div>

          {onViewCampaign && (
            <button
              onClick={onViewCampaign}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              View Campaign
            </button>
          )}
        </div>
      )}

      {/* Customer List / Compact Table */}
      <div
        style={{
          overflowX: 'auto',
          borderRadius: 'var(--radius-md)',
          border: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
          <thead>
            <tr
              style={{
                backgroundColor: isLight ? '#F8FAF9' : 'rgba(255, 255, 255, 0.03)',
                borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
                color: isLight ? '#64748B' : 'var(--text-muted)'
              }}
            >
              <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Customer</th>
              <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Company</th>
              <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Last Activity</th>
              <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Days Inactive</th>
              <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Previous Value</th>
              <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>AI Risk Score</th>
              <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => {
              const isHighRisk = cust.riskLevel === 'HIGH';

              return (
                <tr
                  key={cust.id}
                  style={{
                    borderBottom: isLight ? '1px solid #F1F5F9' : '1px solid var(--border-subtle)',
                    transition: 'background-color 0.15s ease'
                  }}
                  className="table-row-hover"
                >
                  {/* Customer Name & Avatar */}
                  <td style={{ padding: '0.75rem 0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.15)',
                          color: isLight ? '#065F46' : 'var(--brand-primary)',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.25)',
                          flexShrink: 0
                        }}
                      >
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {cust.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {cust.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cust.company}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{cust.industry}</div>
                  </td>

                  {/* Last Activity */}
                  <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                      <span>{cust.daysInactive} days ago</span>
                    </div>
                  </td>

                  {/* Days Inactive */}
                  <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: isHighRisk ? (isLight ? '#DC2626' : '#EF4444') : 'var(--text-primary)' }}>
                    {cust.daysInactive} days
                  </td>

                  {/* Previous Value */}
                  <td style={{ padding: '0.75rem 0.85rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>
                    {formatINR(cust.previousValue)}
                  </td>

                  {/* AI Risk Score Badge */}
                  <td style={{ padding: '0.75rem 0.85rem' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: isHighRisk
                          ? (isLight ? '#FEE2E2' : 'rgba(239, 68, 68, 0.15)')
                          : (isLight ? '#FEF3C7' : 'rgba(245, 158, 11, 0.15)'),
                        color: isHighRisk
                          ? (isLight ? '#DC2626' : '#F87171')
                          : (isLight ? '#D97706' : '#FBBF24'),
                        border: isHighRisk
                          ? (isLight ? '1px solid #FECACA' : '1px solid rgba(239, 68, 68, 0.3)')
                          : (isLight ? '1px solid #FDE68A' : '1px solid rgba(245, 158, 11, 0.3)')
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isHighRisk ? '#EF4444' : '#F59E0B' }} />
                      {cust.riskLevel} RISK {cust.riskScore}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right' }}>
                    <button
                      onClick={() => onReengageSingle(cust)}
                      style={{
                        background: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.12)',
                        border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.3)',
                        color: isLight ? '#065F46' : 'var(--brand-primary)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Mail size={12} />
                      <span>Re-engage</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
