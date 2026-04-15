import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main className={cn('flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto', className)}>
      {children}
    </main>
  );
}
