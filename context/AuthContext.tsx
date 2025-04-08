'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/auth/authService';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (user: User, password: string) => boolean;
  findPassword: (email: string) => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = (email: string, password: string) => {
    const user = authService.login(email, password);
    if (user) {
      setUser(user);
      router.push('/');
    } else {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  const register = (user: User, password: string) => {
    return authService.register(user, password);
  };

  const findPassword = (email: string) => {
    return authService.findPassword(email);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, findPassword }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
