
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

    // Parse request body with improved handling
    let requestBody;
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

    console.log(`Scraping meta data and images for ${urls.length} URLs`);

    // Enhanced scraping function that includes image extraction
    const scrapeWithNativeFetch = async (url: string) => {
      try {
        console.log(`Native scraping for: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
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
        
        // Extract all images with alt text
        const imageRegex = /<img[^>]*>/gi;
        const images = [];
        let imageMatch;
        
        while ((imageMatch = imageRegex.exec(html)) !== null) {
          const imgTag = imageMatch[0];
          
          // Extract src
          const srcMatch = imgTag.match(/src=["\']([^"\']*)["\'][^>]*/i);
          const src = srcMatch ? srcMatch[1] : null;
          
          // Extract alt text
          const altMatch = imgTag.match(/alt=["\']([^"\']*)["\'][^>]*/i);
          const alt = altMatch ? altMatch[1] : '';
          
          if (src) {
            // Convert relative URLs to absolute
            let absoluteSrc = src;
            if (src.startsWith('/')) {
              const urlObj = new URL(url);
              absoluteSrc = `${urlObj.protocol}//${urlObj.host}${src}`;
            } else if (!src.startsWith('http')) {
              const urlObj = new URL(url);
              absoluteSrc = `${urlObj.protocol}//${urlObj.host}/${src}`;
            }
            
            images.push({
              src: absoluteSrc,
              alt: alt || 'No alt text',
              hasAltText: alt.length > 0
            });
          }
        }
        
        return {
          url: url,
          metaTitle: titleMatch ? titleMatch[1].trim() : 'No title found',
          metaDescription: descMatch ? descMatch[1].trim() : 'No description found',
          image: null,
          siteName: null,
          domain: new URL(url).hostname,
          images: images,
          imageCount: images.length,
          imagesWithoutAlt: images.filter(img => !img.hasAltText).length
        };
      } catch (error) {
        console.error(`Native scraping failed for ${url}:`, error);
        return {
          url: url,
          metaTitle: 'Error fetching',
          metaDescription: 'Error fetching',
          error: error.message,
          images: [],
          imageCount: 0,
          imagesWithoutAlt: 0
        };
      }
    };

    const metaDataResults = [];
    const batchSize = 3; // Reduced batch size for better reliability
    const totalUrls = Math.min(urls.length, 500);
    
    for (let i = 0; i < totalUrls; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(totalUrls / batchSize)} (${batch.length} URLs)`);
      
      const batchPromises = batch.map(async (url) => {
        try {
          let result;
          
          // Try LinkPreview API first if available
          if (LINKPREVIEW_API_KEY) {
            try {
              console.log(`Using LinkPreview API for: ${url}`);
              
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 10000);
              
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
              
              // Still need to scrape images separately
              const imageData = await scrapeWithNativeFetch(url);
              
              result = {
                url: url,
                metaTitle: linkPreviewData.title || 'No title found',
                metaDescription: linkPreviewData.description || 'No description found',
                image: linkPreviewData.image || null,
                siteName: linkPreviewData.siteName || null,
                domain: linkPreviewData.domain || new URL(url).hostname,
                images: imageData.images || [],
                imageCount: imageData.imageCount || 0,
                imagesWithoutAlt: imageData.imagesWithoutAlt || 0
              };
            } catch (linkPreviewError) {
              console.log(`LinkPreview failed for ${url}, trying native scraping:`, linkPreviewError);
              result = await scrapeWithNativeFetch(url);
            }
          } else {
            console.log('No LinkPreview API key, using native scraping');
            result = await scrapeWithNativeFetch(url);
          }
          
          return result;
          
        } catch (error) {
          console.error(`Error processing ${url}:`, error);
          return {
            url: url,
            metaTitle: 'Error fetching',
            metaDescription: 'Error fetching',
            error: error.message,
            images: [],
            imageCount: 0,
            imagesWithoutAlt: 0
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      metaDataResults.push(...batchResults);
      
      // Add delay between batches
      if (i + batchSize < totalUrls) {
        console.log('Waiting between batches...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`Successfully processed meta data and images for ${metaDataResults.length} URLs`);

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
