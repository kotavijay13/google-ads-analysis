
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const serpApiService = {
  async fetchData(websiteUrl: string) {
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
  }
};
