import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { FloatingAIChatbot } from '../chat/FloatingAIChatbot';

interface AppShellProps {
  currentPath: string;
  pageTitle: string;
  pageSubtitle?: string;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPath,
  pageTitle,
  pageSubtitle,
  children
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Workspace */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden'
        }}
      >
        <Topbar pageTitle={pageTitle} pageSubtitle={pageSubtitle} />

        <main
          style={{
            flex: 1,
            padding: '2rem',
            maxWidth: '1480px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
        >
          {children}
        </main>
      </div>

      {/* Persistent Global Floating AI Chatbot for Manager & Staff */}
      <FloatingAIChatbot />
    </div>
  );
};
