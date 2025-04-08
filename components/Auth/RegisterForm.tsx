'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import CustomInput from '@/components/custom/CustomInput';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
  });

  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  const checkPasswordStrength = (password: string) => {
    // 비밀번호 강도 체크 로직
    let score = 0;
    let message = '';

    if (password.length < 8) {
      message = '비밀번호는 8자 이상이어야 합니다';
    } else {
      score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      if (score === 1) message = '약함';
      else if (score === 2) message = '보통';
      else if (score === 3) message = '강함';
      else if (score === 4) message = '매우 강함';
    }

    setPasswordStrength({ score, message });
  };

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = register({ id: uuidv4(), email, name }, password);
    if (success) {
      alert('회원가입 완료');
      router.push('/login');
    } else {
      alert('이미 존재하는 이메일입니다.');
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <h1 className="text-xl font-semibold mb-2 text-center">회원가입</h1>
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
            placeholder="8자 이상의 비밀번호"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">비밀번호 확인</label>
          <CustomInput
            id="confirmPassword"
            name="confirmPassword"
            icon={() => <Lock size={18} className="text-gray-400" />}
            rightIcon={() => (
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="focus:outline-none pointer-events-auto"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 확인"
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition">
          회원가입
        </button>
        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            로그인
          </Link>
        </div>
      </form>
    </>
  );
}
