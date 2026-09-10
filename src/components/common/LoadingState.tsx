import React from 'react';

export const LoadingState: React.FC<{ message?: string; count?: number }> = ({
  message = 'Loading CRM records...',
  count = 3
}) => {
  return (
    <div style={{ padding: '1.5rem', width: '100%' }}>
      {message && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '18px',
              height: '18px',
              border: '2px solid var(--border-medium)',
              borderTopColor: 'var(--brand-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{message}</span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: '56px', width: '100%', borderRadius: 'var(--radius-md)' }}
          />
        ))}
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
