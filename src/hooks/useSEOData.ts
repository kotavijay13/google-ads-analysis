
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';

// Initial sample keywords
const initialKeywords = [
  { keyword: 'digital marketing agency', impressions: 5400, clicks: 260, ctr: 9.3, position: 3, change: '+2' },
  { keyword: 'social media services', impressions: 3200, clicks: 220, ctr: 9.2, position: 5, change: '-1' },
  { keyword: 'ppc management', impressions: 2800, clicks: 190, ctr: 9.0, position: 2, change: '+4' },
  { keyword: 'content marketing', impressions: 1900, clicks: 170, ctr: 8.9, position: 6, change: '+1' },
  { keyword: 'seo services', impressions: 1500, clicks: 130, ctr: 8.7, position: 4, change: '+3' },
];

export const useSEOData = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string>('');
  const [availableWebsites, setAvailableWebsites] = useState<string[]>([]);
  const [serpKeywords, setSerpKeywords] = useState(initialKeywords);
  const [serpStats, setSerpStats] = useState({
    totalKeywords: 5,
    top10Keywords: 3,
    avgPosition: '3.6',
    estTraffic: 970
  });
  const [googleAdsConnected, setGoogleAdsConnected] = useState(false);

  // Check Google Search Console connection and fetch properties
  useEffect(() => {
    if (user) {
      checkGoogleSearchConsoleConnection();
    }
  }, [user]);

  const checkGoogleSearchConsoleConnection = async () => {
    if (!user) return;
    
    try {
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
        // Fetch Google Search Console properties
        const { data: gscProperties, error: gscError } = await supabase
          .from('ad_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', 'google_search_console');

        if (gscError) {
          console.error('Error fetching GSC properties:', gscError);
        } else if (gscProperties && gscProperties.length > 0) {
          const websites = gscProperties.map(property => {
            // Extract domain from the account_id (which stores the full URL)
            try {
              const url = new URL(property.account_id);
              return url.hostname;
            } catch {
              // If URL parsing fails, use the account_name as fallback
              return property.account_name || property.account_id;
            }
          });
          
          setAvailableWebsites(websites);
          if (!selectedWebsite && websites.length > 0) {
            setSelectedWebsite(websites[0]);
          }
          return;
        }
      }

      // Fallback: Check for Google Ads accounts if no GSC properties
      const { data: googleAdsTokens } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google_ads')
        .maybeSingle();

      if (googleAdsTokens) {
        setGoogleAdsConnected(true);
        
        const { data: googleAdsAccounts } = await supabase
          .from('ad_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', 'google_ads');

        if (googleAdsAccounts && googleAdsAccounts.length > 0) {
          const websites = googleAdsAccounts.map(account => {
            const accountName = account.account_name?.toLowerCase().replace(/\s+/g, '') || 'website';
            return `${accountName}.com`;
          });
          
          const defaultWebsites = ['mergeinsights.ai', 'example.com'];
          const allWebsites = [...new Set([...defaultWebsites, ...websites])];
          
          setAvailableWebsites(allWebsites);
          
          if (!selectedWebsite && allWebsites.length > 0) {
            setSelectedWebsite(allWebsites[0]);
          }
        }
      } else {
        // No connections found, use default websites
        const defaultWebsites = ['mergeinsights.ai', 'example.com', 'testsite.org', 'mydomain.net'];
        setAvailableWebsites(defaultWebsites);
        if (!selectedWebsite) {
          setSelectedWebsite(defaultWebsites[0]);
        }
      }
    } catch (error) {
      console.error('Error checking connections:', error);
    }
  };

  const fetchRealTimeGSCData = async (websiteUrl: string) => {
    if (!user) return;

    try {
      console.log(`Fetching real-time GSC data for: ${websiteUrl}`);
      
      const { data, error } = await supabase.functions.invoke('google-search-console-data', {
        body: { 
          websiteUrl: `https://${websiteUrl}`,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
          endDate: new Date().toISOString().split('T')[0] // today
        }
      });

      if (error) {
        console.error('GSC API error:', error);
        throw error;
      }

      if (data && data.success) {
        if (data.keywords && data.keywords.length > 0) {
          setSerpKeywords(data.keywords);
          setSerpStats({
            totalKeywords: data.keywords.length,
            top10Keywords: data.keywords.filter((k: any) => k.position <= 10).length,
            avgPosition: (data.keywords.reduce((acc: number, k: any) => acc + k.position, 0) / data.keywords.length).toFixed(1),
            estTraffic: data.keywords.reduce((acc: number, k: any) => acc + (k.clicks || 0), 0)
          });
          toast.success(`Successfully loaded ${data.keywords.length} keywords from Google Search Console`);
        } else {
          toast.warning('No keyword data found in Google Search Console for this website');
        }
      } else {
        throw new Error(data?.error || 'Failed to fetch GSC data');
      }
    } catch (error) {
      console.error('Error fetching real-time GSC data:', error);
      toast.error('Failed to fetch real-time data from Google Search Console');
    }
  };

  const handleRefreshSerpData = async () => {
    if (!selectedWebsite) {
      toast.error('Please select a website to analyze');
      return;
    }

    setIsRefreshing(true);
    console.log(`Refreshing data for: ${selectedWebsite}`);

    try {
      // First try to fetch real-time Google Search Console data
      await fetchRealTimeGSCData(selectedWebsite);
    } catch (gscError) {
      console.log('GSC data fetch failed, falling back to SERP API');
      
      // Fallback to SERP API if GSC fails
      try {
        const { data, error } = await supabase.functions.invoke('serp-api', {
          body: { websiteUrl: selectedWebsite }
        });

        if (error) {
          console.error('SERP API error:', error);
          throw error;
        }

        if (data.keywords && data.keywords.length > 0) {
          setSerpKeywords(data.keywords);
          setSerpStats(data.stats);
          toast.success(`Successfully loaded ${data.keywords.length} keywords from SERP analysis`);
        } else {
          toast.warning('No keyword data found for this website');
        }
      } catch (serpError) {
        console.error('Error fetching SERP data:', serpError);
        toast.error('Failed to fetch data. Please try again.');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleWebsiteChange = (website: string) => {
    setSelectedWebsite(website);
    console.log(`Selected website: ${website}`);
    
    // Auto-refresh data when website changes
    setTimeout(() => {
      handleRefreshSerpData();
    }, 500);
  };

  return {
    isRefreshing,
    selectedWebsite,
    availableWebsites,
    serpKeywords,
    serpStats,
    googleAdsConnected,
    handleRefreshSerpData,
    handleWebsiteChange,
  };
};
