
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Missing Supabase configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Authentication failed:', authError);
      throw new Error('Authentication failed');
    }

    // Parse request body with better error handling
    let requestBody;
    try {
      const contentType = req.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        requestBody = await req.json();
      } else {
        // Try to read as text first
        const bodyText = await req.text();
        console.log('Raw body text:', bodyText);
        
        if (bodyText) {
          try {
            requestBody = JSON.parse(bodyText);
          } catch (parseError) {
            console.error('Failed to parse body as JSON:', parseError);
            throw new Error('Invalid JSON format');
          }
        } else {
          throw new Error('Empty request body');
        }
      }
      
      console.log('Parsed request body:', requestBody);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(JSON.stringify({
        success: false,
        error: `Request parsing failed: ${error.message}`,
        metaData: []
      }), {
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
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`Scraping meta data for ${urls.length} URLs`);

    // Alternative: Use native scraping without external API if LinkPreview fails
    const scrapeWithNativeFetch = async (url: string) => {
      try {
        console.log(`Native scraping for: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const html = await response.text();
        
        // Extract meta data using regex
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i) ||
                         html.match(/<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\'][^>]*>/i);
        
        return {
          url: url,
          metaTitle: titleMatch ? titleMatch[1].trim() : 'No title found',
          metaDescription: descMatch ? descMatch[1].trim() : 'No description found',
          image: null,
          siteName: null,
          domain: new URL(url).hostname
        };
      } catch (error) {
        console.error(`Native scraping failed for ${url}:`, error);
        return {
          url: url,
          metaTitle: 'Error fetching',
          metaDescription: 'Error fetching',
          error: error.message
        };
      }
    };

    const metaDataResults = [];
    const batchSize = 5;
    const totalUrls = Math.min(urls.length, 50);
    
    for (let i = 0; i < totalUrls; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(totalUrls / batchSize)} (${batch.length} URLs)`);
      
      for (const url of batch) {
        try {
          let result;
          
          // Try LinkPreview API first if available
          if (LINKPREVIEW_API_KEY) {
            try {
              console.log(`Using LinkPreview API for: ${url}`);
              
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000);
              
              const linkPreviewResponse = await fetch(
                `https://api.linkpreview.net/?key=${LINKPREVIEW_API_KEY}&q=${encodeURIComponent(url)}`,
                { 
                  signal: controller.signal,
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)'
                  }
                }
              );
              
              clearTimeout(timeoutId);
              
              if (!linkPreviewResponse.ok) {
                throw new Error(`LinkPreview API error: ${linkPreviewResponse.status}`);
              }

              const linkPreviewData = await linkPreviewResponse.json();
              
              result = {
                url: url,
                metaTitle: linkPreviewData.title || 'No title found',
                metaDescription: linkPreviewData.description || 'No description found',
                image: linkPreviewData.image || null,
                siteName: linkPreviewData.siteName || null,
                domain: linkPreviewData.domain || null
              };
            } catch (linkPreviewError) {
              console.log(`LinkPreview failed for ${url}, trying native scraping:`, linkPreviewError);
              result = await scrapeWithNativeFetch(url);
            }
          } else {
            console.log('No LinkPreview API key, using native scraping');
            result = await scrapeWithNativeFetch(url);
          }
          
          metaDataResults.push(result);
          
          // Add delay between requests
          await new Promise(resolve => setTimeout(resolve, 300));
          
        } catch (error) {
          console.error(`Error processing ${url}:`, error);
          metaDataResults.push({
            url: url,
            metaTitle: 'Error fetching',
            metaDescription: 'Error fetching',
            error: error.message
          });
        }
      }
      
      // Add longer delay between batches
      if (i + batchSize < totalUrls) {
        console.log('Waiting between batches...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Successfully processed meta data for ${metaDataResults.length} URLs`);

    return new Response(JSON.stringify({
      success: true,
      metaData: metaDataResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in scrape-meta-data function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metaData: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
