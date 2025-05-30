
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const gscApiService = {
  async fetchData(websiteUrl: string, user: any, startDate?: string, endDate?: string) {
    if (!user) throw new Error('User not authenticated');

    console.log(`Fetching comprehensive GSC data for: ${websiteUrl} (${startDate} to ${endDate})`);
    
    const { data, error } = await supabase.functions.invoke('google-search-console-data', {
      body: { 
        websiteUrl: websiteUrl,
        startDate: startDate || new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: endDate || new Date().toISOString().split('T')[0]
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

      this.showSuccessMessages(result);

      if (result.keywords.length === 0 && result.pages.length === 0) {
        toast.warning('No data found for this website in Google Search Console. Make sure the website is verified and has recent data.');
      }

      return result;
    } else {
      const errorMessage = data?.error || 'Failed to fetch GSC data';
      console.error('GSC data fetch failed:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  showSuccessMessages(result: any) {
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
  }
};
