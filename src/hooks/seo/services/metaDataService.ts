
import { supabase } from '@/integrations/supabase/client';

export const metaDataService = {
  async fetchMetaData(urls: string[]) {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.access_token) {
        throw new Error('No active session');
      }

      const response = await supabase.functions.invoke('scrape-meta-data', {
        body: { urls },
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch meta data');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching meta data:', error);
      throw error;
    }
  }
};
