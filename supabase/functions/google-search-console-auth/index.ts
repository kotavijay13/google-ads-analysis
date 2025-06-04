
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const action = requestData.action;
    
    // Get env variables
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    // Validate required configuration
    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing Google API credentials. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Supabase secrets.',
          details: { clientId: !!clientId, clientSecret: !!clientSecret }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Missing Supabase configuration' }),
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

    // Handle different actions
    if (action === 'get_client_id') {
      return new Response(
        JSON.stringify({ 
          clientId,
          success: true
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'exchange_code') {
      const { code, redirectUri } = requestData;
      
      // Validate required data
      if (!code || !redirectUri) {
        return new Response(
          JSON.stringify({ error: 'Missing code or redirectUri' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Exchange the authorization code for an access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        }),
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok || !tokenData.access_token) {
        console.error('Google OAuth token error:', tokenData);
        return new Response(
          JSON.stringify({ 
            error: tokenData.error_description || 'Failed to get access token',
            details: tokenData 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Calculate token expiry time
      const expiresAt = new Date();
      if (tokenData.expires_in) {
        expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
      } else {
        expiresAt.setDate(expiresAt.getDate() + 7); // Default to 7 days
      }
      
      // Store the token in Supabase
      const { data: tokenRecord, error: tokenError } = await supabase
        .from('api_tokens')
        .upsert({
          user_id: user.id,
          provider: 'google_search_console',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
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
      
      // Fetch Search Console properties using the new token
      try {
        const scResponse = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          },
        });
        
        const scData = await scResponse.json();
        
        if (scResponse.ok && scData.siteEntry) {
          for (const site of scData.siteEntry) {
            const siteUrl = site.siteUrl;
            const siteName = new URL(siteUrl).hostname;
            
            await supabase
              .from('ad_accounts')
              .upsert({
                user_id: user.id,
                platform: 'google_search_console',
                account_id: siteUrl,
                account_name: siteName,
              }, {
                onConflict: 'user_id,platform,account_id'
              });
          }
        } else {
          console.log('Search Console API response:', scData);
        }
      } catch (error) {
        console.error('Error fetching Search Console sites:', error);
        // We don't fail the whole operation if just the sites fetch fails
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Error in Google Search Console auth:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
