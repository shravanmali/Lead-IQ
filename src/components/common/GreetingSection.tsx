import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface GreetingSectionProps {
  userName?: string;
  subtitle?: string;
  quote?: string;
  motivationalQuote?: string;
}

export const GreetingSection: React.FC<GreetingSectionProps> = ({
  userName = 'Alex',
  subtitle = "Here's what needs your attention today.",
  quote,
  motivationalQuote = 'Focus on the right leads,\nlet AI do the rest.'
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const firstName = userName.split(' ')[0] || 'Alex';
  const displayQuote = quote || motivationalQuote;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '0.5rem',
        paddingTop: '0.25rem'
      }}
    >
      <div>
        {/* Small uppercase label */}
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: isLight ? '#10B981' : 'var(--brand-primary)',
            marginBottom: '0.45rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary)',
              boxShadow: isLight ? '0 0 6px rgba(16, 185, 129, 0.6)' : '0 0 8px var(--brand-primary)'
            }}
          />
          <span>D A S H B O A R D</span>
        </div>

        {/* Main Heading */}
        <h2
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.035em',
            lineHeight: 1.15
          }}
        >
          Good morning, {firstName} <span style={{ display: 'inline-block' }}>👋</span>
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '0.925rem',
            color: isLight ? '#64748B' : 'var(--text-secondary)',
            margin: '0.35rem 0 0',
            fontWeight: 400
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Right Side Motivational Quote */}
      <div
        style={{
          textAlign: 'right',
          maxWidth: '320px'
        }}
      >
        <p
          style={{
            fontSize: '0.8125rem',
            color: isLight ? '#94A3B8' : 'var(--text-muted)',
            lineHeight: 1.45,
            margin: 0,
            fontStyle: 'italic',
            whiteSpace: 'pre-line'
          }}
        >
          "{displayQuote}"
        </p>
      </div>
    </div>
  );
};
