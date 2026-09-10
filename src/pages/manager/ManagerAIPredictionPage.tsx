import React, { useState, useEffect } from 'react';
import { revenueService } from '../../services/revenueService';
import { RevenuePredictionPoint, RevenuePredictionSummary } from '../../types/revenue';
import { PredictionChart } from '../../components/charts/PredictionChart';
import { KPICard } from '../../components/common/KPICard';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import {
  Sparkles,
  TrendingUp,
  Brain,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Zap
} from 'lucide-react';

export const ManagerAIPredictionPage: React.FC = () => {
  const { showToast } = useToast();
  const [points, setPoints] = useState<RevenuePredictionPoint[]>([]);
  const [summary, setSummary] = useState<RevenuePredictionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrediction = async () => {
      setIsLoading(true);
      try {
        const res = await revenueService.getRevenuePrediction();
        setPoints(res.points);
        setSummary(res.summary);
      } catch (err: any) {
        showToast('Prediction API Error', err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadPrediction();
  }, []);

  if (isLoading || !summary) {
    return <LoadingState message="Running Bayesian Neural Revenue Projection Model..." count={4} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(79, 242, 176, 0.2) 0%, rgba(32, 201, 151, 0.1) 100%)',
              border: '2px solid rgba(79, 242, 176, 0.4)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(79, 242, 176, 0.2)'
            }}
          >
            <Brain size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                AI Revenue Forecasting & Predictive Intelligence
              </h2>
              <span className="badge" style={{ backgroundColor: 'rgba(79, 242, 176, 0.12)', color: 'var(--brand-primary)', fontSize: '0.7rem' }}>
                Active Neural Model
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Continuous multi-factor revenue projection modeled from call transcripts, lead score momentum, and historical closing velocity.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--brand-primary)', fontWeight: 700, zIndex: 1 }}>
          <Cpu size={16} />
          <span>Model Accuracy: {summary.confidencePercent}%</span>
        </div>
      </div>

      {/* 4 CORE PREDICTION METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
        <KPICard
          title="Predicted 90-Day Revenue"
          value={formatINR(summary.predictedTotal)}
          trend={{ value: `+${summary.expectedGrowthPercent}%`, isPositive: true, label: 'projected growth' }}
          icon={TrendingUp}
          glow
        />
        <KPICard
          title="Current Base Revenue"
          value={formatINR(summary.currentTotal)}
          subtitle="September 2026 MTD"
          icon={ShieldCheck}
        />
        <KPICard
          title="Revenue Expansion"
          value={`+${formatINR(summary.predictedTotal - summary.currentTotal)}`}
          subtitle={`+${summary.expectedGrowthPercent}% over 90 days`}
          icon={Sparkles}
        />
        <KPICard
          title="Prediction Confidence Score"
          value={`${summary.confidencePercent}%`}
          subtitle="95% Confidence Interval Band"
          icon={Brain}
        />
      </div>

      {/* LARGE AI PREDICTION TIMELINE CHART */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.875rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              AI Predictive Revenue Curve (+7, +30, +60, +90 Days)
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              Continuous Bayesian timeline showing historical baseline and projected pipeline realization
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#60736C' }} />
              <span>Historical Actual</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }} />
              <span>AI Predicted Trajectory</span>
            </div>
          </div>
        </div>

        <PredictionChart data={points} height={340} />
      </div>

      {/* AI FORECAST INSIGHT CARD & GROWTH DRIVERS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {/* AI Forecast Insight */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Sparkles size={18} style={{ color: 'var(--brand-primary)' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              AI Executive Forecast Insight
            </h4>
          </div>

          <blockquote
            className="glass-card"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--brand-primary)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              margin: 0
            }}
          >
            "{summary.forecastInsight}"
          </blockquote>

          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={15} />
              <span>Primary Growth Catalysts Identified:</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0 }}>
              {summary.growthDrivers.map((driver, i) => (
                <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {driver}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Risk Factors & Recommendations */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <AlertTriangle size={18} style={{ color: '#eab308' }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Model Risk Factors & Watchlist
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {summary.risks.map((risk, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    Risk Factor #{i + 1}
                  </div>
                  {risk}
                </div>
              ))}
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(79, 242, 176, 0.2)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)'
            }}
          >
            <strong style={{ color: 'var(--brand-primary)' }}>Manager Action Item:</strong> Instruct Staff to follow up with Rahul Sharma (Shree Enterprises) and Priya Deshmukh (Maharashtra Business Solutions) to lock in ₹7,25,000 in early Q4 commits.
          </div>
        </div>
      </div>
    </div>
  );
};
