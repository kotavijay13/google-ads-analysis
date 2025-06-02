
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

    // Parse request body - handle both direct JSON and stringified JSON
    let requestBody;
    try {
      const bodyText = await req.text();
      console.log('Raw request body:', bodyText);
      
      if (!bodyText || bodyText.trim() === '') {
        throw new Error('Request body is empty');
      }
      
      // Try to parse as JSON
      try {
        requestBody = JSON.parse(bodyText);
      } catch (parseError) {
        // If it fails, maybe it's already an object (from Supabase invoke)
        console.log('JSON parse failed, trying alternative parsing...');
        requestBody = bodyText;
      }
    } catch (error) {
      console.error('Error reading request body:', error);
      throw new Error('Failed to read request body');
    }

    console.log('Parsed request body:', requestBody);

    const { urls } = requestBody;
    
    if (!urls || !Array.isArray(urls)) {
      console.error('Invalid urls parameter:', urls);
      throw new Error('URLs array is required');
    }

    if (!LINKPREVIEW_API_KEY) {
      console.error('LinkPreview API key is not configured');
      throw new Error('LinkPreview API key is not configured. Please add the LINKPREVIEW_API_KEY to your Supabase Edge Function secrets.');
    }

    console.log(`Scraping meta data for ${urls.length} URLs`);

    const metaDataResults = [];

    // Process URLs in smaller batches to avoid timeouts
    const batchSize = 5; // Reduced batch size further
    const totalUrls = Math.min(urls.length, 50); // Reduce total URLs to process
    
    for (let i = 0; i < totalUrls; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(totalUrls / batchSize)} (${batch.length} URLs)`);
      
      for (const url of batch) {
        try {
          console.log(`Scraping meta data for: ${url}`);
          
          // Add timeout to the fetch request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
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
            if (linkPreviewResponse.status === 429) {
              console.log(`Rate limit hit for ${url}, skipping...`);
              continue;
            }
            console.error(`LinkPreview API error for ${url}: ${linkPreviewResponse.status}`);
            metaDataResults.push({
              url: url,
              metaTitle: 'Error fetching',
              metaDescription: 'Error fetching',
              error: `HTTP ${linkPreviewResponse.status}`
            });
            continue;
          }

          const linkPreviewData = await linkPreviewResponse.json();
          
          metaDataResults.push({
            url: url,
            metaTitle: linkPreviewData.title || 'No title found',
            metaDescription: linkPreviewData.description || 'No description found',
            image: linkPreviewData.image || null,
            siteName: linkPreviewData.siteName || null,
            domain: linkPreviewData.domain || null
          });

          // Add a small delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.error(`Error scraping ${url}:`, error);
          metaDataResults.push({
            url: url,
            metaTitle: 'Error fetching',
            metaDescription: 'Error fetching',
            error: error.message
          });
        }
      }
      
      // Add a longer delay between batches
      if (i + batchSize < totalUrls) {
        console.log('Waiting between batches...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Successfully scraped meta data for ${metaDataResults.length} URLs`);

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
