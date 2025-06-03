
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from './constants.ts';
import { authenticateUser } from './auth.ts';
import { parseRequestBody, validateRequestBody } from './requestParser.ts';
import { processUrls } from './metaDataProcessor.ts';
import { ResponseData } from './types.ts';

const LINKPREVIEW_API_KEY = Deno.env.get('LINKPREVIEW_API_KEY');

serve(async (req) => {
  console.log(`Request method: ${req.method}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    // Authenticate user
    await authenticateUser(req);

    // Parse and validate request body
    const requestBody = await parseRequestBody(req);
    validateRequestBody(requestBody);

    const { urls } = requestBody;
    console.log(`Scraping meta data for ${urls.length} URLs`);

    // Process URLs and extract meta data
    const metaDataResults = await processUrls(urls, LINKPREVIEW_API_KEY);

    console.log(`Successfully processed meta data for ${metaDataResults.length} URLs`);

    const response: ResponseData = {
      success: true,
      metaData: metaDataResults
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in scrape-meta-data function:', error);
    
    const errorResponse: ResponseData = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metaData: []
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message.includes('Request parsing failed') || 
             error.message.includes('URLs array is required') ? 400 : 500,
    });
  }
});
