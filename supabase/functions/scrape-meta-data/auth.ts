
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const authenticateUser = async (req: Request) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration');
    throw new Error('Missing Supabase configuration');
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get user from JWT token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.error('No authorization header provided');
    throw new Error('No authorization header');
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (authError || !user) {
    console.error('Authentication failed:', authError);
    throw new Error('Authentication failed');
  }

  return user;
};
