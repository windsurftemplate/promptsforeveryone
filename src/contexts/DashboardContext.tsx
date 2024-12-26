'use client';

import React, { createContext, useContext } from 'react';

interface DashboardContextType {
  filterTag: string;
  setFilterTag: (tag: string) => void;
}

export const DashboardContext = createContext<DashboardContextType>({
  filterTag: '',
  setFilterTag: () => {},
});

export const useDashboard = () => useContext(DashboardContext); 