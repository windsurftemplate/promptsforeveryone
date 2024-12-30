'use client';

import React, { createContext, useContext, useEffect } from 'react';

// Simple provider to always set dark mode
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Always set dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return <>{children}</>;
} 