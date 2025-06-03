
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function authenticateUser(authHeader: string | null) {
  if (!authHeader) {
    console.error('No authorization header provided');
    throw new Error('No authorization header');
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration');
    throw new Error('Missing Supabase configuration');
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (authError || !user) {
    console.error('Authentication failed:', authError);
    throw new Error('Authentication failed');
  }

  return user;
}
