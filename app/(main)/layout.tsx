import { Suspense } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Loading from '@/components/shared/Loading';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
