import React from 'react';
import { Role } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { UnauthorizedPage } from '../../pages/auth/UnauthorizedPage';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-app)'
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--border-medium)',
            borderTopColor: 'var(--brand-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Return to login component
    window.location.hash = '#/login';
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return <UnauthorizedPage requiredRoles={allowedRoles} />;
  }

  return <>{children}</>;
};
