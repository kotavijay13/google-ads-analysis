
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useGoogleAdsIntegration } from '@/components/google-ads/useGoogleAdsIntegration';

// Initial sample keywords
const initialKeywords = [
  { keyword: 'digital marketing agency', impressions: 5400, clicks: 260, ctr: 9.3, position: 3, change: '+2' },
  { keyword: 'social media services', impressions: 3200, clicks: 220, ctr: 9.2, position: 5, change: '-1' },
  { keyword: 'ppc management', impressions: 2800, clicks: 190, ctr: 9.0, position: 2, change: '+4' },
  { keyword: 'content marketing', impressions: 1900, clicks: 170, ctr: 8.9, position: 6, change: '+1' },
  { keyword: 'seo services', impressions: 1500, clicks: 130, ctr: 8.7, position: 4, change: '+3' },
];

export const useSEOData = () => {
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

  const { 
    accounts: googleAdsAccounts, 
    connected: googleAdsConnected 
  } = useGoogleAdsIntegration();

  // Extract websites from Google Ads accounts
  useEffect(() => {
    if (googleAdsConnected && googleAdsAccounts.length > 0) {
      const websites = googleAdsAccounts.map(account => {
        const accountName = account.name.toLowerCase().replace(/\s+/g, '');
        return `${accountName}.com`;
      });
      
      const defaultWebsites = ['mergeinsights.ai', 'example.com'];
      const allWebsites = [...new Set([...defaultWebsites, ...websites])];
      
      setAvailableWebsites(allWebsites);
      
      if (!selectedWebsite && allWebsites.length > 0) {
        setSelectedWebsite(allWebsites[0]);
      }
    } else {
      const defaultWebsites = ['mergeinsights.ai', 'example.com', 'testsite.org', 'mydomain.net'];
      setAvailableWebsites(defaultWebsites);
      if (!selectedWebsite) {
        setSelectedWebsite(defaultWebsites[0]);
      }
    }
  }, [googleAdsAccounts, googleAdsConnected, selectedWebsite]);

  const handleRefreshSerpData = async () => {
    if (!selectedWebsite) {
      toast.error('Please select a website to analyze');
      return;
    }

    setIsRefreshing(true);
    console.log(`Fetching SERP data for: ${selectedWebsite}`);

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
    } catch (error) {
      console.error('Error fetching SERP data:', error);
      toast.error('Failed to fetch SERP data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleWebsiteChange = (website: string) => {
    setSelectedWebsite(website);
    console.log(`Selected website: ${website}`);
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
