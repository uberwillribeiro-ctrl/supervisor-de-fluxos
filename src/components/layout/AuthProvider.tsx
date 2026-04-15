import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, STORAGE_KEY, loadUser, type AuthContextValue } from '@/hooks/useAuth';
import { type UserProfile, UserRole } from '@/types/user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(loadUser);
  const [isLoading, setIsLoading] = useState(false);

  const persist = useCallback((u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('sf_workspace');
    }
  }, []);

  const login = useCallback(
    async (email: string, _password: string) => {
      setIsLoading(true);
      await new Promise<void>((resolve) => setTimeout(resolve, 900));

      const mockUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: email
          .split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        role: UserRole.ADMIN,
        unit: 'CREAS Centro',
        createdAt: new Date().toISOString(),
      };

      persist(mockUser);
      setIsLoading(false);
    },
    [persist],
  );

  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      setIsLoading(true);
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));

      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name,
        email,
        role: UserRole.ADMIN,
        unit: '',
        createdAt: new Date().toISOString(),
      };

      persist(newUser);
      setIsLoading(false);
    },
    [persist],
  );

  const logout = useCallback(() => {
    persist(null);
  }, [persist]);

  const updateProfile = useCallback((data: Partial<Pick<UserProfile, 'name' | 'unit'>>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, register, logout, updateProfile }),
    [user, isLoading, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
