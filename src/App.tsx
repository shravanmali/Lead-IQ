import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCreateUserPage } from './pages/admin/AdminCreateUserPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Manager Pages
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { ManagerLeadsPage } from './pages/manager/ManagerLeadsPage';
import { ManagerSmartLeadsPage } from './pages/manager/ManagerSmartLeadsPage';
import { ManagerRevenuePage } from './pages/manager/ManagerRevenuePage';
import { ManagerAIPredictionPage } from './pages/manager/ManagerAIPredictionPage';
import { ManagerStaffPage } from './pages/manager/ManagerStaffPage';
import { ManagerAIChatbotPage } from './pages/manager/ManagerAIChatbotPage';
import { ManagerSettingsPage } from './pages/manager/ManagerSettingsPage';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffMyLeadsPage } from './pages/staff/StaffMyLeadsPage';
import { StaffSmartLeadsPage } from './pages/staff/StaffSmartLeadsPage';
import { StaffLeadDetailPage } from './pages/staff/StaffLeadDetailPage';
import { StaffCallRecordsPage } from './pages/staff/StaffCallRecordsPage';
import { StaffAIRecommendationsPage } from './pages/staff/StaffAIRecommendationsPage';
import { StaffAIChatbotPage } from './pages/staff/StaffAIChatbotPage';
import { StaffSettingsPage } from './pages/staff/StaffSettingsPage';

// Common / Integrations Hub
import { IntegrationsPage } from './pages/common/IntegrationsPage';

