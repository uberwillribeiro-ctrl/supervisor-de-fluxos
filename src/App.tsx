import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from '@/components/layout/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/ui/Toast';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { type PageId } from '@/components/layout/Sidebar';

import { type UserProfile, UserRole } from '@/types/user';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import CasosNovos from '@/pages/CasosNovos';
import CasosAtivos from '@/pages/CasosAtivos';
import Procedimentos from '@/pages/Procedimentos';
import Arquivados from '@/pages/Arquivados';

// ─── Usuário fake para o AppShell ─────────────────────────────────────────────

const MOCK_USER: UserProfile = {
  id: '1',
  name: 'Willian Ribeiro',
  email: 'admin@creas.gov.br',
  role: UserRole.ADMIN,
  unit: 'CREAS Centro',
  createdAt: '2024-01-15T00:00:00Z',
};

// ─── Conteúdo por página ──────────────────────────────────────────────────────

function PageContent({ page }: { page: PageId }) {
  switch (page) {
    case 'dashboard':
      return <Dashboard />;
    case 'casos-novos':
      return <CasosNovos />;
    case 'casos-ativos':
      return <CasosAtivos />;
    case 'procedimentos':
      return <Procedimentos />;
    case 'arquivados':
      return <Arquivados />;
  }
}

// ─── Shell do app (rota /app) ─────────────────────────────────────────────────

function AppInner() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState<PageId>('dashboard');

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage} currentUser={user ?? MOCK_USER}>
      <PageContent page={activePage} />
    </AppShell>
  );
}

function AppPage() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <AppPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
