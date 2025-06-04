
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from './utils.ts';
import { authenticateUser } from './auth.ts';
import { processBatch } from './batchProcessor.ts';
import { ScrapeRequest, ScrapeResponse } from './types.ts';

const SCRAPERAPI_KEY = Deno.env.get('SCRAPERAPI_KEY');

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
    const authHeader = req.headers.get('Authorization');
    await authenticateUser(authHeader);

    // Parse request body with improved error handling
    let requestBody: ScrapeRequest;
    try {
      console.log('Request headers:', Object.fromEntries(req.headers.entries()));
      
      const bodyText = await req.text();
      console.log('Raw request body length:', bodyText.length);
      
      if (bodyText.length > 0) {
        console.log('Raw request body (first 500 chars):', bodyText.substring(0, 500));
      }
      
      if (!bodyText || bodyText.trim() === '') {
        console.error('Empty request body received');
        return new Response(JSON.stringify({
          success: false,
          error: 'Empty request body - no URLs provided',
          metaData: []
        } as ScrapeResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      requestBody = JSON.parse(bodyText);
      console.log('Successfully parsed request body');
      console.log('Request body keys:', Object.keys(requestBody));
      console.log('URLs array length:', requestBody.urls?.length || 0);
      
      if (requestBody.urls && requestBody.urls.length > 0) {
        console.log('First 3 URLs:', requestBody.urls.slice(0, 3));
      }
      
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(JSON.stringify({
        success: false,
        error: `Request parsing failed: ${parseError.message}`,
        metaData: []
      } as ScrapeResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const { urls } = requestBody;
    
    if (!urls || !Array.isArray(urls)) {
      console.error('Invalid urls parameter:', urls);
      return new Response(JSON.stringify({
        success: false,
        error: 'URLs array is required and must be an array',
        metaData: []
      } as ScrapeResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (urls.length === 0) {
      console.log('Empty URLs array provided');
      return new Response(JSON.stringify({
        success: true,
        metaData: []
      } as ScrapeResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log(`Scraping meta data for ${urls.length} URLs`);

    // Process URLs in batches
    const metaDataResults = await processBatch(urls, SCRAPERAPI_KEY);

    console.log(`Successfully processed meta data for ${metaDataResults.length} URLs`);

    return new Response(JSON.stringify({
      success: true,
      metaData: metaDataResults
    } as ScrapeResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in scrape-meta-data function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metaData: []
    } as ScrapeResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
