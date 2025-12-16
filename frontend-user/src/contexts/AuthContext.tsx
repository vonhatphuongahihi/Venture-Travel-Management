import AuthAPI from '@/services/authAPI';
import GoogleAuthService from '@/services/googleAuthService';
import UserAPI from '@/services/userAPI';
import { RegisterRequest, User } from '@/types/api';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => void;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
  updateUser: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let savedToken = localStorage.getItem('token');
    if (!savedToken) {
      savedToken = sessionStorage.getItem('token');
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }

    if (savedToken) {
      setToken(savedToken);
      UserAPI.getProfile(savedToken)
        .then((response) => {
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('remember');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        })
        .catch(() => {
          console.error('Failed to refresh user profile from API');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, remember: boolean = false) => {
    try {
      setIsLoading(true);
      const response = await AuthAPI.login({ email, password });

      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);

        if (remember) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('remember', 'true');
        } else {
          sessionStorage.setItem('token', response.data.token);
          localStorage.removeItem('remember');
        }

        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Đăng nhập thất bại. Vui lòng thử lại.' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => {
    GoogleAuthService.signIn();
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await AuthAPI.register(userData);

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Đăng ký thất bại. Vui lòng thử lại.' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (verificationToken: string) => {
    try {
      setIsLoading(true);
      const response = await AuthAPI.verifyEmail({ token: verificationToken });

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Xác thực email thất bại. Vui lòng thử lại.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (token) {
      AuthAPI.logout(token).catch(() => {
      });
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('remember');
    sessionStorage.removeItem('token');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    // Cập nhật trong localStorage nếu có token
    if (localStorage.getItem('token')) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    loginWithGoogle,
    register,
    verifyEmail,
    updateUser,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
