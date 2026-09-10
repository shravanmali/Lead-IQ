import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { Lead, LeadStatus } from '../../types/lead';
import { useAuth } from '../../context/AuthContext';
import { LeadTable } from '../../components/leads/LeadTable';
import { LeadFilterBar } from '../../components/leads/LeadFilterBar';
import { LoadingState } from '../../components/common/LoadingState';
import { CallStudioModal } from '../../components/call/CallStudioModal';
import { AIProcessingOverlay } from '../../components/call/AIProcessingOverlay';
import { callService, PipelineProgressCallback } from '../../services/callService';
import { useToast } from '../../context/ToastContext';

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
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          My Assigned Leads
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Your dedicated client accounts, active negotiations, and call triggers
        </p>
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
        <div className="card" style={{ padding: '1.25rem' }}>
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
