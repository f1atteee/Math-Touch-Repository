import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { USER_GET_BY_ID_URL, USER_UPDATE_URL } from '@src/config/api';

export interface UserDto {
    id?: string | number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    phone: string;
    rezervPhone: string;
    isTeacher: boolean;
}

interface AuthContextProps {
    isAuthorized: boolean;
    setIsAuthorized: (auth: boolean) => void;
    user: UserDto | null;
    refreshUser: () => Promise<void>;
    updateUser: (changes: Partial<UserDto>) => Promise<UserDto | null>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(!!localStorage.getItem('access_token'));
    const [user, setUser] = useState<UserDto | null>(null);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user');
        if (!token || !userId) {
            setUser(null);
            setIsAuthorized(false);
            return;
        }
        try {
            const resp = await fetch(USER_GET_BY_ID_URL(userId), {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!resp.ok) {
                throw new Error('Failed to fetch user');
            }
            const data = await resp.json();
            setUser({
                id: data.id,
                userName: data.userName,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                patronymic: data.patronymic,
                phone: data.phone,
                rezervPhone: data.rezervPhone,
                isTeacher: !!data.isTeacher,
            });
            setIsAuthorized(true);
        } catch (e) {
            console.error(e);
            setUser(null);
            setIsAuthorized(false);
        }
    }, []);

    const updateUser = useCallback(async (changes: Partial<UserDto>) => {
        const token = localStorage.getItem('access_token');
        if (!token || !user) return null;
        try {
            const resp = await fetch(USER_UPDATE_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ ...user, ...changes }),
            });
            if (!resp.ok) {
                throw new Error('Failed to update user');
            }
            // API returns 200 OK without body
            const updated: UserDto = { ...user, ...changes } as UserDto;
            setUser(updated);
            return updated;
        } catch (e) {
            console.error(e);
            return null;
        }
    }, [user]);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setIsAuthorized(false);
        setUser(null);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            refreshUser();
        } else {
            setIsAuthorized(false);
            setUser(null);
        }
    }, [refreshUser]);

    return (
        <AuthContext.Provider value={{ isAuthorized, setIsAuthorized, user, refreshUser, updateUser, logout }}>
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