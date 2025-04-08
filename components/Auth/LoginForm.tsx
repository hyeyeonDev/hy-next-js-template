'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import CustomInput from '../custom/CustomInput';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email || !password) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return false;
    }

    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    login(email, password);
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-xl font-semibold mb-2 text-center">로그인</h1>
        <div>
          <label className="block text-sm mb-1">이메일</label>
          <CustomInput
            id="email"
            name="email"
            icon={() => <Mail size={18} className="text-gray-400" />}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">비밀번호</label>
          <CustomInput
            id="password"
            name="password"
            icon={() => <Lock size={18} className="text-gray-400" />}
            rightIcon={() => (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none pointer-events-auto"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
          로그인
        </button>
        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
          계정이 없으신가요?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            회원가입
          </Link>
        </div>
        <div className="text-center mt-2">
          <Link href="/forgot-password" className="text-xs text-gray-400 hover:underline">
            비밀번호 찾기
          </Link>
        </div>
      </form>
    </>
  );
}
