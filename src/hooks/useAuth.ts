import { useState, useCallback } from 'react';
import { ADMIN_CREDENTIALS, UserCredentials } from '@/types/appx';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback((credentials: UserCredentials): boolean => {
    setError(null);
    
    if (!credentials.login.trim() || !credentials.password.trim()) {
      setError('Preencha todos os campos');
      return false;
    }

    if (
      credentials.login === ADMIN_CREDENTIALS.login &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      return true;
    }

    setError('Credenciais inválidas');
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setError(null);
  }, []);

  return {
    isAuthenticated,
    error,
    login,
    logout,
  };
}
