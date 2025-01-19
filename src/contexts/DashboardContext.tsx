'use client';

import React, { createContext, useContext, useState } from 'react';

interface DashboardContextType {
  selectedCategory: { id: string; isPrivate: boolean } | null;
  setSelectedCategory: (category: { id: string; isPrivate: boolean } | null) => void;
  selectedSubcategory: { id: string; name: string } | null;
  setSelectedSubcategory: (subcategory: { id: string; name: string } | null) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  viewMode: 'card' | 'list';
  setViewMode: (mode: 'card' | 'list') => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; isPrivate: boolean } | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ id: string; name: string } | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  return (
    <DashboardContext.Provider value={{
      selectedCategory,
      setSelectedCategory,
      selectedSubcategory,
      setSelectedSubcategory,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      viewMode,
      setViewMode,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
} 