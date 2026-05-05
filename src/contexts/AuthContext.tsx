import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { userService } from '../services/userService';
import type { LoginCredentials, LoginResponse } from '../types/user';

interface AuthContextData {
  user: LoginResponse['user'] | null;
  signed: boolean;
  isLoading: boolean;
  signIn(credentials: LoginCredentials): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Busca os dados salvos ao carregar a página (F5)
    const storagedUser = localStorage.getItem('@Ledger:user');
    const storagedToken = localStorage.getItem('@Ledger:token');

    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
      // Configura o axios para todas as chamadas futuras
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
    }
    
    setIsLoading(false);
  }, []);

  async function signIn(credentials: LoginCredentials) {
    const response = await userService.login(credentials);

    setUser(response.user);

    // Configura o cabeçalho de autorização
    api.defaults.headers.Authorization = `Bearer ${response.access}`;

    // Persiste no navegador
    localStorage.setItem('@Ledger:token', response.access);
    localStorage.setItem('@Ledger:refresh', response.refresh);
    localStorage.setItem('@Ledger:user', JSON.stringify(response.user));

    navigate('/dashboard');
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ 
      signed: !!user, 
      user, 
      isLoading, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}