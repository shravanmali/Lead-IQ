import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { User, Role } from '../../types/auth';
import { UserTable } from '../../components/admin/UserTable';
import { CreateUserModal } from '../../components/admin/CreateUserModal';
import { DeleteConfirmationModal } from '../../components/admin/DeleteConfirmationModal';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Search, Users, ShieldCheck } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const u = await adminService.getUsers();
      setUsers(u);
    } catch (err: any) {
      showToast('Error Loading Users', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await adminService.deleteUser(userToDelete.id);
      showToast('User Deleted', `Account for ${userToDelete.name} has been removed.`, 'success');
      setUserToDelete(null);
      await loadUsers();
    } catch (err: any) {
      showToast('Delete Failed', err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return <LoadingState message="Loading user directory..." count={5} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(79, 242, 176, 0.12)', border: '1px solid rgba(79, 242, 176, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
              <Users size={18} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              User & Access Directory
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '2.625rem' }}>
            Manage corporate identities, assign RBAC permissions, and provision CRM credentials
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
            <UserPlus size={16} />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Controls & Filter Header */}
      <div
        className="glass-panel"
        style={{
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '260px', maxWidth: '360px', flex: 1 }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              style={{ width: '100%', paddingLeft: '2.25rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {(['All', 'MANAGER', 'STAFF'] as (Role | 'All')[]).map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={roleFilter === r ? 'btn btn-primary btn-sm' : 'btn-secondary btn-sm'}
                style={{ fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
              >
                {r === 'All' ? 'All Roles' : `${r} Accounts`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Showing {filteredUsers.length} of {users.length} accounts
        </div>
      </div>

      {/* User Table Card */}
      <div className="glass-panel" style={{ padding: '0.5rem' }}>
        <UserTable
          users={filteredUsers}
          onDeleteClick={u => setUserToDelete(u)}
        />
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => loadUsers()}
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
