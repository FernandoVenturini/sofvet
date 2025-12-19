import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  clinicName: string;
  isTrialExpired: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setClinicName: (name: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  clinicName: '',
  isTrialExpired: false,
  login: async () => {},
  logout: async () => {},
  setClinicName: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [clinicName, setClinicName] = useState<string>('');
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);

        // Carrega nome da clínica
        const savedClinic = localStorage.getItem('sofvet-clinic-name');
        if (savedClinic) setClinicName(savedClinic);

        // Verifica trial de 7 dias
        const createdAt = firebaseUser.metadata.creationTime;
        if (createdAt) {
          const creationDate = new Date(createdAt);
          const today = new Date();
          const diffDays = Math.floor((today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 7) {
            setIsTrialExpired(true);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setClinicName('');
        setIsTrialExpired(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-white">Carregando...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        clinicName,
        isTrialExpired,
        login,
        logout,
        setClinicName: updateClinicName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};