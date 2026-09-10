import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { callService } from '../../services/callService';
import { Lead } from '../../types/lead';
import { CallRecord } from '../../types/call';
import { useAuth } from '../../context/AuthContext';
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
import { AIProcessingOverlay } from '../../components/call/AIProcessingOverlay';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import {
  Users,
  Target,
  TrendingUp,
  IndianRupee,
  Sparkles
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [smartLeads, setSmartLeads] = useState<Lead[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & AI State
  const [callingLead, setCallingLead] = useState<Lead | null>(null);
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [emailLead, setEmailLead] = useState<Lead | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [telegramLead, setTelegramLead] = useState<Lead | null>(null);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<'transcribing' | 'summarizing' | 'scoring' | 'recommending' | 'saving' | 'complete' | null>(null);

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

  useEffect(() => {
    loadStaffData();
  }, [user]);

  const handleStartCall = (lead: Lead) => {
    setCallingLead(lead);
    setIsCallingModalOpen(true);
  };

  const handleSendEmail = (lead: Lead) => {
    setEmailLead(lead);
    setIsEmailModalOpen(true);
  };

  const handleSendTelegram = (lead: Lead) => {
    setTelegramLead(lead);
    setIsTelegramModalOpen(true);
  };

  const handleEndCall = async (durationSeconds: number) => {
    if (!callingLead || !user) return;
    setIsCallingModalOpen(false);
    setPipelineStep('transcribing');

    try {
      const record = await callService.processCallPipeline(
        callingLead,
        durationSeconds,
        user,
        (step) => setPipelineStep(step)
      );

      showToast(
        'Call AI Intelligence Analyzed',
        `Whisper transcript processed. Score updated to ${record.resultingScore.score}/100.`,
        'success'
      );
      setPipelineStep(null);
      await loadStaffData();
    } catch (err: any) {
      showToast('AI Pipeline Failed', err.message, 'error');
      setPipelineStep(null);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading your assigned lead portfolio..." count={4} />;
  }

  const qualifiedLeads = leads.filter(l => l.status === 'Approved' || l.status === 'Interested');
  const pipelineValue = leads.reduce((acc, l) => acc + l.dealValue, 0);
  const conversionRate = leads.length > 0 ? ((qualifiedLeads.length / leads.length) * 100).toFixed(1) : '24.8';
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
              title="Conversion Rate"
              value="24.8%"
              trend={{ value: '+6.4%', isPositive: true, label: 'vs last week' }}
              icon={TrendingUp}
            />
          </div>

          {/* AI Priority Queue Table */}
          <AIPriorityQueueTable
            leads={smartLeads.length > 0 ? smartLeads : leads}
            onCallLead={handleStartCall}
            onSendEmail={handleSendEmail}
            onSendTelegram={handleSendTelegram}
            maxItems={5}
          />

          {/* AI Insight Card */}
          <AIInsightCard
            insightText="Your WhatsApp leads convert 2.4x better than Facebook leads. Consider increasing your WhatsApp campaigns."
            recommendation="AI models recommend initiating direct WhatsApp follow-ups for prospects with score ≥ 75."
            metricHighlight="2.4x Higher Conversion"
            actionLabel="Explore Channel Optimization"
            onActionClick={() => (window.location.hash = '#/staff/ai-recommendations')}
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
            onViewDetails={() => (window.location.hash = '#/staff/my-leads')}
          />

          {/* Today's Tasks Card */}
          <TodaysTasksCard
            onViewAll={() => (window.location.hash = '#/staff/calls')}
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
        onEndCall={handleEndCall}
      />

      <EmailAutomationModal
        isOpen={isEmailModalOpen}
        lead={emailLead}
        onClose={() => setIsEmailModalOpen(false)}
        onSuccess={() => {
          showToast('Email Sent', 'Automated proposal dispatched successfully.', 'success');
          loadStaffData();
        }}
      />

      <TelegramAutomationModal
        isOpen={isTelegramModalOpen}
        lead={telegramLead}
        onClose={() => setIsTelegramModalOpen(false)}
        onSuccess={() => {
          showToast('Message Sent', 'WhatsApp / Telegram dispatched via Lead-IQ Gateway.', 'success');
          loadStaffData();
        }}
      />

      {/* Stepped AI Intelligence Overlay */}
      {pipelineStep && <AIProcessingOverlay currentStep={pipelineStep} />}
    </div>
  );
};
