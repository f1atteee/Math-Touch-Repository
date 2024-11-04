import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextProps {
    isAuthorized: boolean;
    setIsAuthorized: (auth: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(!!localStorage.getItem('access_token'));

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsAuthorized(!!token);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};