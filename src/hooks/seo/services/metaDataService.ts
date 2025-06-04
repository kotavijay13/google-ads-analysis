
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
      
      // Ensure we're sending the data correctly - use a simple object structure
      const payload = { urls: urls };
      console.log('Sending request payload:', payload);
      console.log('First few URLs:', urls.slice(0, 3));
      
      const { data, error } = await supabase.functions.invoke('scrape-meta-data', {
        body: payload
      });

      console.log('Meta data response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function invocation failed: ${error.message || error}`);
      }

      // Handle both success and error responses
      if (data) {
        if (data.success) {
          console.log(`Successfully received ${data.metaData?.length || 0} meta data items`);
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
