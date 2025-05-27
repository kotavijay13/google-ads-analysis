
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleGetClientId, handleExchangeCode } from './handlers.ts';

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
      const response = await handleGetClientId();
      return new Response(response.body, { 
        status: response.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Handle token exchange
    if (action === 'exchange_code') {
      const response = await handleExchangeCode(req, { code, redirectUri });
      return new Response(response.body, { 
        status: response.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Default case for unknown actions
    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in Google Ads auth:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    let errorResponse;
    
    try {
      // Try to parse as JSON first (for structured errors)
      errorResponse = JSON.parse(errorMessage);
    } catch {
      // If not JSON, treat as simple string
      errorResponse = { error: errorMessage };
    }
    
    return new Response(
      JSON.stringify(errorResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
