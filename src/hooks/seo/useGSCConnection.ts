
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGSCTokens } from './useGSCTokens';
import { useWebsiteManagement } from './useWebsiteManagement';
import { getDefaultWebsites } from './websiteUtils';

export const useGSCConnection = () => {
  const { user } = useAuth();
  const { checkGSCTokens } = useGSCTokens();
  const {
    availableWebsites,
    setAvailableWebsites,
    googleAdsConnected,
    fetchGSCProperties,
    fetchGoogleAdsAccounts,
    checkGoogleAdsConnection
  } = useWebsiteManagement();

  const checkGoogleSearchConsoleConnection = async () => {
    if (!user) return;
    
    try {
      const tokens = await checkGSCTokens();

      if (tokens) {
        const websites = await fetchGSCProperties();
        if (websites.length > 0) {
          setAvailableWebsites(websites);
          return websites;
        }
      }

      // Fallback: Check for Google Ads accounts if no GSC properties
      const hasGoogleAds = await checkGoogleAdsConnection();
      
      if (hasGoogleAds) {
        const googleAdsWebsites = await fetchGoogleAdsAccounts();
        if (googleAdsWebsites.length > 0) {
          console.log('Combined websites from Google Ads:', googleAdsWebsites);
          setAvailableWebsites(googleAdsWebsites);
          return googleAdsWebsites;
        }
      }

      console.log('No connections found, using default websites');
      const defaultWebsites = getDefaultWebsites();
      setAvailableWebsites(defaultWebsites);
      return defaultWebsites;
    } catch (error) {
      console.error('Error checking connections:', error);
    }
  };

  useEffect(() => {
    if (user) {
      checkGoogleSearchConsoleConnection();
    }
  }, [user]);

  return {
    availableWebsites,
    googleAdsConnected,
    checkGoogleSearchConsoleConnection
  };
};
