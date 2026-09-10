import React from 'react';
import { User } from '../../types/auth';
import { Trash2, Shield, UserCheck, UserX } from 'lucide-react';

interface UserTableProps {
  users: User[];
  onDeleteClick: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onDeleteClick }) => {
  return (
    <div className="table-container">
      <table className="table-custom">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created Date</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const isProtectedAdmin = u.role === 'ADMIN';

            return (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={u.name}
                      style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-medium)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.title || u.role}</div>
                    </div>
                  </div>
                </td>

                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{u.email}</td>

                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        u.role === 'ADMIN'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : u.role === 'MANAGER'
                          ? 'rgba(139, 92, 246, 0.15)'
                          : 'rgba(79, 242, 176, 0.15)',
                      color:
                        u.role === 'ADMIN'
                          ? '#f87171'
                          : u.role === 'MANAGER'
                          ? '#c084fc'
                          : '#4ff2b0',
                      border:
                        u.role === 'ADMIN'
                          ? '1px solid rgba(239, 68, 68, 0.3)'
                          : u.role === 'MANAGER'
                          ? '1px solid rgba(139, 92, 246, 0.3)'
                          : '1px solid rgba(79, 242, 176, 0.3)'
                    }}
                  >
                    {u.role}
                  </span>
                </td>

                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        u.status === 'Active'
                          ? 'var(--success-bg)'
                          : u.status === 'Suspended'
                          ? 'var(--status-hot-bg)'
                          : 'var(--status-cold-bg)',
                      color:
                        u.status === 'Active'
                          ? 'var(--success-text)'
                          : u.status === 'Suspended'
                          ? 'var(--status-hot-text)'
                          : 'var(--status-cold-text)'
                    }}
                  >
                    {u.status}
                  </span>
                </td>

                <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(u.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>

                <td style={{ textAlign: 'right' }}>
                  {isProtectedAdmin ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      System Protected
                    </span>
                  ) : (
                    <button
                      onClick={() => onDeleteClick(u)}
                      className="btn-danger btn-sm"
                      title="Delete user account"
                      style={{ padding: '0.35rem 0.65rem' }}
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
