import React, { useState, useEffect } from 'react';
import { revenueService, ManagerKPIs } from '../../services/revenueService';
import { leadService } from '../../services/leadService';
import { Lead } from '../../types/lead';
import { RevenueDataPoint, StaffRevenueMetric, SourceRevenueMetric } from '../../types/revenue';
import { KPICard } from '../../components/common/KPICard';
import { GreetingSection } from '../../components/common/GreetingSection';
import { AIPriorityQueueTable } from '../../components/leads/AIPriorityQueueTable';
import { ConversionTrendCard } from '../../components/charts/ConversionTrendCard';
import { LeadSourcesDonutCard } from '../../components/charts/LeadSourcesDonutCard';
import { TodaysTasksCard } from '../../components/tasks/TodaysTasksCard';
import { AIInsightCard } from '../../components/common/AIInsightCard';
import { TimeSavedCard } from '../../components/common/TimeSavedCard';
import { DashboardFooter } from '../../components/common/DashboardFooter';
import { CallStudioModal } from '../../components/call/CallStudioModal';
import { EmailAutomationModal } from '../../components/automation/EmailAutomationModal';
import { TelegramAutomationModal } from '../../components/automation/TelegramAutomationModal';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatters';
import {
  IndianRupee,
  TrendingUp,
  Users,
  Target,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [kpis, setKpis] = useState<ManagerKPIs | null>(null);
  const [timeline, setTimeline] = useState<RevenueDataPoint[]>([]);
  const [staffMetrics, setStaffMetrics] = useState<StaffRevenueMetric[]>([]);
  const [sourceMetrics, setSourceMetrics] = useState<SourceRevenueMetric[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals State
  const [callingLead, setCallingLead] = useState<Lead | null>(null);
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [emailLead, setEmailLead] = useState<Lead | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [telegramLead, setTelegramLead] = useState<Lead | null>(null);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

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
    return <LoadingState message="Loading Manager Executive Intelligence..." count={4} />;
  }

  const sortedSmartLeads = [...leads].sort((a, b) => b.score.score - a.score.score);
  const firstName = user?.name?.split(' ')[0] || 'Alex';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* 1. GREETING SECTION */}
      <GreetingSection
        userName={firstName}
        subtitle="Here's what needs your attention today."
        quote="Focus on the right leads, let AI do the rest."
      />

      {/* 2. MASTER 2-COLUMN DASHBOARD GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.85fr) minmax(320px, 1fr)',
          gap: '1.5rem',
          alignItems: 'start'
        }}
      >
        {/* ======================================================== */}
        {/* LEFT COLUMN: KPI Cards + AI Priority Queue + AI Insight  */}
        {/* ======================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          {/* KPI Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <KPICard
              title="Total Leads"
              value="1,284"
              trend={{ value: '+12%', isPositive: true, label: 'vs last week' }}
              icon={Users}
            />
            <KPICard
              title="Qualified Leads"
              value="342"
              trend={{ value: '+18%', isPositive: true, label: 'vs last week' }}
              icon={Target}
              glow
            />
            <KPICard
              title="Pipeline Value"
              value="₹38.7L"
              trend={{ value: '+22%', isPositive: true, label: 'vs last week' }}
              icon={IndianRupee}
            />
            <KPICard
              title="Conversion Rate"
              value="24.8%"
              trend={{ value: '+6.4%', isPositive: true, label: 'vs last week' }}
              icon={TrendingUp}
            />
          </div>

          {/* AI Priority Queue Table */}
          <AIPriorityQueueTable
            leads={sortedSmartLeads}
            onCallLead={(lead) => {
              setCallingLead(lead);
              setIsCallingModalOpen(true);
            }}
            onSendEmail={(lead) => {
              setEmailLead(lead);
              setIsEmailModalOpen(true);
            }}
            onSendTelegram={(lead) => {
              setTelegramLead(lead);
              setIsTelegramModalOpen(true);
            }}
            maxItems={5}
          />

          {/* AI Insight Card */}
          <AIInsightCard
            insightText="Your WhatsApp leads convert 2.4x better than Facebook leads. Consider increasing your WhatsApp campaigns."
            recommendation="AI projections show allocating +₹50,000 to WhatsApp campaigns will yield +₹3,20,000 in closed pipeline ARR."
            metricHighlight="2.4x Higher Conversion"
            actionLabel="View 90-Day AI Revenue Prediction"
            onActionClick={() => (window.location.hash = '#/manager/ai-revenue-prediction')}
          />
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Conversion Trend + Sources + Tasks + Time  */}
        {/* ======================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          {/* Conversion Trend Area Chart */}
          <ConversionTrendCard
            currentRate="24.8%"
            timeframe="Last 30 days"
          />

          {/* Lead Sources Donut Card */}
          <LeadSourcesDonutCard
            totalLeads={1284}
            onViewDetails={() => (window.location.hash = '#/manager/leads')}
          />

          {/* Today's Tasks Card */}
          <TodaysTasksCard
            onViewAll={() => (window.location.hash = '#/manager/staff')}
          />

          {/* Time Saved Card */}
          <TimeSavedCard
            hoursSaved="18.5 hrs"
            timeframe="Estimated this week"
            percentageChange="+23%"
            automationCount={142}
          />
        </div>
      </div>

      {/* 3. DASHBOARD FOOTER */}
      <DashboardFooter />

      {/* ======================================================== */}
      {/* INTERACTIVE CALL & AUTOMATION MODALS                     */}
      {/* ======================================================== */}
      <CallStudioModal
        isOpen={isCallingModalOpen}
        lead={callingLead}
        onClose={() => setIsCallingModalOpen(false)}
        onEndCall={() => {
          setIsCallingModalOpen(false);
          showToast('Call Session Saved', 'Executive interaction logged in CRM.', 'success');
        }}
      />

      <EmailAutomationModal
        isOpen={isEmailModalOpen}
        lead={emailLead}
        onClose={() => setIsEmailModalOpen(false)}
        onSuccess={() => {
          showToast('Proposal Dispatched', 'Executive commercial proposal dispatched.', 'success');
        }}
      />

      <TelegramAutomationModal
        isOpen={isTelegramModalOpen}
        lead={telegramLead}
        onClose={() => setIsTelegramModalOpen(false)}
        onSuccess={() => {
          showToast('Telegram Sent', 'Manager direct update delivered via bot gateway.', 'success');
        }}
      />
    </div>
  );
};
