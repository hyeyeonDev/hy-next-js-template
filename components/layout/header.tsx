'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LogOut, UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/shared/ThemeToggle';
import MobileMenuButton from '@/components/shared/Mobile/MobileMenuButton';
import Logo from '@/components/layout/logo';
import Navbar from '@/components/layout/navbar';
import { navLinks } from '@/types/menu';
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header>
      <div className="flex items-center justify-between h-16 px-4">
        <div className="sm:hidden">{/* nav 영역 */}</div>
        <div className="flex items-center gap-4">
          <Logo />
          {/* menu 영역 */}
          <Navbar />
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
          <ThemeToggle />
        </div>
        {/* 모바일 메뉴 버튼 */}
        <div className="-mr-2 flex items-center justify-between sm:hidden">
          <MobileMenuButton isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden bg-gray-50 dark:bg-gray-900`}>
        <div className="pt-2 pb-3 space-y-1">
          {/* menu 영역 */}
          {navLinks.map(({ href, label, iconElement: Icon }) => {
            return (
              <Link
                key={href}
                href={{ pathname: href }}
                className={`flex items-center px-3 py-2 text-base font-medium border-l-4 ${
                  pathname.includes(href)
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-300'
                    : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* 사용자정보, 테마토글, 로그아웃 */}
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4">
            <div className="flex-shrink-0 flex items-center gap-2">
              <UserIcon />
              <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                {user?.email?.split('@')[0] || '사용자'}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {user?.email?.split('@')[1] || ''}
              </div>
            </div>
            <ThemeToggle />
          </div>
          <div className="mt-3 px-2 space-y-1">
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 rounded-md"
            >
              <LogOut size={16} />
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
