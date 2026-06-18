import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearTokens,
  getAccessToken,
  loadStoredTokens,
  setTokens,
} from '@/api/client';
import { authApi } from '@/api/endpoints';

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (pin: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = loadStoredTokens();
    return !!stored?.access;
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const login = useCallback(async (pin: string) => {
    try {
      const tokens = await authApi.login(pin);
      setTokens(tokens.accessToken, tokens.refreshToken);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch {
      setAuthError('Incorrect PIN. Please try again.');
      throw new Error('Invalid PIN');
    }
  }, []);

  const logout = useCallback(async () => {
    const stored = loadStoredTokens();
    if (stored?.refresh) {
      try {
        await authApi.logout(stored.refresh);
      } catch {
        /* ignore */
      }
    }
    clearTokens();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: isAuthenticated && !!getAccessToken(),
      login,
      logout,
      authError,
      clearAuthError: () => setAuthError(null),
    }),
    [isAuthenticated, login, logout, authError],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
