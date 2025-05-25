
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, code, redirectUri } = await req.json();
    
    // Handle getting client ID
    if (action === 'get_client_id') {
      const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
      
      if (!clientId) {
        return new Response(
          JSON.stringify({ error: 'Google Client ID not configured in environment variables' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ clientId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Handle token exchange
    if (action === 'exchange_code') {
      // Get env variables
      const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
      const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      // Validate required data with detailed error messages
      if (!code) {
        return new Response(
          JSON.stringify({ error: 'Missing authorization code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!redirectUri) {
        return new Response(
          JSON.stringify({ error: 'Missing redirect URI' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!clientId) {
        return new Response(
          JSON.stringify({ error: 'Google Client ID not configured in environment variables' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!clientSecret) {
        return new Response(
          JSON.stringify({ error: 'Google Client Secret not configured in environment variables' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!supabaseUrl || !supabaseKey) {
        return new Response(
          JSON.stringify({ error: 'Supabase configuration missing' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Create a Supabase client with the service role key
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Get the user from the request
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Not authenticated' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: authError?.message || 'User not found' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`Exchanging code for tokens for user ${user.email}`);
      console.log(`Using redirect URI: ${redirectUri}`);
      console.log(`Using client ID: ${clientId.substring(0, 8)}...`);
      
      // Exchange the authorization code for access and refresh tokens
      const tokenRequestBody = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });
      
      console.log("Token request payload:", tokenRequestBody.toString());
      
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenRequestBody,
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok || !tokenData.access_token) {
        console.error('Google OAuth token error:', tokenData);
        return new Response(
          JSON.stringify({ 
            error: tokenData.error_description || tokenData.error || 'Failed to get access token',
            details: tokenData,
            status: tokenResponse.status,
            statusText: tokenResponse.statusText
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Successfully obtained access token');
      
      // Calculate token expiry time
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
      
      // Store the tokens in Supabase
      const { data: tokenRecord, error: tokenError } = await supabase
        .from('api_tokens')
        .upsert({
          user_id: user.id,
          provider: 'google',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt.toISOString(),
        }, {
          onConflict: 'user_id,provider'
        })
        .select()
        .single();
      
      if (tokenError) {
        console.error('Error storing tokens:', tokenError);
        return new Response(
          JSON.stringify({ error: 'Failed to store access tokens', details: tokenError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Fetch Google Ads accounts using the new token
      try {
        console.log('Attempting to fetch Google Ads accounts');
        
        // This is a simplified example - in a real app, you would use the Google Ads API with proper version path
        const googleAdsUrl = 'https://googleads.googleapis.com/v15/customers:listAccessibleCustomers';
        const developToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN');
        
        if (!developToken) {
          console.warn('Google Ads Developer Token not configured');
        }
        
        const accountsResponse = await fetch(googleAdsUrl, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'developer-token': developToken || '',
          },
        });
        
        const accountsData = await accountsResponse.json();
        
        if (accountsResponse.ok && accountsData.resourceNames) {
          // Format: customers/{customer_id}
          const customerIds = accountsData.resourceNames.map((name: string) => name.split('/')[1]);
          console.log(`Found ${customerIds.length} Google Ads accounts`);
          
          // Get account names - in a real app you would make additional API calls to get names
          // For simplicity, we'll just use IDs as names in this example
          for (const customerId of customerIds) {
            await supabase
              .from('ad_accounts')
              .upsert({
                user_id: user.id,
                platform: 'google',
                account_id: customerId,
                account_name: `Google Ads Account ${customerId}`, // In reality, you'd get the actual name
              }, {
                onConflict: 'user_id,platform,account_id'
              });
          }
        } else {
          console.error('Error fetching Google Ads accounts:', accountsData);
        }
      } catch (error) {
        console.error('Error fetching Google Ads accounts:', error);
        // We don't fail the whole operation if just the accounts fetch fails
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Default case for unknown actions
    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in Google Ads auth:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
