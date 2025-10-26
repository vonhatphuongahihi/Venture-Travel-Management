import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthAPI from '@/services/authAPI';
import GoogleAuthService from '@/services/googleAuthService';

interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_photo?: string;
  date_of_birth?: string;
  gender?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => void;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const loadUserFromStorage = () => {
      let savedToken = localStorage.getItem('token');

      if (!savedToken) {
        savedToken = sessionStorage.getItem('token');
      }

      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setUser(user);
          if (savedToken) {
            setToken(savedToken);
          }
          return true;
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
      return false;
    };

    const userLoaded = loadUserFromStorage();
    if (userLoaded) {
      setIsLoading(false);
      return;
    }

    let savedToken = localStorage.getItem('token');
    if (!savedToken) {
      savedToken = sessionStorage.getItem('token');
    }

    if (savedToken) {
      setToken(savedToken);
      // Verify token and get user profile
      AuthAPI.getProfile(savedToken)
        .then((response) => {
          if (response.success && response.data) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('remember');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            setToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('remember');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          setToken(null);
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

  const register = async (userData: any) => {
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

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    loginWithGoogle,
    register,
    verifyEmail,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
