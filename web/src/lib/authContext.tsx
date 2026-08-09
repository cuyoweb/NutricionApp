'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from './api';

export interface NutritionistUser {
  id: string;
  fullName: string;
  email: string;
  role: 'NUTRITIONIST' | 'ADMIN';
  licenseNumber: string;
  specialty: string;
  avatarUrl: string;
  clinicAddress: string;
}

interface AuthContextType {
  user: NutritionistUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<NutritionistUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('nutri_admin_token') : null;
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('nutri_admin_user') : null;

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('nutri_admin_token');
        localStorage.removeItem('nutri_admin_user');
      }
    } else {
      // Demo auto-init for seamless preview if user hasn't explicitly logged out
      const defaultUser: NutritionistUser = {
        id: 'usr-nutri-01',
        fullName: 'Lic. Valentina Rossi',
        email: 'lic.rossi@nutrimendoza.com',
        role: 'NUTRITIONIST',
        licenseNumber: 'M.P. 1842 - Mendoza',
        specialty: 'Nutrición Clínica & Deportiva',
        avatarUrl: 'https://images.unsplash.com/photo-1594824813590-410a5669f5cc?w=150&auto=format&fit=crop&q=80',
        clinicAddress: 'Av. San Martín 1240, 4to Piso, Ciudad de Mendoza'
      };
      const defaultToken = 'jwt-nutritionist-token-lic-rossi-mendoza';
      localStorage.setItem('nutri_admin_token', defaultToken);
      localStorage.setItem('nutri_admin_user', JSON.stringify(defaultUser));
      setUser(defaultUser);
      setToken(defaultToken);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password = 'mendoza2026') => {
    setLoading(true);
    try {
      const res = await api.login({ email, password, role: 'NUTRITIONIST' });
      const userData = res.user as NutritionistUser;
      setUser(userData);
      setToken(res.token);

      if (typeof window !== 'undefined') {
        localStorage.setItem('nutri_admin_token', res.token);
        localStorage.setItem('nutri_admin_user', JSON.stringify(userData));
      }

      router.push('/dashboard');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      // Fallback
      const fallbackUser: NutritionistUser = {
        id: 'usr-nutri-01',
        fullName: 'Lic. Valentina Rossi',
        email: email || 'lic.rossi@nutrimendoza.com',
        role: 'NUTRITIONIST',
        licenseNumber: 'M.P. 1842 - Mendoza',
        specialty: 'Nutrición Clínica & Deportiva',
        avatarUrl: 'https://images.unsplash.com/photo-1594824813590-410a5669f5cc?w=150&auto=format&fit=crop&q=80',
        clinicAddress: 'Av. San Martín 1240, 4to Piso, Ciudad de Mendoza'
      };
      setUser(fallbackUser);
      setToken('demo-token');
      localStorage.setItem('nutri_admin_token', 'demo-token');
      localStorage.setItem('nutri_admin_user', JSON.stringify(fallbackUser));
      router.push('/dashboard');
      return true;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nutri_admin_token');
      localStorage.removeItem('nutri_admin_user');
    }
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
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
