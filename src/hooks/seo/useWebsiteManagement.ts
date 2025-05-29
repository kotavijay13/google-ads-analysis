
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  processGSCWebsites, 
  processGoogleAdsWebsites, 
  getDefaultWebsites, 
  combineWebsites 
} from './websiteUtils';

export const useWebsiteManagement = () => {
  const { user } = useAuth();
  const [availableWebsites, setAvailableWebsites] = useState<string[]>([]);
  const [googleAdsConnected, setGoogleAdsConnected] = useState(false);

  const fetchGSCProperties = async () => {
    if (!user) return [];

    const { data: gscProperties, error: gscError } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', 'google_search_console');

    if (gscError) {
      console.error('Error fetching GSC properties:', gscError);
      return [];
    }

    if (gscProperties && gscProperties.length > 0) {
      console.log(`Found ${gscProperties.length} GSC properties`);
      const websites = processGSCWebsites(gscProperties);
      console.log('Processed websites:', websites);
      return websites;
    }

    return [];
  };

  const fetchGoogleAdsAccounts = async () => {
    if (!user) return [];

    const { data: googleAdsAccounts } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', 'google_ads');

    if (googleAdsAccounts && googleAdsAccounts.length > 0) {
      const websites = processGoogleAdsWebsites(googleAdsAccounts);
      const defaultWebsites = ['www.vantagesecurity.com', 'mergeinsights.ai'];
      return combineWebsites(websites, defaultWebsites);
    }

    return [];
  };

  const checkGoogleAdsConnection = async () => {
    if (!user) return false;

    const { data: googleAdsTokens } = await supabase
      .from('api_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google_ads')
      .maybeSingle();

    if (googleAdsTokens) {
      setGoogleAdsConnected(true);
      console.log('Google Ads connection found');
      return true;
    }

    return false;
  };

  return {
    availableWebsites,
    setAvailableWebsites,
    googleAdsConnected,
    setGoogleAdsConnected,
    fetchGSCProperties,
    fetchGoogleAdsAccounts,
    checkGoogleAdsConnection
  };
};
