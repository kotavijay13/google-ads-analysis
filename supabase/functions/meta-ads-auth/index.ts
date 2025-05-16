
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
    const { code, redirectUri } = await req.json();
    
    // Get env variables
    const clientId = Deno.env.get('META_APP_ID');
    const clientSecret = Deno.env.get('META_APP_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    // Validate required data
    if (!code || !redirectUri || !clientId || !clientSecret || !supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Meta OAuth token error:', tokenData);
      return new Response(
        JSON.stringify({ error: tokenData.error?.message || 'Failed to get access token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Calculate token expiry time (if available, otherwise set to 60 days)
    const expiresAt = new Date();
    if (tokenData.expires_in) {
      expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 60); // Default to 60 days
    }
    
    // Store the token in Supabase
    const { data: tokenRecord, error: tokenError } = await supabase
      .from('api_tokens')
      .upsert({
        user_id: user.id,
        provider: 'meta',
        access_token: tokenData.access_token,
        // Meta typically doesn't provide refresh tokens with standard app auth flow
        expires_at: expiresAt.toISOString(),
      }, {
        onConflict: 'user_id,provider'
      })
      .select()
      .single();
    
    if (tokenError) {
      console.error('Error storing tokens:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to store access tokens' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch Meta Ad Accounts using the new token
    try {
      const metaAccountsUrl = 'https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id';
      const accountsResponse = await fetch(metaAccountsUrl, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        },
      });
      
      const accountsData = await accountsResponse.json();
      
      if (accountsResponse.ok && accountsData.data) {
        for (const account of accountsData.data) {
          await supabase
            .from('ad_accounts')
            .upsert({
              user_id: user.id,
              platform: 'meta',
              account_id: account.account_id || account.id.replace('act_', ''),
              account_name: account.name || `Meta Ad Account ${account.id}`,
            }, {
              onConflict: 'user_id,platform,account_id'
            });
        }
      }
    } catch (error) {
      console.error('Error fetching Meta ad accounts:', error);
      // We don't fail the whole operation if just the accounts fetch fails
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in Meta Ads auth:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
