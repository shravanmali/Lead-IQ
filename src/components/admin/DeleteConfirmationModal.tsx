import React from 'react';
import { Modal } from '../common/Modal';
import { User } from '../../types/auth';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
  isDeleting
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Account Deletion"
      subtitle="This action is irreversible and removes user permissions"
      maxWidth="480px"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary" disabled={isDeleting}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="btn btn-danger">
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 size={15} />
                <span>Delete Account</span>
              </>
            )}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center', padding: '0.5rem 0' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Are you sure you want to permanently delete the account for:
          </p>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              display: 'inline-block',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600, marginTop: '2px' }}>
              Role: {user.role}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
