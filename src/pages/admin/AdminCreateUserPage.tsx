import React, { useState } from 'react';
import { adminService, CreateUserInput } from '../../services/adminService';
import { UserStatus } from '../../types/auth';
import { useToast } from '../../context/ToastContext';
import { UserPlus, ArrowLeft, Shield, CheckCircle2, KeyRound } from 'lucide-react';

export const AdminCreateUserPage: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'MANAGER' | 'STAFF'>('STAFF');
  const [status, setStatus] = useState<UserStatus>('Active');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('LeadIQ@2026');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Validation Error', 'Full Name and Corporate Email are required.', 'warning');
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
        phone: phone.trim() || undefined,
        temporaryPassword
      };

      await adminService.createUser(input);
      showToast('Account Created', `Successfully created ${role} account for ${name}`, 'success');
      window.location.hash = '#/admin/users';
    } catch (err: any) {
      showToast('Creation Failed', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(79, 242, 176, 0.12)', border: '1px solid rgba(79, 242, 176, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
              <UserPlus size={18} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Provision New Corporate Account
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '2.625rem' }}>
            Configure identity, role authorization, and initial access credentials
          </p>
        </div>
        <a href="#/admin/users" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={14} />
          <span>Back to Directory</span>
        </a>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              Full Legal Name *
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
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Assigned Role *
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as 'MANAGER' | 'STAFF')}
                style={{ width: '100%' }}
              >
                <option value="STAFF">STAFF (Lead Workflows & Calls)</option>
                <option value="MANAGER">MANAGER (Revenue & Full CRM)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Job Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={role === 'MANAGER' ? 'Regional Sales Manager' : 'Enterprise SDR'}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              Temporary Provisioning Password
            </label>
            <input
              type="text"
              value={temporaryPassword}
              onChange={e => setTemporaryPassword(e.target.value)}
              style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <a href="#/admin/users" className="btn btn-secondary">
              Cancel
            </a>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0.625rem 1.5rem' }}>
              {isSubmitting ? (
                <span>Provisioning Account...</span>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Provision Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
