import ThemeToggle from '@/components/shared/ThemeToggle';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-screen h-screen flex items-center align-middle justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl px-6 py-8 ring shadow-xl ring-gray-900/5">
        <ThemeToggle />
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50">Auth</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">로그인, 회원가입, 비밀번호 찾기</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">{children}</div>
      </div>
    </main>
  );
}
