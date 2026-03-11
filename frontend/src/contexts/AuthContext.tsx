import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken } from '../lib/api';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = () => {
        const token = getAuthToken();
        setIsAuthenticated(!!token);
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();

        // Listen to unauthorized event from API
        const handleUnauthorized = () => {
            logout();
        };
        window.addEventListener('auth-unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
    }, []);

    const login = (token: string) => {
        setAuthToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        removeAuthToken();
        setIsAuthenticated(false);
    };

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
