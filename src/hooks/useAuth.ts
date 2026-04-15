import { createContext, useContext } from 'react';
import { type UserProfile } from '@/types/user';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<UserProfile, 'name' | 'unit'>>) => void;
}

// ─── Contexto ────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

export const STORAGE_KEY = 'sf_auth_user';

export function loadUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
