import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        color: 'var(--text-primary)',
        transition: 'all var(--transition-fast)'
      }}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-amber-400" style={{ color: '#fbbf24' }} />
      ) : (
        <Moon size={18} className="text-indigo-500" style={{ color: '#6366f1' }} />
      )}
    </button>
  );
};
