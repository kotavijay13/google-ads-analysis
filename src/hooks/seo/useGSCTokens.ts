
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useGSCTokens = () => {
  const { user } = useAuth();

  const checkGSCTokens = async () => {
    if (!user) return null;

    try {
      console.log('Checking Google Search Console connection...');
      
      const { data: tokens, error: tokensError } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google_search_console')
        .maybeSingle();

      if (tokensError) {
        console.error('Error checking GSC tokens:', tokensError);
        return null;
      }

      if (tokens) {
        console.log('GSC tokens found, fetching properties...');
        return tokens;
      }

      console.log('No GSC connection found, checking Google Ads...');
      return null;
    } catch (error) {
      console.error('Error checking GSC tokens:', error);
      return null;
    }
  };

  return { checkGSCTokens };
};
