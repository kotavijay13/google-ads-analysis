
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from './utils.ts';
import { authenticateUser } from './auth.ts';

const handleRequest = async (req: Request) => {
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
    let requestBody: { urls: string[] };
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
          error: 'Empty request body - no URLs provided',
          results: []
        }), {
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
        error: `Request parsing failed: ${parseError.message}`,
        results: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const { urls } = requestBody;
    
    if (!urls || !Array.isArray(urls)) {
      console.error('Invalid urls parameter:', urls);
      return new Response(JSON.stringify({
        error: 'URLs array is required and must be an array',
        results: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (urls.length === 0) {
      console.log('Empty URLs array provided');
      return new Response(JSON.stringify({
        results: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log(`Scraping meta data for ${urls.length} URLs`);

    // Process URLs in parallel with rate limiting
    const results = await Promise.all(urls.map(async (url) => {
      try {
        console.log(`Processing URL: ${url}`);
        
        // Validate URL
        try {
          new URL(url);
        } catch {
          throw new Error('Invalid URL format');
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MetaScraper/1.0; +https://yourapp.com/bot)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          }
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        
        const html = await response.text();
        const meta = extractMetaFromHtml(html, url);
        const images = extractImagesFromHtml(html, url);
        
        return {
          url,
          metaTitle: meta.title,
          metaDescription: meta.description,
          siteName: null,
          domain: new URL(url).hostname,
          images: images,
          imageCount: images.length,
          imagesWithoutAlt: images.filter(img => !img.hasAltText).length,
          status: 'success'
        };
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        return {
          url,
          metaTitle: 'Error fetching',
          metaDescription: 'Error fetching',
          error: error.message,
          images: [],
          imageCount: 0,
          imagesWithoutAlt: 0,
          domain: (() => {
            try {
              return new URL(url).hostname;
            } catch {
              return 'Invalid URL';
            }
          })(),
          status: 'failed'
        };
      }
    }));

    console.log(`Successfully processed meta data for ${results.length} URLs`);

    return new Response(JSON.stringify({
      success: true,
      metaData: results
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
};

// Helper functions
function extractMetaFromHtml(html: string, url: string) {
  // Extract meta data using regex
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i) ||
                   html.match(/<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\'][^>]*>/i);

  return {
    title: titleMatch ? titleMatch[1].trim() : 'No title found',
    description: descMatch ? descMatch[1].trim() : 'No description found'
  };
}

function extractImagesFromHtml(html: string, url: string) {
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

  return images;
}

serve(handleRequest);