const Router: React.FC = () => {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/login');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/login');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle Root Redirect
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && currentHash !== '#/login') {
        window.location.hash = '#/login';
      } else if (isAuthenticated && (currentHash === '#/login' || currentHash === '' || currentHash === '#/' || currentHash === '#')) {
        if (role === 'ADMIN') window.location.hash = '#/admin/dashboard';
        else if (role === 'MANAGER') window.location.hash = '#/manager/dashboard';
        else if (role === 'STAFF') window.location.hash = '#/staff/dashboard';
      }
    }
  }, [isAuthenticated, role, isLoading, currentHash]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid var(--border-medium)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 1. Unauthenticated Login Route
  if (currentHash.startsWith('#/login') || !isAuthenticated) {
    return <LoginPage />;
  }

  // 2. Unauthorized Route
  if (currentHash.startsWith('#/unauthorized')) {
    return <UnauthorizedPage />;
  }

  // =========================================================================
  // ADMIN ROUTES (Scoped strictly to Account Provisioning)
  // =========================================================================
  if (currentHash.startsWith('#/admin/dashboard')) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AppShell currentPath={currentHash} pageTitle="System Admin Overview" pageSubtitle="Account Provisioning & Identity Operations">
          <AdminDashboard />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/admin/users')) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AppShell currentPath={currentHash} pageTitle="User Directory & Access Control" pageSubtitle="Manage active Manager and Staff permissions">
          <AdminUsersPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/admin/create-user')) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AppShell currentPath={currentHash} pageTitle="Provision Account" pageSubtitle="Issue corporate credentials">
          <AdminCreateUserPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/admin/settings')) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AppShell currentPath={currentHash} pageTitle="System Settings" pageSubtitle="Security, session rules, and audit logging">
          <AdminSettingsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/admin/integrations')) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AppShell currentPath={currentHash} pageTitle="System Integrations & API Gateways" pageSubtitle="Whisper, Telegram, WhatsApp, and Cloud infrastructure">
          <IntegrationsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  // =========================================================================
  // MANAGER ROUTES (Full CRM + Revenue + Forecasting + Manager Chatbot)
  // =========================================================================
  if (currentHash.startsWith('#/manager/dashboard')) {
    return (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <AppShell currentPath={currentHash} pageTitle="Sales & Revenue Operations" pageSubtitle="Real-time pipeline metrics and quarterly targets">
          <ManagerDashboard />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/manager/leads')) {
    return (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <AppShell currentPath={currentHash} pageTitle="All Company Leads" pageSubtitle="Full enterprise portfolio & account executive assignments">
          <ManagerLeadsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/manager/smart-leads')) {
    return (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <AppShell currentPath={currentHash} pageTitle="Smart Leads Prioritization" pageSubtitle="Ranked in descending order by AI Predictive Score">
          <ManagerSmartLeadsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/manager/revenue')) {
    return (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <AppShell currentPath={currentHash} pageTitle="Revenue Analytics" pageSubtitle="Monthly financials, closed deals, and staff contributions">
          <ManagerRevenuePage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/manager/ai-revenue-prediction')) {
    return (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <AppShell currentPath={currentHash} pageTitle="AI Revenue Prediction (+90 Days)" pageSubtitle="Neural Bayesian growth forecasting and deal probability models">
          <ManagerAIPredictionPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/manager/staff')) {
    return (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <AppShell currentPath={currentHash} pageTitle="Sales Staff Performance" pageSubtitle="Individual closing velocity and conversion quotas">
          <ManagerStaffPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/manager/ai-chatbot')) {
    return (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <AppShell currentPath={currentHash} pageTitle="Manager AI Chatbot" pageSubtitle="Full CRM intelligence assistant for executive queries">
          <ManagerAIChatbotPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/manager/integrations')) {
    return (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <AppShell currentPath={currentHash} pageTitle="Enterprise Integrations Hub" pageSubtitle="Whisper, Telegram, WhatsApp, and Cloud infrastructure">
          <IntegrationsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/manager/settings')) {
    return (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <AppShell currentPath={currentHash} pageTitle="CRM Preferences" pageSubtitle="Quotas, thresholds, and auto-reassignment rules">
          <ManagerSettingsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  // =========================================================================
  // STAFF ROUTES (Assigned Leads + Whisper Call Studio + Scoring + Automations)
  // =========================================================================
  if (currentHash.startsWith('#/staff/dashboard')) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <AppShell currentPath={currentHash} pageTitle="Staff Lead Workspace" pageSubtitle="Your assigned opportunities and priority call queue">
          <StaffDashboard />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/staff/my-leads')) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <AppShell currentPath={currentHash} pageTitle="My Assigned Leads" pageSubtitle="Direct pipeline management and active communications">
          <StaffMyLeadsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/staff/smart-leads')) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <AppShell currentPath={currentHash} pageTitle="Smart Leads (AI Priority Order)" pageSubtitle="Sorted strictly in descending order by AI Lead Score">
          <StaffSmartLeadsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/staff/leads/')) {
    const leadId = currentHash.replace('#/staff/leads/', '').split('?')[0];
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <AppShell currentPath={currentHash} pageTitle="Lead Profile & Call Studio" pageSubtitle="Whisper audio, transcript intelligence, and automated dispatch">
          <StaffLeadDetailPage leadId={leadId} />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/staff/calls')) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <AppShell currentPath={currentHash} pageTitle="Call Recordings & Transcripts" pageSubtitle="Complete archive of recorded calls and AI key takeaways">
          <StaffCallRecordsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/staff/ai-recommendations')) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <AppShell currentPath={currentHash} pageTitle="AI Recommended Next Steps" pageSubtitle="Automated proposals and Telegram follow-up queue">
          <StaffAIRecommendationsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/staff/ai-chatbot')) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <AppShell currentPath={currentHash} pageTitle="Staff AI Assistant" pageSubtitle="Lead prioritization and conversation analysis">
          <StaffAIChatbotPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/staff/integrations')) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <AppShell currentPath={currentHash} pageTitle="AI & Communication Integrations" pageSubtitle="Whisper Audio, Telegram Bot, WhatsApp API, and Cloud Infrastructure">
          <IntegrationsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (currentHash.startsWith('#/staff/settings')) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <AppShell currentPath={currentHash} pageTitle="Staff Preferences" pageSubtitle="Audio codecs and auto-draft settings">
          <StaffSettingsPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  // Default fallback to login
  return <LoginPage />;
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
