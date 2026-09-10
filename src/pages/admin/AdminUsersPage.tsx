import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { User, Role } from '../../types/auth';
import { UserTable } from '../../components/admin/UserTable';
import { CreateUserModal } from '../../components/admin/CreateUserModal';
import { DeleteConfirmationModal } from '../../components/admin/DeleteConfirmationModal';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Search, Filter } from 'lucide-react';

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
      {/* Controls & Filter Header */}
      <div
        style={{
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
              placeholder="Search by name or email..."
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

        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
          <UserPlus size={16} />
          <span>Create User</span>
        </button>
      </div>

      {/* User Table Card */}
      <div className="card">
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
