import React, { useState, useEffect } from 'react';
import { adminService, AdminStats } from '../../services/adminService';
import { User } from '../../types/auth';
import { KPICard } from '../../components/common/KPICard';
import { UserTable } from '../../components/admin/UserTable';
import { CreateUserModal } from '../../components/admin/CreateUserModal';
import { DeleteConfirmationModal } from '../../components/admin/DeleteConfirmationModal';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  UserCheck,
  Shield,
  UserPlus,
  ArrowRight,
  Lock,
  Cpu,
  Key,
  Database,
  Activity,
  CreditCard,
  Settings
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [s, u] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getUsers()
      ]);
      setStats(s);
      setUsers(u);
    } catch (err: any) {
      showToast('Error Loading Data', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await adminService.deleteUser(userToDelete.id);
      showToast('User Deleted', `Account for ${userToDelete.name} has been removed.`, 'success');
      setUserToDelete(null);
      await loadData();
    } catch (err: any) {
      showToast('Delete Failed', err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !stats) {
    return <LoadingState message="Loading System Administrator Workspace..." count={4} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. TOP HEADER BANNER */}
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
              width: '46px',
              height: '46px',
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
            <Shield size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Organization Security & System Administration
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
              Provision accounts, assign permissions, inspect audit logs, and configure LLM & telephony integrations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
          style={{ zIndex: 1, boxShadow: '0 4px 16px rgba(79, 242, 176, 0.35)', fontWeight: 700 }}
        >
          <UserPlus size={16} />
          <span>Provision New User</span>
        </button>
      </div>

      {/* 2. ADMIN METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <KPICard
          title="Active Accounts"
          value={stats.activeUsers}
          trend={{ value: '100%', isPositive: true, label: 'health check' }}
          icon={UserCheck}
          glow
        />
        <KPICard
          title="Managers"
          value={stats.totalManagers}
          subtitle="Supervisors & Ops"
          icon={Shield}
        />
        <KPICard
          title="Sales Staff"
          value={stats.totalStaff}
          subtitle="Account Executives & SDRs"
          icon={Users}
        />
        <KPICard
          title="System Lead Volume"
          value="1,420"
          trend={{ value: '+24%', isPositive: true, label: 'monthly ingress' }}
          icon={Database}
        />
      </div>

      {/* 3. QUICK ADMINISTRATIVE CONTROLS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(79, 242, 176, 0.12)', color: 'var(--brand-primary)' }}>
            <Key size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>API & Integrations</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Whisper STT, Gemini AI, WhatsApp Business API connected</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <Activity size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Audit Logs & Compliance</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SOC2 Type II telemetry & real-time role action logging</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <CreditCard size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Enterprise Billing</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LeadIQ Scale Plan • 25 / 50 Seat licenses active</div>
          </div>
        </div>
      </div>

      {/* 4. USER DIRECTORY TABLE */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              User Directory & Role Permissions
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              Manage credentials, assigned roles, and authentication states
            </p>
          </div>

          <a href="#/admin/users" className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
            <span>Full Directory</span>
            <ArrowRight size={14} />
          </a>
        </div>

        <UserTable
          users={users}
          onDeleteClick={u => setUserToDelete(u)}
        />
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => loadData()}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(userToDelete)}
        user={userToDelete}
        isDeleting={isDeleting}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
