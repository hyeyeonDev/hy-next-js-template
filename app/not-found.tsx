'use client';

import DynamicError from '@/components/error/DynamicError';

export default function Error404({ error }: { error: { statusCode?: number } }) {
  return <DynamicError errorCode={error?.statusCode || 404} />;
}
