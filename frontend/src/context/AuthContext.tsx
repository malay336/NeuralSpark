"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type User = {
    username: string;
    name: string;
    email: string;
    level: number;
    streak: number;
    rank: number;
    balance: number;
};

type AuthContextType = {
    user: User | null;
    login: (username: string, email: string) => boolean;
    logout: () => void;
    isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Load initial user state from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("neuralspark_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
    }, []);

    const login = (username: string, email: string): boolean => {
        if (!username || !email) return false;
        
        // Mock a successful authentication
        const newUser: User = {
            username: username.toLowerCase().replace(/\s+/g, ""),
            name: username,
            email: email,
            level: 4,
            streak: 4,
            rank: 142,
            balance: 250.00
        };
        
        setUser(newUser);
        localStorage.setItem("neuralspark_user", JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("neuralspark_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
