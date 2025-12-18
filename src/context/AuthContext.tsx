import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    clinicName: string;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setClinicName: (name: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    clinicName: '',
    login: async () => { },
    logout: async () => { },
    setClinicName: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [clinicName, setClinicName] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setClinicName('');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('sofvet-clinic-name');
        if (saved) {
            setClinicName(saved);
        }
    }, []);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('sofvet-clinic-name');
    };

    const updateClinicName = (name: string) => {
        setClinicName(name);
        localStorage.setItem('sofvet-clinic-name', name);
        // Força atualização imediata em todas as páginas
        window.dispatchEvent(new Event('clinicNameUpdated'));
    };

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-black text-white">Carregando...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, clinicName, login, logout, setClinicName: updateClinicName }}>
            {children}
        </AuthContext.Provider>
    );
};