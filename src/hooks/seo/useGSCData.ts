
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { gscApiService } from './services/gscApiService';
import { serpApiService } from './services/serpApiService';
import { useMetaData } from './useMetaData';

export const useGSCData = () => {
  const { user } = useAuth();
  const { fetchMetaDataForUrls } = useMetaData();

  const fetchRealTimeGSCData = async (websiteUrl: string, startDate?: string, endDate?: string) => {
    if (!user) return;

    try {
      const result = await gscApiService.fetchData(websiteUrl, user, startDate, endDate);
      
      // If we have pages data, fetch meta data for top 200 pages instead of 50
      if (result && result.pages && result.pages.length > 0) {
        const topPageUrls = result.pages.slice(0, 200).map(page => page.url);
        const metaData = await fetchMetaDataForUrls(topPageUrls);
        
        // Merge meta data with existing URL meta data
        result.urlMetaData = [
          ...(result.urlMetaData || []),
          ...metaData.map(meta => ({
            url: meta.url,
            indexStatus: 'UNKNOWN',
            crawlStatus: 'UNKNOWN',
            lastCrawled: null,
            userAgent: 'Unknown',
            metaTitle: meta.metaTitle,
            metaDescription: meta.metaDescription,
            siteName: meta.siteName,
            domain: meta.domain
          }))
        ];
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching real-time GSC data:', error);
      toast.error('Failed to fetch real-time data from Google Search Console. Please check your connection and try again.');
      throw error;
    }
  };

  const fallbackToSerpAPI = async (websiteUrl: string) => {
    return await serpApiService.fetchData(websiteUrl);
  };

  return {
    fetchRealTimeGSCData,
    fallbackToSerpAPI
  };
};
