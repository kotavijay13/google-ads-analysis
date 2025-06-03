
import { supabase } from '@/integrations/supabase/client';

export const metaDataService = {
  async fetchMetaData(urls: string[]) {
    try {
      console.log('Fetching meta data for URLs:', urls.length);
      
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.access_token) {
        throw new Error('No active session');
      }

      console.log('Calling scrape-meta-data function...');
      
      // Use supabase.functions.invoke with the correct syntax
      const { data, error } = await supabase.functions.invoke('scrape-meta-data', {
        body: { urls },
      });

      console.log('Meta data response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to fetch meta data');
      }

      // Handle both success and error responses
      if (data) {
        if (data.success) {
          return data;
        } else {
          console.error('Function returned error:', data.error);
          throw new Error(data.error || 'Failed to fetch meta data');
        }
      }

      throw new Error('No data received from function');
    } catch (error) {
      console.error('Error fetching meta data:', error);
      throw error;
    }
  }
};
