import React, { useState } from 'react';
import { Modal } from './Modal';
import { Lead, LeadStatus } from '../../types/lead';
import { LeadStatusBadge } from './LeadStatusBadge';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { leadService } from '../../services/leadService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface StatusAuditModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSuccess: (updatedLead: Lead) => void;
}

const ALL_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Interested',
  'Approved',
  'Declined',
  'Hold',
  'Converted'
];

export const StatusAuditModal: React.FC<StatusAuditModalProps> = ({
  isOpen,
  lead,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [targetStatus, setTargetStatus] = useState<LeadStatus>(lead?.status || 'Interested');
  const [reason, setReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (lead) {
      setTargetStatus(lead.status);
      setReason('');
    }
  }, [lead]);

  if (!lead) return null;

  const handleUpdate = async () => {
    if (targetStatus === lead.status) {
      onClose();
      return;
    }

    setIsUpdating(true);
    try {
      const updated = await leadService.updateLeadStatus({
        leadId: lead.id,
        previousStatus: lead.status,
        newStatus: targetStatus,
        reason: reason.trim() || undefined,
        updatedBy: user?.name || 'Authorized Staff'
      });

      showToast(
        'Lead Status Updated',
        `Changed from ${lead.status} to ${targetStatus}`,
        'success'
      );
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      showToast('Update Failed', err.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Lead Status"
      subtitle={`Audit Record for ${lead.name} (${lead.company})`}
      maxWidth="500px"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleUpdate} disabled={isUpdating} className="btn btn-primary">
            {isUpdating ? 'Recording Change...' : 'Confirm Status Change'}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Status Transition Comparison */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>CURRENT</div>
            <LeadStatusBadge status={lead.status} />
          </div>

          <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>NEW STATUS</div>
            <LeadStatusBadge status={targetStatus} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Select New Status
          </label>
          <select
            value={targetStatus}
            onChange={e => setTargetStatus(e.target.value as LeadStatus)}
            style={{ width: '100%' }}
          >
            {ALL_STATUSES.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Audit Reason / Notes (Optional)
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="e.g. Budget signed, awaiting security approval..."
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>
      </div>
    </Modal>
  );
};
