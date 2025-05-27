
export interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  supabaseUrl: string;
  supabaseKey: string;
  developToken?: string;
}

export function validateConfig(): GoogleAdsConfig {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!clientId) {
    throw new Error('Google Client ID not configured in environment variables');
  }
  
  if (!clientSecret) {
    throw new Error('Google Client Secret not configured in environment variables');
  }
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }
  
  return {
    clientId,
    clientSecret,
    supabaseUrl,
    supabaseKey,
    developToken: Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN'),
  };
}
