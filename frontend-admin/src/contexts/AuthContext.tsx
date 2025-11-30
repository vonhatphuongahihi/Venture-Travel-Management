import AuthAPI from "@/services/authAPI";
import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types/api";

// Define AuthContextType
export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    updateUser: (userData: User) => void;
}

// Re-export User type for convenience
export type { User } from "@/types/api";

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

    // Check for existing token on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUser(user);
                if (savedToken) {
                    setToken(savedToken);
                }
                setIsLoading(false);
                return;
            } catch {
                localStorage.removeItem("user");
            }
        }

        if (savedToken) {
            setToken(savedToken);
            // Verify token and get user profile
            AuthAPI.getProfile(savedToken)
                .then((response) => {
                    if (response.success && response.data) {
                        setUser(response.data.user);
                        // Only allow ADMIN users
                        if (response.data.user.role !== "ADMIN") {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            setToken(null);
                            setUser(null);
                        }
                    } else {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setToken(null);
                    }
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setToken(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await AuthAPI.login({ email, password });

            if (response.success && response.data) {
                // Check if user is ADMIN
                if (response.data.user.role !== "ADMIN") {
                    return {
                        success: false,
                        message: "Bạn không có quyền truy cập trang quản trị",
                    };
                }

                setUser(response.data.user);
                setToken(response.data.token);

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message };
            }
        } catch {
            return { success: false, message: "Đăng nhập thất bại. Vui lòng thử lại." };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        if (token) {
            AuthAPI.logout(token).catch(() => {
                // Ignore logout API errors
            });
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
        logout,
        updateUser,
        isAuthenticated: !!user && !!token && user.role === 'ADMIN',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
