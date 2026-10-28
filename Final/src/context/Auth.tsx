import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/routes';
import { setUnauthorizedHandler } from '../api/http';
import { tokenStorage } from '../api/token';
import type { UserDto } from '../types/data';

interface AuthContextValue {
  user: UserDto | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<UserDto>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserDto | null>(null);
  const [initializing, setInitializing] = useState<boolean>(() => !!tokenStorage.getToken());

  const resetAuth = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      resetAuth();
      navigate('/login', { replace: true });
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate, resetAuth]);

  useEffect(() => {
    if (!tokenStorage.getToken()) return;
    authApi
      .me()
      .then(setUser)
      .catch(() => {
      })
      .finally(() => setInitializing(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, user: loggedUser } = await authApi.login({ email, password });
    tokenStorage.save(accessToken, loggedUser.role);
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    resetAuth();
    navigate('/login', { replace: true });
  }, [navigate, resetAuth]);

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth треба викликати всередині AuthProvider');
  return ctx;
}
