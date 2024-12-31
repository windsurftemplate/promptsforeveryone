'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CategorySelection {
  id: string;
  isPrivate?: boolean;
}

interface DashboardContextType {
  selectedCategory: CategorySelection | null;
  setSelectedCategory: (category: CategorySelection | null) => void;
  selectedSubcategory: { id: string } | null;
  setSelectedSubcategory: (subcategory: { id: string } | null) => void;
  filterTag: string;
  setFilterTag: (tag: string) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<CategorySelection | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ id: string } | null>(null);
  const [filterTag, setFilterTag] = useState<string>('');

  return (
    <DashboardContext.Provider value={{ 
      selectedCategory, 
      setSelectedCategory,
      selectedSubcategory,
      setSelectedSubcategory,
      filterTag, 
      setFilterTag 
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