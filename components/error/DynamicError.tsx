'use client';

import { useEffect, useState } from 'react';
import WarningText from '@/components/error/WarningText';

interface ErrorProps {
  code: number;
  title: string;
  description: string;
}

const errorData: Record<number, ErrorProps> = {
  400: { code: 400, title: 'Bad Request', description: '올바르지 않은 요청입니다.' },
  401: { code: 401, title: 'Unauthorized', description: '인증이 필요합니다.' },
  403: { code: 403, title: 'Forbidden', description: '접근 권한이 없습니다.' },
  404: { code: 404, title: 'Not Found', description: '요청한 페이지를 찾을 수 없습니다.' },
  500: { code: 500, title: 'Internal Server Error', description: '서버에서 오류가 발생했습니다.' },
};

const DynamicError = ({ errorCode }: { errorCode: number }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const errorInfo = errorData[errorCode] || errorData[500]; // 기본값은 500 에러

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 overflow-hidden z-50">
      <WarningText code={errorInfo.code} title={errorInfo.title} description={errorInfo.description} />
    </div>
  );
};

export default DynamicError;
