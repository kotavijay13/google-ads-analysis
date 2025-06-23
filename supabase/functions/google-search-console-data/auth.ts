
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const authenticateUser = async (authHeader: string | null, supabaseUrl: string, supabaseKey: string) => {
  if (!authHeader) {
    console.error('No authorization header provided');
    throw new Error('No authorization header');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (authError || !user) {
    console.error('Authentication failed:', authError);
    throw new Error('Authentication failed');
  }

  return { user, supabase };
};

export const getAccessToken = async (supabase: any, userId: string, clientId: string, clientSecret: string) => {
  const { data: tokenData, error: tokenError } = await supabase
    .from('api_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', userId)
    .eq('provider', 'google_search_console')
    .maybeSingle();

  if (tokenError) {
    console.error('Token query error:', tokenError);
    throw new Error('Error fetching token data');
  }

  if (!tokenData) {
    console.error('No Google Search Console token found for user');
    throw new Error('Google Search Console token not found. Please reconnect your account.');
  }

  console.log(`Token found, expires at: ${tokenData.expires_at}`);

  let accessToken = tokenData.access_token;

  // Check if token is expired and refresh if needed
  const now = new Date();
  const expiresAt = new Date(tokenData.expires_at);
  if (expiresAt <= now && tokenData.refresh_token) {
    console.log('Token expired, refreshing...');
    
    if (!clientId || !clientSecret) {
      console.error('Google OAuth credentials not configured');
      throw new Error('Google OAuth credentials not configured');
    }

    const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: tokenData.refresh_token,
        grant_type: 'refresh_token'
      }),
    });

    const refreshData = await refreshResponse.json();
    
    if (!refreshResponse.ok) {
      console.error('Token refresh failed:', refreshData);
      throw new Error('Failed to refresh Google Search Console token. Please reconnect your account.');
    }

    accessToken = refreshData.access_token;
    
    // Update the token in database
    const newExpiresAt = new Date();
    newExpiresAt.setSeconds(newExpiresAt.getSeconds() + (refreshData.expires_in || 3600));
    
    await supabase
      .from('api_tokens')
      .update({
        access_token: accessToken,
        expires_at: newExpiresAt.toISOString(),
      })
      .eq('user_id', userId)
      .eq('provider', 'google_search_console');

    console.log('Token refreshed successfully');
  }

  return accessToken;
};
