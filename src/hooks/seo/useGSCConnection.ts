
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useGSCConnection = () => {
  const { user } = useAuth();
  const [availableWebsites, setAvailableWebsites] = useState<string[]>([]);
  const [googleAdsConnected, setGoogleAdsConnected] = useState(false);

  const checkGoogleSearchConsoleConnection = async () => {
    if (!user) return;
    
    try {
      console.log('Checking Google Search Console connection...');
      
      // Check if Google Search Console is connected
      const { data: tokens, error: tokensError } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google_search_console')
        .maybeSingle();

      if (tokensError) {
        console.error('Error checking GSC tokens:', tokensError);
        return;
      }

      if (tokens) {
        console.log('GSC tokens found, fetching properties...');
        
        // Fetch Google Search Console properties
        const { data: gscProperties, error: gscError } = await supabase
          .from('ad_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', 'google_search_console');

        if (gscError) {
          console.error('Error fetching GSC properties:', gscError);
        } else if (gscProperties && gscProperties.length > 0) {
          console.log(`Found ${gscProperties.length} GSC properties`);
          
          const websites = gscProperties
            .map(property => {
              try {
                const url = new URL(property.account_id);
                return url.hostname;
              } catch {
                return property.account_name || property.account_id;
              }
            })
            .filter(website => website && typeof website === 'string' && website.trim().length > 0);
          
          console.log('Processed websites:', websites);
          setAvailableWebsites(websites);
          return websites;
        }
      }

      console.log('No GSC connection found, checking Google Ads...');
      
      // Fallback: Check for Google Ads accounts if no GSC properties
      const { data: googleAdsTokens } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google_ads')
        .maybeSingle();

      if (googleAdsTokens) {
        setGoogleAdsConnected(true);
        console.log('Google Ads connection found');
        
        const { data: googleAdsAccounts } = await supabase
          .from('ad_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', 'google_ads');

        if (googleAdsAccounts && googleAdsAccounts.length > 0) {
          const websites = googleAdsAccounts
            .map(account => {
              const accountName = account.account_name?.toLowerCase().replace(/\s+/g, '') || 'website';
              return `${accountName}.com`;
            })
            .filter(website => website && website !== '.com' && website.trim().length > 0);
          
          const defaultWebsites = ['www.vantagesecurity.com', 'mergeinsights.ai'];
          const allWebsites = [...new Set([...defaultWebsites, ...websites])];
          
          console.log('Combined websites from Google Ads:', allWebsites);
          setAvailableWebsites(allWebsites);
          return allWebsites;
        }
      } else {
        console.log('No connections found, using default websites');
        
        const defaultWebsites = ['www.vantagesecurity.com', 'mergeinsights.ai', 'example.com', 'testsite.org'];
        setAvailableWebsites(defaultWebsites);
        return defaultWebsites;
      }
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
