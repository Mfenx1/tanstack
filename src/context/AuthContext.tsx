import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CONTEXT_ERRORS, ROUTES } from '$constants';
import { useLoginMutation, useMeQuery } from '$hooks';
import {
  clearStoredToken,
  getStoredToken,
  queryKeys,
  removeTokenFromStorage,
  setStoredToken,
} from '$lib';
import type { AuthUser } from '$types';

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error(CONTEXT_ERRORS.useAuth);
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isMeLoading, isError: isMeError } = useMeQuery(token);
  const loginMutation = useLoginMutation();

  useEffect(() => {
    if (isMeError && token) {
      const tokenToRemove = token;
      queueMicrotask(() => {
        removeTokenFromStorage();
        setToken(null);
        queryClient.removeQueries({ queryKey: queryKeys.auth.me(tokenToRemove) });
      });
    }
  }, [isMeError, token, queryClient]);

  const logout = useCallback(() => {
    if (token) {
      queryClient.removeQueries({ queryKey: queryKeys.auth.me(token) });
    }
    setToken(null);
    clearStoredToken();
    navigate(ROUTES.LOGIN);
  }, [navigate, token, queryClient]);

  const login = useCallback(
    async (username: string, password: string, rememberMe: boolean): Promise<string | null> => {
      try {
        const data = await loginMutation.mutateAsync({ username, password, rememberMe });
        setStoredToken(data.accessToken, rememberMe);
        setToken(data.accessToken);
        navigate(ROUTES.PRODUCTS);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : 'Ошибка входа';
      }
    },
    [loginMutation, navigate]
  );

  const isLoading = Boolean(token) && isMeLoading;

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
