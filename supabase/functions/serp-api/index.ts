
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SERP_API_KEY = Deno.env.get('SERP_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteUrl } = await req.json();
    
    if (!websiteUrl) {
      return new Response(
        JSON.stringify({ error: "Website URL is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!SERP_API_KEY) {
      console.error("SERP API key is not configured");
      return new Response(
        JSON.stringify({ error: "SERP API key is not configured. Please add the SERP_API_KEY to your Supabase Edge Function secrets." }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching SERP data for: ${websiteUrl}`);
    
    // Format the domain for API request (remove protocol, www, etc.)
    const domain = websiteUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    
    // Use the organic results endpoint for domain search
    const serpApiUrl = `https://serpapi.com/search.json?engine=google&q=site:${domain}&num=100&api_key=${SERP_API_KEY}`;
    
    const response = await fetch(serpApiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERP API error: ${response.status} ${response.statusText}`, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `SERP API returned an error: ${response.statusText}. Please check your API key or try again later.`
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    
    // Extract organic results and transform them into keywords data
    const organicResults = data.organic_results || [];
    
    // Generate stable data for keywords that won't change between refreshes
    const keywordData = organicResults.map((result, index) => {
      // Extract the primary keyword from the URL path or title
      const urlPath = new URL(result.link).pathname;
      const pathSegments = urlPath.split('/').filter(s => s.length > 0);
      
      // Get a keyword from either the URL path or a specific part of the title
      let keywordText = '';
      
      if (result.title) {
        // Use the first significant part of the title as the keyword
        const titleParts = result.title.split(/\s[-|]\s|\s[•]\s|\s[|]\s/);
        keywordText = titleParts[0].trim();
      } else if (pathSegments.length > 0) {
        // Use the last path segment and convert dashes to spaces
        keywordText = pathSegments[pathSegments.length - 1].replace(/-/g, ' ');
      } else {
        keywordText = `Keyword ${index + 1}`;
      }
      
      // Extract any snippet text that might contain valuable keyword info
      if (result.snippet && (!keywordText || keywordText === `Keyword ${index + 1}`)) {
        const snippetWords = result.snippet.split(' ').slice(0, 5).join(' ');
        keywordText = snippetWords;
      }
      
      // Generate deterministic values based on the URL and position to ensure consistency
      // Use the URL hash for consistent random values that won't change between refreshes
      const urlHash = [...result.link].reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const seedValue = (urlHash + index) % 1000;
      
      // Calculate a deterministic difficulty score (1-100)
      const difficulty = ((seedValue % 100) + 1);
      const difficultyLevel = difficulty > 70 ? "High" : difficulty > 40 ? "Medium" : "Low";
      
      // Generate a stable search volume
      const searchVolume = 500 + (seedValue % 10) * 500;
      
      // Calculate visits based on position and search volume with some deterministic variation
      const positionFactor = Math.max(0, (100 - Math.min(index + 1, 20) * 5) / 100);
      const estimatedVisits = Math.floor(searchVolume * positionFactor);
      
      // Generate stable change value
      const changeValue = (seedValue % 5) - 2;
      
      return {
        keyword: keywordText,
        position: index + 1,
        searchVolume: searchVolume,
        competitorUrl: result.link || websiteUrl,
        change: changeValue,
        estimatedVisits: estimatedVisits,
        difficulty: difficulty,
        difficultyLevel: difficultyLevel
      };
    });

    // Add overview stats based on the data
    const overviewStats = {
      totalKeywords: organicResults.length,
      top10Keywords: organicResults.slice(0, 10).length,
      avgPosition: organicResults.length > 0 
        ? ((organicResults.length + 1) / 2).toFixed(1) // Average position calculation
        : '0.0',
      estTraffic: keywordData.reduce((sum, keyword) => sum + keyword.estimatedVisits, 0)
    };
    
    return new Response(
      JSON.stringify({ 
        keywords: keywordData,
        stats: overviewStats
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error processing SERP request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: `An error occurred: ${error.message || "Unknown error"}`
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
