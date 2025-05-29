
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { KeywordData, PageData, UrlMetaData, SitePerformance, SerpStats } from './types';

export const useGSCData = () => {
  const { user } = useAuth();

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
        const result = {
          keywords: data.keywords || [],
          pages: data.pages || [],
          urlMetaData: data.urlMetaData || [],
          sitePerformance: data.sitePerformance || {},
          stats: data.stats || {}
        };

        if (result.keywords.length > 0) {
          console.log(`Successfully loaded ${result.keywords.length} keywords from GSC`);
          toast.success(`Successfully loaded ${result.keywords.length} keywords from Google Search Console`);
        }

        if (result.pages.length > 0) {
          console.log(`Successfully loaded ${result.pages.length} pages from GSC`);
          toast.success(`Successfully loaded ${result.pages.length} pages from Google Search Console`);
        }

        if (result.urlMetaData.length > 0) {
          console.log(`URL Meta Data loaded: ${result.urlMetaData.length}`);
        }

        if (Object.keys(result.sitePerformance).length > 0) {
          console.log('Site Performance loaded:', result.sitePerformance);
        }

        if (Object.keys(result.stats).length > 0) {
          console.log('Comprehensive stats loaded:', result.stats);
        }

        if (result.keywords.length === 0 && result.pages.length === 0) {
          toast.warning('No data found for this website in Google Search Console. Make sure the website is verified and has recent data.');
        }

        return result;
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

  const fallbackToSerpAPI = async (websiteUrl: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('serp-api', {
        body: { websiteUrl }
      });

      if (error) {
        console.error('SERP API error:', error);
        throw error;
      }

      if (data.keywords && data.keywords.length > 0) {
        toast.success(`Successfully loaded ${data.keywords.length} keywords from SERP analysis`);
        return {
          keywords: data.keywords,
          stats: data.stats
        };
      } else {
        toast.warning('No keyword data found for this website');
        return null;
      }
    } catch (error) {
      console.error('Error fetching SERP data:', error);
      toast.error('Failed to fetch data. Please ensure your Google Search Console is connected and the website is verified.');
      throw error;
    }
  };

  return {
    fetchRealTimeGSCData,
    fallbackToSerpAPI
  };
};
