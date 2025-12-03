import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthResponse, LoginCredentials } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'schooladmin_token';
const USER_KEY = 'schooladmin_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    // Demo mode - accept any credentials
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockResponse: AuthResponse = {
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Principal',
        role: 'school_admin',
        schoolId: 'school-1',
        avatar: '',
        createdAt: new Date().toISOString(),
      },
      accessToken: 'mock-token-' + Date.now(),
      refreshToken: 'mock-refresh-' + Date.now(),
    };

    localStorage.setItem(TOKEN_KEY, mockResponse.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockResponse.user));
    setUser(mockResponse.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
