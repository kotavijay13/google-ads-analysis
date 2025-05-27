
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleAdsConfig } from './config.ts';

export async function getUserFromRequest(req: Request, config: GoogleAdsConfig) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Not authenticated');
  }
  
  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(config.supabaseUrl, config.supabaseKey);
  
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    throw new Error(authError?.message || 'User not found');
  }
  
  return { user, supabase };
}
