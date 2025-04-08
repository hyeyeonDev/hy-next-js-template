// components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/types/menu';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* 모바일: nav 숨김 */}
      <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
        <nav className="flex space-x-4">
          {navLinks.map(({ href, label, iconElement: Icon, activeColor }) => (
            <Link
              key={href}
              href={{ pathname: href }}
              className={`inline-flex items-center px-1 py-1 border-b-2 text-sm font-medium ${
                pathname === href
                  ? `border-orange-300 text-gray-900 dark:text-white`
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={16} className="mr-1" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
