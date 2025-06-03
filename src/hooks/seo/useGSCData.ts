
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
      
      // If we have pages data, fetch meta data for top pages
      if (result && result.pages && result.pages.length > 0) {
        console.log(`Found ${result.pages.length} pages, fetching meta data for top 200...`);
        const topPageUrls = result.pages.slice(0, 200).map(page => page.url);
        
        try {
          const metaData = await fetchMetaDataForUrls(topPageUrls);
          console.log(`Successfully fetched meta data for ${metaData.length} URLs`);
          
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
              domain: meta.domain,
              imageCount: meta.imageCount || 0,
              imagesWithoutAlt: meta.imagesWithoutAlt || 0,
              images: meta.images || []
            }))
          ];
          
          console.log(`Total URL meta data available: ${result.urlMetaData.length}`);
        } catch (metaError) {
          console.error('Error fetching meta data:', metaError);
          toast.error('Failed to fetch meta data for pages');
        }
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
