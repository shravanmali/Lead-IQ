import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { User, UserStatus } from '../../types/auth';
import { adminService, CreateUserInput } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Shield, Lock } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUser: User) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'MANAGER' | 'STAFF'>('STAFF');
  const [status, setStatus] = useState<UserStatus>('Active');
  const [title, setTitle] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('LeadIQ@2026');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('STAFF');
    setStatus('Active');
    setTitle('');
    setTemporaryPassword('LeadIQ@2026');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Validation Error', 'Full Name and Email are required.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const input: CreateUserInput = {
        name,
        email,
        role,
        status,
        title: title.trim() || undefined,
        temporaryPassword
      };

      const newUser = await adminService.createUser(input);
      showToast('Account Created', `Successfully created ${role} account for ${name}`, 'success');
      onSuccess(newUser);
      resetForm();
      onClose();
    } catch (err: any) {
      showToast('Creation Failed', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New User Account"
      subtitle="Provision Manager or Staff access credentials"
      maxWidth="540px"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary" disabled={isSubmitting}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? (
              <span>Provisioning...</span>
            ) : (
              <>
                <UserPlus size={15} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Amit Patil"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Corporate Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="amit.patil@leadiq.in"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Assign Role *
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as 'MANAGER' | 'STAFF')}
              style={{ width: '100%' }}
            >
              <option value="STAFF">STAFF (Lead Intelligence & Calls)</option>
              <option value="MANAGER">MANAGER (CRM Analytics & Revenue)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Account Status *
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as UserStatus)}
              style={{ width: '100%' }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Job Title / Position
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={role === 'MANAGER' ? 'Regional Sales Director' : 'Senior Enterprise AE'}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Temporary Password
          </label>
          <input
            type="text"
            value={temporaryPassword}
            onChange={e => setTemporaryPassword(e.target.value)}
            style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </form>
    </Modal>
  );
};
