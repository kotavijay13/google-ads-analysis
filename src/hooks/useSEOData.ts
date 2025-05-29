
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

const initialPages = [
  { url: '/homepage', impressions: 3500, clicks: 320, ctr: 9.1, position: 2.3 },
  { url: '/product', impressions: 2800, clicks: 240, ctr: 8.6, position: 3.1 },
  { url: '/blog', impressions: 2200, clicks: 195, ctr: 8.9, position: 2.8 },
  { url: '/contact', impressions: 1900, clicks: 175, ctr: 9.2, position: 2.2 },
  { url: '/about', impressions: 1600, clicks: 140, ctr: 8.8, position: 3.0 },
];

export const useSEOData = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string>('');
  const [availableWebsites, setAvailableWebsites] = useState<string[]>([]);
  const [serpKeywords, setSerpKeywords] = useState(initialKeywords);
  const [pages, setPages] = useState(initialPages);
  const [urlMetaData, setUrlMetaData] = useState<any[]>([]);
  const [sitePerformance, setSitePerformance] = useState<any>({});
  const [serpStats, setSerpStats] = useState({
    totalKeywords: 5,
    top10Keywords: 3,
    avgPosition: '3.6',
    estTraffic: 970,
    totalPages: 5,
    topPerformingPages: initialPages.slice(0, 3)
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
              // Extract domain from the account_id (which stores the full URL)
              try {
                const url = new URL(property.account_id);
                return url.hostname;
              } catch {
                // If URL parsing fails, use the account_name as fallback
                return property.account_name || property.account_id;
              }
            })
            .filter(website => website && typeof website === 'string' && website.trim().length > 0); // Filter here too
          
          console.log('Processed websites:', websites);
          setAvailableWebsites(websites);
          
          if (!selectedWebsite && websites.length > 0) {
            setSelectedWebsite(websites[0]);
            console.log(`Auto-selected website: ${websites[0]}`);
          }
          return;
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
          
          if (!selectedWebsite && allWebsites.length > 0) {
            setSelectedWebsite(allWebsites[0]);
            console.log(`Auto-selected website from Google Ads: ${allWebsites[0]}`);
          }
        }
      } else {
        console.log('No connections found, using default websites');
        
        // No connections found, use default websites
        const defaultWebsites = ['www.vantagesecurity.com', 'mergeinsights.ai', 'example.com', 'testsite.org'];
        setAvailableWebsites(defaultWebsites);
        if (!selectedWebsite) {
          setSelectedWebsite(defaultWebsites[0]);
          console.log(`Auto-selected default website: ${defaultWebsites[0]}`);
        }
      }
    } catch (error) {
      console.error('Error checking connections:', error);
    }
  };

  const fetchRealTimeGSCData = async (websiteUrl: string) => {
    if (!user) return;

    try {
      console.log(`Fetching comprehensive GSC data for: ${websiteUrl}`);
      
      const { data, error } = await supabase.functions.invoke('google-search-console-data', {
        body: { 
          websiteUrl: websiteUrl,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        }
      });

      if (error) {
        console.error('GSC API error:', error);
        throw error;
      }

      console.log('GSC API response:', data);

      if (data && data.success) {
        if (data.keywords && data.keywords.length > 0) {
          console.log(`Successfully loaded ${data.keywords.length} keywords from GSC`);
          setSerpKeywords(data.keywords);
          toast.success(`Successfully loaded ${data.keywords.length} keywords from Google Search Console`);
        } else {
          console.log('No keywords returned from GSC');
        }

        if (data.pages && data.pages.length > 0) {
          console.log(`Successfully loaded ${data.pages.length} pages from GSC`);
          setPages(data.pages);
          toast.success(`Successfully loaded ${data.pages.length} pages from Google Search Console`);
        } else {
          console.log('No pages returned from GSC');
        }

        if (data.urlMetaData) {
          setUrlMetaData(data.urlMetaData);
          console.log(`URL Meta Data loaded: ${data.urlMetaData.length}`);
        }

        if (data.sitePerformance) {
          setSitePerformance(data.sitePerformance);
          console.log('Site Performance loaded:', data.sitePerformance);
        }

        if (data.stats) {
          setSerpStats(data.stats);
          console.log('Comprehensive stats loaded:', data.stats);
        }

        if (data.keywords.length === 0 && data.pages.length === 0) {
          toast.warning('No data found for this website in Google Search Console. Make sure the website is verified and has recent data.');
        }
      } else {
        const errorMessage = data?.error || 'Failed to fetch GSC data';
        console.error('GSC data fetch failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error fetching real-time GSC data:', error);
      toast.error('Failed to fetch real-time data from Google Search Console. Please check your connection and try again.');
      throw error;
    }
  };

  const handleRefreshSerpData = async () => {
    if (!selectedWebsite) {
      toast.error('Please select a website to analyze');
      return;
    }

    setIsRefreshing(true);
    console.log(`Refreshing comprehensive data for: ${selectedWebsite}`);

    try {
      // Try to fetch real-time Google Search Console data
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
        toast.error('Failed to fetch data. Please ensure your Google Search Console is connected and the website is verified.');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleWebsiteChange = (website: string) => {
    console.log(`Website change requested: "${website}"`);
    if (website && website.trim().length > 0) {
      setSelectedWebsite(website);
      console.log(`Selected website: ${website}`);
      
      // Auto-refresh data when website changes
      setTimeout(() => {
        handleRefreshSerpData();
      }, 500);
    } else {
      console.warn('Empty website value received, ignoring');
    }
  };

  return {
    isRefreshing,
    selectedWebsite,
    availableWebsites,
    serpKeywords,
    pages,
    urlMetaData,
    sitePerformance,
    serpStats,
    googleAdsConnected,
    handleRefreshSerpData,
    handleWebsiteChange,
  };
};
