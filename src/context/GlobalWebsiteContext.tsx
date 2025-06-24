
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GlobalWebsiteContextType {
  selectedWebsite: string;
  setSelectedWebsite: (website: string) => void;
}

const GlobalWebsiteContext = createContext<GlobalWebsiteContextType | undefined>(undefined);

export const GlobalWebsiteProvider = ({ children }: { children: ReactNode }) => {
  const [selectedWebsite, setSelectedWebsiteState] = useState<string>('');

  // Load saved website from localStorage on component mount
  useEffect(() => {
    const savedWebsite = localStorage.getItem('selectedWebsite');
    if (savedWebsite && savedWebsite.trim().length > 0) {
      setSelectedWebsiteState(savedWebsite);
    }
  }, []);

  // Custom setter that also saves to localStorage
  const setSelectedWebsite = (website: string) => {
    setSelectedWebsiteState(website);
    if (website && website.trim().length > 0) {
      localStorage.setItem('selectedWebsite', website);
    } else {
      localStorage.removeItem('selectedWebsite');
    }
  };

  return (
    <GlobalWebsiteContext.Provider value={{ selectedWebsite, setSelectedWebsite }}>
      {children}
    </GlobalWebsiteContext.Provider>
  );
};

export const useGlobalWebsite = () => {
  const context = useContext(GlobalWebsiteContext);
  if (!context) {
    throw new Error('useGlobalWebsite must be used within a GlobalWebsiteProvider');
  }
  return context;
};
