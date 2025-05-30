
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
      
      const response = await supabase.functions.invoke('scrape-meta-data', {
        body: { urls },
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Meta data response:', response);

      if (response.error) {
        console.error('Supabase function error:', response.error);
        throw new Error(response.error.message || 'Failed to fetch meta data');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching meta data:', error);
      throw error;
    }
  }
};
