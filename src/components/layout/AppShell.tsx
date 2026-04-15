import { useState, type ReactNode } from 'react';
import { Sidebar, getPageLabel, type PageId } from './Sidebar';
import { Header } from './Header';
import { PageWrapper } from './PageWrapper';
import { type UserProfile } from '@/types/user';

interface AppShellProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  currentUser: UserProfile;
  children: ReactNode;
}

export function AppShell({ activePage, onNavigate, currentUser, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        currentUser={currentUser}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Área de conteúdo */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
        <Header title={getPageLabel(activePage)} onOpenSidebar={() => setSidebarOpen(true)} />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </div>
  );
}
