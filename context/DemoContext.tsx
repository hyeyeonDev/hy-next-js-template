'use client';

import React, { createContext, useContext, useState } from 'react';
import axiosServices from '@/utils/axios';

type DemoContextType = {
  demo: string;
  setDemo: (demo: string) => void;
  loading: boolean;
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [demo, setDemo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const demoFunc = async () => {
    try {
      const response = await axiosServices.post<any>('/test');
      setDemo(response.data.interpretation);
    } catch (error) {
      console.error('demoFunc Error:', error);
      throw new Error('Failed to demoFunc.');
    } finally {
      setLoading(false);
    }
  };

  return <DemoContext.Provider value={{ demo, setDemo, loading }}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within an DemoProvider');
  }
  return context;
}
