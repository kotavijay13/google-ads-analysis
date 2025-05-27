
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleGetClientId, handleExchangeCode } from './handlers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`Received ${req.method} request to Google Ads auth function`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let requestData: any = {};
    
    // Try to parse JSON body if present
    try {
      const body = await req.text();
      if (body) {
        requestData = JSON.parse(body);
        console.log('Parsed request data:', { action: requestData.action, hasCode: !!requestData.code });
      }
    } catch (error) {
      console.log('No JSON body or failed to parse:', error.message);
    }
    
    const { action, code, redirectUri } = requestData;
    
    // Handle getting client ID
    if (action === 'get_client_id') {
      console.log('Handling get_client_id request');
      const response = await handleGetClientId();
      return new Response(response.body, { 
        status: response.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Handle token exchange
    if (action === 'exchange_code') {
      console.log('Handling exchange_code request');
      const response = await handleExchangeCode(req, { code, redirectUri });
      return new Response(response.body, { 
        status: response.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Default case for unknown actions
    console.log('Unknown action received:', action);
    return new Response(
      JSON.stringify({ error: 'Unknown action', received: action }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in Google Ads auth function:', error);
    
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
