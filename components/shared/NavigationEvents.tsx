// components/NavigationEvents.tsx
'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 페이지 전환 시 실행할 로직
    console.log('Page changed to:', pathname);
  }, [pathname, searchParams]);

  return null;
}
