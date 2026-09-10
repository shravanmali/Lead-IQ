import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const DashboardFooter: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <footer
      style={{
        marginTop: '2.5rem',
        paddingTop: '1.25rem',
        paddingBottom: '1.75rem',
        borderTop: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: isLight ? '#94A3B8' : 'var(--text-muted)',
        fontSize: '0.78rem'
      }}
    >
      <div>
        © 2024 LeadIQ. All rights reserved.
      </div>
      <div style={{ fontWeight: 600, color: isLight ? '#64748B' : 'var(--text-secondary)', letterSpacing: '0.02em' }}>
        More Leads. More Revenue.
      </div>
    </footer>
  );
};
