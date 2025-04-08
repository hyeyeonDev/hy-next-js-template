'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordForm() {
  const { findPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleFind = (e: React.FormEvent) => {
    e.preventDefault();
    const pw = findPassword(email);
    setResult(pw ? `비밀번호는: ${pw}` : '존재하지 않는 이메일입니다.');
  };

  return (
    <form onSubmit={handleFind} className="space-y-4">
      <h1 className="text-xl font-semibold mb-2 text-center">비밀번호 찾기</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">가입 시 사용한 이메일을 입력하세요.</p>
      <div>
        <label className="block text-sm mb-1">이메일</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md transition">
        재설정 메일 보내기
      </button>
      <div className="text-sm text-center text-gray-500 dark:text-gray-400">
        <Link href="/login" className="text-blue-600 hover:underline">
          로그인 페이지로 돌아가기
        </Link>
      </div>
    </form>
  );
}
