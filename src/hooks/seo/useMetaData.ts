
import { useState } from 'react';
import { metaDataService } from './services/metaDataService';
import { toast } from '@/components/ui/sonner';

export const useMetaData = () => {
  const [isLoadingMetaData, setIsLoadingMetaData] = useState(false);

  const fetchMetaDataForUrls = async (urls: string[]) => {
    if (!urls || urls.length === 0) {
      return [];
    }

    setIsLoadingMetaData(true);
    
    try {
      const result = await metaDataService.fetchMetaData(urls);
      
      if (result?.success) {
        toast.success(`Successfully scraped meta data for ${result.metaData.length} URLs`);
        return result.metaData;
      } else {
        throw new Error(result?.error || 'Failed to fetch meta data');
      }
    } catch (error) {
      console.error('Error fetching meta data:', error);
      toast.error('Failed to fetch meta data. Please try again.');
      return [];
    } finally {
      setIsLoadingMetaData(false);
    }
  };

  return {
    fetchMetaDataForUrls,
    isLoadingMetaData
  };
};
