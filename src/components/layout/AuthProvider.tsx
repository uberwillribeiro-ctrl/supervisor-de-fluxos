import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue } from '@/hooks/useAuth';
import { type UserProfile, UserRole } from '@/types/user';
import { supabase } from '@/lib/supabase';

// ─── Converte perfil do Supabase → UserProfile ────────────────────────────────

function roleFromString(role: string | null): UserRole {
  if (role === 'admin') return UserRole.ADMIN;
  if (role === 'coordinator') return UserRole.COORDINATOR;
  return UserRole.TECHNICIAN;
}

function buildUserProfile(
  authId: string,
  email: string,
  profile: { name: string | null; role: string | null } | null,
): UserProfile {
  return {
    id: authId,
    name:
      profile?.name ??
      email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
    role: roleFromString(profile?.role ?? null),
    unit: 'CREAS Centro',
    createdAt: new Date().toISOString(),
  };
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Busca o perfil na tabela profiles
  async function fetchProfile(authId: string, email: string): Promise<UserProfile> {
    const { data } = await supabase.from('profiles').select('name, role').eq('id', authId).single();
    return buildUserProfile(authId, email, data ?? null);
  }

  // Inicializa sessão ao montar (persiste o login entre recarregamentos)
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email ?? '');
        setUser(profile);
      }
      setIsLoading(false);
    });

    // Listener para mudanças de auth (login / logout em outra aba)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email ?? '');
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    setIsLoading(false);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    // Cria perfil na tabela profiles
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, name, role: 'technician' });
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<Pick<UserProfile, 'name' | 'unit'>>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, register, logout, updateProfile }),
    [user, isLoading, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
