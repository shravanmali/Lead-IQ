import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { Lead, LeadStatus } from '../../types/lead';
import { useAuth } from '../../context/AuthContext';
import { LeadTable } from '../../components/leads/LeadTable';
import { LeadFilterBar } from '../../components/leads/LeadFilterBar';
import { LoadingState } from '../../components/common/LoadingState';
import { CallStudioModal } from '../../components/call/CallStudioModal';
import { AIProcessingOverlay } from '../../components/call/AIProcessingOverlay';
import { callService } from '../../services/callService';
import { useToast } from '../../context/ToastContext';
import { Users, PhoneCall, Sparkles, UserCheck } from 'lucide-react';

export const StaffMyLeadsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Call Studio State
  const [callingLead, setCallingLead] = useState<Lead | null>(null);
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<'transcribing' | 'summarizing' | 'scoring' | 'recommending' | 'saving' | 'complete' | null>(null);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeads({
        assignedStaffId: user?.id,
        status: selectedStatus,
        category: selectedCategory,
        searchQuery
      });
      setLeads(data);
    } catch (err: any) {
      showToast('Error Loading Leads', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [user, selectedStatus, selectedCategory, searchQuery]);

  const handleStartCall = (lead: Lead) => {
    setCallingLead(lead);
    setIsCallingModalOpen(true);
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
        'Call AI Pipeline Completed',
        `Whisper transcript processed. Lead score updated to ${record.resultingScore.score}/100.`,
        'success'
      );
      setPipelineStep(null);
      // Navigate to lead detail page to view generated transcript & recommendations
      window.location.hash = `#/staff/leads/${callingLead.id}`;
    } catch (err: any) {
      showToast('AI Pipeline Error', err.message, 'error');
      setPipelineStep(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(79, 242, 176, 0.12)', border: '1px solid rgba(79, 242, 176, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
              <UserCheck size={18} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              My Assigned Client Accounts
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '2.625rem' }}>
            Direct pipeline of active Indian accounts, live negotiation triggers, and automated Whisper calling
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="glass-card" style={{ padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Assigned to:</span>
            <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>{user?.name || 'Account Executive'}</span>
          </div>
          <div className="glass-card" style={{ padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Active Accounts:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{leads.length}</span>
          </div>
        </div>
      </div>

      <LeadFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {isLoading ? (
        <LoadingState message="Loading your assigned prospects..." count={5} />
      ) : (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <LeadTable
            leads={leads}
            onSelectLead={l => {
              window.location.hash = `#/staff/leads/${l.id}`;
            }}
            onCallLead={l => handleStartCall(l)}
          />
        </div>
      )}

      {/* Interactive Call Studio Modal */}
      <CallStudioModal
        isOpen={isCallingModalOpen}
        lead={callingLead}
        onClose={() => setIsCallingModalOpen(false)}
        onEndCall={handleEndCall}
      />

      {/* Stepped AI Processing Animation Overlay */}
      {pipelineStep && <AIProcessingOverlay currentStep={pipelineStep} />}
    </div>
  );
};
