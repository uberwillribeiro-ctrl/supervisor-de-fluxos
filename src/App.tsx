import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Users, FileText } from 'lucide-react';

import { AuthProvider } from '@/components/layout/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { type PageId } from '@/components/layout/Sidebar';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Divider } from '@/components/ui/Divider';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';

import { type UserProfile, UserRole } from '@/types/user';
import { CaseStatus } from '@/types/case';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Onboarding from '@/pages/Onboarding';

// ─── Usuário fake para o AppShell ─────────────────────────────────────────────

const MOCK_USER: UserProfile = {
  id: '1',
  name: 'Willian Ribeiro',
  email: 'admin@creas.gov.br',
  role: UserRole.ADMIN,
  unit: 'CREAS Centro',
  createdAt: '2024-01-15T00:00:00Z',
};

// ─── Labels de status ─────────────────────────────────────────────────────────

const STATUS_LABELS: Record<CaseStatus, string> = {
  [CaseStatus.NEW]: 'Novo',
  [CaseStatus.ACTIVE]: 'Ativo',
  [CaseStatus.ARCHIVED]: 'Arquivado',
};

const STATUS_VARIANTS: Record<CaseStatus, 'novo' | 'ativo' | 'arquivado'> = {
  [CaseStatus.NEW]: 'novo',
  [CaseStatus.ACTIVE]: 'ativo',
  [CaseStatus.ARCHIVED]: 'arquivado',
};

// ─── Showcase do Design System ────────────────────────────────────────────────

function ComponentsShowcase() {
  const { success, error, info } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Design System</h2>
        <p className="mt-1 text-sm text-slate-500">
          Biblioteca de componentes reutilizáveis — M1 · feat/design-system
        </p>
      </div>

      <section className="space-y-4">
        <Divider label="Button" />
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" loading>
            Carregando
          </Button>
          <Button variant="primary" disabled>
            Desabilitado
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <Divider label="Badge" />
        <div className="flex flex-wrap gap-2">
          {Object.values(CaseStatus).map((status) => (
            <Badge key={status} variant={STATUS_VARIANTS[status]}>
              {STATUS_LABELS[status]}
            </Badge>
          ))}
          <Badge variant="neutro">Neutro</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <Divider label="Input / Select" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <Input
            label="Nome completo"
            placeholder="ex: Maria da Silva"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input label="CPF (erro)" placeholder="000.000.000-00" error="CPF inválido" />
          <Input label="Desabilitado" placeholder="Não editável" disabled />
          <Select
            label="Serviço"
            placeholder="Selecione..."
            options={[
              { value: 'paefi', label: 'PAEFI' },
              { value: 'sev', label: 'SEV' },
            ]}
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <Divider label="Toast" />
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={() => success('Caso salvo com sucesso!')}>
            Toast success
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => error('Erro ao salvar. Tente novamente.')}
          >
            Toast error
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => info('Funcionalidade disponível em breve.')}
          >
            Toast info
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <Divider label="Modal" />
        <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>
          Abrir Modal
        </Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Caso" size="md">
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Formulário de cadastro de caso — aparecerá aqui no M4.
            </p>
            <Input label="Nome do beneficiário" placeholder="Nome completo" />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setModalOpen(false);
                  success('Caso criado!');
                }}
              >
                Salvar
              </Button>
            </div>
          </div>
        </Modal>
      </section>

      <section className="space-y-4">
        <Divider label="Spinner / EmptyState" />
        <div className="flex items-center gap-6">
          <Spinner size="sm" className="text-indigo-400" />
          <Spinner size="md" className="text-indigo-400" />
          <Spinner size="lg" className="text-indigo-400" />
        </div>
        <div className="rounded-xl bg-slate-900 ring-1 ring-slate-800">
          <EmptyState
            icon={Users}
            title="Nenhum caso encontrado"
            description='Clique em "Novo Caso" para começar a cadastrar.'
            action={{ label: 'Novo Caso', onClick: () => info('Disponível no M4!') }}
          />
        </div>
      </section>
    </div>
  );
}

// ─── Placeholder de páginas futuras ──────────────────────────────────────────

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4">
      <div className="flex items-center justify-center size-16 rounded-2xl bg-slate-800 ring-1 ring-slate-700">
        <FileText className="size-7 text-slate-500" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-200">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <Badge variant="neutro">Em desenvolvimento</Badge>
    </div>
  );
}

// ─── Conteúdo por página ──────────────────────────────────────────────────────

function PageContent({ page }: { page: PageId }) {
  switch (page) {
    case 'dashboard':
      return <ComponentsShowcase />;
    case 'cases':
      return (
        <PlaceholderPage
          title="Gestão de Casos"
          description="Disponível no Milestone 4 — feat/cases-ui"
        />
      );
    case 'procedures':
      return (
        <PlaceholderPage
          title="Registro de Procedimentos"
          description="Disponível no Milestone 5 — feat/procedures-ui"
        />
      );
    case 'reports':
      return (
        <PlaceholderPage
          title="Relatórios, RMA & Observatório"
          description="Disponível no Milestone 6 — feat/reports-ui"
        />
      );
    case 'admin':
      return (
        <PlaceholderPage
          title="Painel Administrativo"
          description="Disponível no Milestone 12 — feat/admin"
        />
      );
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
