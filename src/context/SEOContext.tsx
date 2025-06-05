
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SEOState {
  selectedWebsite: string;
  serpKeywords: any[];
  pages: any[];
  urlMetaData: any[];
  sitePerformance: any;
  serpStats: any;
  isDataLoaded: boolean;
}

interface SEOContextType {
  seoState: SEOState;
  updateSEOState: (newState: Partial<SEOState>) => void;
  clearSEOState: () => void;
}

const initialState: SEOState = {
  selectedWebsite: '',
  serpKeywords: [],
  pages: [],
  urlMetaData: [],
  sitePerformance: {
    totalPages: 0,
    indexedPages: 0,
    crawlErrors: 0,
    avgLoadTime: '0ms',
    mobileUsability: 'Good'
  },
  serpStats: {
    totalKeywords: 0,
    top10Keywords: 0,
    avgPosition: '0.0',
    estTraffic: 0,
    totalPages: 0,
    topPerformingPages: [],
    totalClicks: 0,
    totalImpressions: 0,
    avgCTR: 0
  },
  isDataLoaded: false
};

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const SEOProvider = ({ children }: { children: ReactNode }) => {
  const [seoState, setSeoState] = useState<SEOState>(initialState);

  const updateSEOState = (newState: Partial<SEOState>) => {
    setSeoState(prev => ({ ...prev, ...newState }));
  };

  const clearSEOState = () => {
    setSeoState(initialState);
  };

  return (
    <SEOContext.Provider value={{ seoState, updateSEOState, clearSEOState }}>
      {children}
    </SEOContext.Provider>
  );
};

export const useSEOContext = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEOContext must be used within a SEOProvider');
  }
  return context;
};
