import React, { useState, useEffect } from 'react';
import { adminService, AdminStats } from '../../services/adminService';
import { User } from '../../types/auth';
import { KPICard } from '../../components/common/KPICard';
import { UserTable } from '../../components/admin/UserTable';
import { CreateUserModal } from '../../components/admin/CreateUserModal';
import { DeleteConfirmationModal } from '../../components/admin/DeleteConfirmationModal';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import { Users, UserCheck, Shield, UserPlus, ArrowRight, Lock } from 'lucide-react';

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
      {/* Top Banner explaining Admin Scope */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-medium)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              System Account Provisioning & Security
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Admin workspace is scoped strictly to Manager & Staff identity management. Confidential CRM data and revenue analytics are isolated.
            </p>
          </div>
        </div>

        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
          <UserPlus size={16} />
          <span>Provision New User</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <KPICard
          title="Total Managers"
          value={stats.totalManagers}
          subtitle="Revenue & CRM Ops Supervisors"
          icon={Shield}
        />
        <KPICard
          title="Total Staff"
          value={stats.totalStaff}
          subtitle="Account Executives & SDRs"
          icon={Users}
        />
        <KPICard
          title="Active Accounts"
          value={stats.activeUsers}
          subtitle="Authenticated Users"
          icon={UserCheck}
          glow
        />
        <KPICard
          title="Total Provisioned"
          value={users.length}
          subtitle="Total accounts in database"
          icon={Users}
        />
      </div>

      {/* Recently Created Accounts Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              User Directory & Permissions
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Manage accounts, roles, and status for Manager and Staff personnel
            </p>
          </div>

          <a href="#/admin/users" className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--brand-primary)' }}>
            <span>View Full Directory</span>
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
