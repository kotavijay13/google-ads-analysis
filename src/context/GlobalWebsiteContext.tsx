
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalWebsiteContextType {
  selectedWebsite: string;
  setSelectedWebsite: (website: string) => void;
}

const GlobalWebsiteContext = createContext<GlobalWebsiteContextType | undefined>(undefined);

export const GlobalWebsiteProvider = ({ children }: { children: ReactNode }) => {
  const [selectedWebsite, setSelectedWebsite] = useState<string>('');

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
