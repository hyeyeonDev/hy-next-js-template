'use client';

import DynamicError from '@/components/error/DynamicError';

export default function ErrorPage({ error }: { error: { statusCode?: number } }) {
  return <DynamicError errorCode={error?.statusCode || 500} />;
}
