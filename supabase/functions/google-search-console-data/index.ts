
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, getEnvironmentVariables } from './config.ts';
import { authenticateUser, getAccessToken } from './auth.ts';
import { fetchKeywordsData, fetchPagesData, fetchUrlMetaData } from './gsc-api.ts';
import { calculateSitePerformance, calculateStats, formatWebsiteUrl, getDateRange } from './data-processor.ts';
import { GSCResponse } from './types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { supabaseUrl, supabaseKey, clientId, clientSecret } = getEnvironmentVariables();
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Missing Supabase configuration');
    }
    
    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    const { user, supabase } = await authenticateUser(authHeader, supabaseUrl, supabaseKey);

    console.log(`Processing GSC data request for user: ${user.email}`);

    const { websiteUrl, startDate, endDate } = await req.json();
    
    if (!websiteUrl) {
      console.error('Website URL is required');
      throw new Error('Website URL is required');
    }

    console.log(`Fetching GSC data for website: ${websiteUrl}`);

    // Get the user's Google Search Console access token
    const accessToken = await getAccessToken(supabase, user.id, clientId!, clientSecret!);

    // Ensure website URL starts with https://
    const formattedWebsiteUrl = formatWebsiteUrl(websiteUrl);
    console.log(`Using formatted URL: ${formattedWebsiteUrl}`);

    const { baseStartDate, baseEndDate } = getDateRange(startDate, endDate);
    console.log(`Date range: ${baseStartDate} to ${baseEndDate}`);

    // Fetch all data in parallel for better performance
    const [keywords, pages] = await Promise.all([
      fetchKeywordsData(formattedWebsiteUrl, accessToken, baseStartDate, baseEndDate),
      fetchPagesData(formattedWebsiteUrl, accessToken, baseStartDate, baseEndDate)
    ]);

    // Fetch URL meta data for top pages
    const urlMetaData = await fetchUrlMetaData(pages, formattedWebsiteUrl, accessToken);

    // Calculate site performance and stats
    const sitePerformance = calculateSitePerformance(urlMetaData, pages);
    const stats = calculateStats(keywords, pages, baseStartDate, baseEndDate);

    console.log(`Successfully processed GSC data:
    - Keywords: ${keywords.length}
    - Pages: ${pages.length}
    - URL Meta Data: ${urlMetaData.length}
    - Total Clicks: ${stats.totalClicks}
    - Total Impressions: ${stats.totalImpressions}`);

    const response: GSCResponse = {
      success: true,
      keywords,
      pages,
      urlMetaData,
      sitePerformance,
      stats
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in google-search-console-data function:', error);
    
    const errorResponse: GSCResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      keywords: [],
      pages: [],
      urlMetaData: [],
      sitePerformance: {
        totalPages: 0,
        indexedPages: 0,
        crawlErrors: 0,
        avgLoadTime: '0ms',
        mobileUsability: 'Unknown',
        coreWebVitals: {
          lcp: '0s',
          fid: '0ms',
          cls: '0'
        }
      },
      stats: {
        totalKeywords: 0,
        top10Keywords: 0,
        top3Keywords: 0,
        avgPosition: '0.0',
        totalClicks: 0,
        totalImpressions: 0,
        avgCTR: '0.0',
        estTraffic: 0,
        totalPages: 0,
        topPerformingPages: [],
        dateRange: {
          startDate: '',
          endDate: ''
        }
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
