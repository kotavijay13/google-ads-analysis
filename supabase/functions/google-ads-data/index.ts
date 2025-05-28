
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../google-ads-auth/config.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface GoogleAdsDataRequest {
  accountId: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string;   // YYYY-MM-DD format
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Google Ads data fetch request received');
    
    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Authentication failed');
    }

    console.log('Authenticated user:', user.email);

    const requestBody: GoogleAdsDataRequest = await req.json();
    const { accountId, startDate, endDate } = requestBody;

    if (!accountId || !startDate || !endDate) {
      throw new Error('Missing required parameters: accountId, startDate, endDate');
    }

    console.log(`Fetching data for account ${accountId} from ${startDate} to ${endDate}`);

    // Get the user's Google access token
    const { data: tokenData, error: tokenError } = await supabase
      .from('api_tokens')
      .select('access_token, expires_at')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .maybeSingle();

    if (tokenError || !tokenData) {
      console.error('Token error:', tokenError);
      throw new Error('Google Ads token not found. Please reconnect your account.');
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt <= now) {
      throw new Error('Google Ads token has expired. Please reconnect your account.');
    }

    const accessToken = tokenData.access_token;
    const developToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN');

    if (!developToken) {
      throw new Error('Google Ads Developer Token not configured');
    }

    console.log('Calling Google Ads API for campaign data...');

    // Fetch campaign performance data with error handling
    const campaignQuery = `
      SELECT 
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign 
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    `;

    let campaignData = { results: [] };
    let campaignError = null;

    try {
      const campaignResponse = await fetch(`https://googleads.googleapis.com/v17/customers/${accountId}/googleAds:searchStream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': developToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: campaignQuery
        })
      });

      if (!campaignResponse.ok) {
        const errorText = await campaignResponse.text();
        console.error('Campaign API error:', errorText);
        campaignError = `Google Ads API error: ${campaignResponse.status} - ${errorText}`;
      } else {
        campaignData = await campaignResponse.json();
        console.log('Campaign data received:', campaignData);
      }
    } catch (error) {
      console.error('Error fetching campaign data:', error);
      campaignError = `Failed to fetch campaign data: ${error.message}`;
    }

    // Fetch daily performance data with error handling
    const dailyQuery = `
      SELECT 
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign 
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    `;

    let dailyData = { results: [] };
    let dailyError = null;

    try {
      const dailyResponse = await fetch(`https://googleads.googleapis.com/v17/customers/${accountId}/googleAds:searchStream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': developToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: dailyQuery
        })
      });

      if (dailyResponse.ok) {
        dailyData = await dailyResponse.json();
        console.log('Daily data received:', dailyData);
      } else {
        const errorText = await dailyResponse.text();
        console.error('Daily API error:', errorText);
        dailyError = `Daily data fetch error: ${dailyResponse.status}`;
      }
    } catch (error) {
      console.error('Error fetching daily data:', error);
      dailyError = `Failed to fetch daily data: ${error.message}`;
    }

    // Process and transform the data with safety checks
    const campaigns = campaignData.results?.map((result: any) => ({
      id: result.campaign?.id || 'unknown',
      name: result.campaign?.name || 'Unnamed Campaign',
      status: result.campaign?.status || 'UNKNOWN',
      impressions: parseInt(result.metrics?.impressions || '0'),
      clicks: parseInt(result.metrics?.clicks || '0'),
      spend: (parseInt(result.metrics?.cost_micros || '0') / 1000000), // Convert micros to currency
      conversions: parseFloat(result.metrics?.conversions || '0'),
      ctr: parseFloat(result.metrics?.ctr || '0') * 100, // Convert to percentage
      cpc: (parseInt(result.metrics?.average_cpc || '0') / 1000000) // Convert micros to currency
    })) || [];

    // Process daily performance data with safety checks
    const dailyPerformance = dailyData.results?.map((result: any) => ({
      date: result.segments?.date || startDate,
      clicks: parseInt(result.metrics?.clicks || '0'),
      impressions: parseInt(result.metrics?.impressions || '0'),
      spend: (parseInt(result.metrics?.cost_micros || '0') / 1000000),
      conversions: parseFloat(result.metrics?.conversions || '0')
    })) || [];

    // Calculate overview metrics with safety checks
    const totalSpend = campaigns.reduce((sum, camp) => sum + (camp.spend || 0), 0);
    const totalClicks = campaigns.reduce((sum, camp) => sum + (camp.clicks || 0), 0);
    const totalImpressions = campaigns.reduce((sum, camp) => sum + (camp.impressions || 0), 0);
    const totalConversions = campaigns.reduce((sum, camp) => sum + (camp.conversions || 0), 0);

    const metrics = {
      totalSpend: totalSpend,
      totalClicks: totalClicks,
      totalImpressions: totalImpressions,
      totalConversions: totalConversions,
      avgCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      avgCpc: totalClicks > 0 ? totalSpend / totalClicks : 0,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      costPerConversion: totalConversions > 0 ? totalSpend / totalConversions : 0
    };

    console.log('Processed metrics:', metrics);

    const responseData = {
      campaigns,
      dailyPerformance,
      metrics,
      // Include any errors for debugging
      errors: {
        campaignError,
        dailyError
      },
      // Placeholder for other data types that will be implemented later
      keywords: [],
      adGroups: [],
      deviceData: [],
      geoData: [],
      adCopies: [],
      assets: []
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in google-ads-data function:', error);
    
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: 'Check the edge function logs for more information',
      campaigns: [],
      dailyPerformance: [],
      metrics: {
        totalSpend: 0,
        totalClicks: 0,
        totalImpressions: 0,
        totalConversions: 0,
        avgCtr: 0,
        avgCpc: 0,
        conversionRate: 0,
        costPerConversion: 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
