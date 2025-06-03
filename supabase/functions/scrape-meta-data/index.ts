
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

    // Parse request body
    let requestBody: ScrapeRequest;
    try {
      const contentType = req.headers.get('content-type') || '';
      console.log('Content-Type header:', contentType);
      
      const bodyText = await req.text();
      console.log('Raw request body length:', bodyText.length);
      console.log('Raw request body (first 200 chars):', bodyText.substring(0, 200));
      
      if (!bodyText || bodyText.trim() === '') {
        console.error('Empty request body received');
        throw new Error('Empty request body');
      }
      
      requestBody = JSON.parse(bodyText);
      console.log('Successfully parsed request body with', Object.keys(requestBody).length, 'keys');
      console.log('URLs array length:', requestBody.urls?.length || 0);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(JSON.stringify({
        success: false,
        error: `Request parsing failed: ${error.message}`,
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
        error: 'URLs array is required',
        metaData: []
      } as ScrapeResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`Scraping meta data and images for ${urls.length} URLs`);

    // Process URLs in batches
    const metaDataResults = await processBatch(urls, SCRAPERAPI_KEY);

    console.log(`Successfully processed meta data and images for ${metaDataResults.length} URLs using ${SCRAPERAPI_KEY ? 'ScraperAPI' : 'native scraping'}`);

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
