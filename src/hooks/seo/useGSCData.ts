
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { gscApiService } from './services/gscApiService';
import { serpApiService } from './services/serpApiService';

export const useGSCData = () => {
  const { user } = useAuth();

  const fetchRealTimeGSCData = async (websiteUrl: string) => {
    if (!user) return;

    try {
      return await gscApiService.fetchData(websiteUrl, user);
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
