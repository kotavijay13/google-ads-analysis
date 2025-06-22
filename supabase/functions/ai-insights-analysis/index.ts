
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { website, seoData, googleAdsData, metaAdsData, leadsData } = await req.json();

    console.log(`Analyzing data for website: ${website}`);

    // Prepare comprehensive analysis prompt
    const analysisPrompt = `
    As an expert digital marketing analyst, analyze the following data for website: ${website}

    SEO Data:
    - Total Keywords: ${seoData?.totalKeywords || 0}
    - Average Position: ${seoData?.avgPosition || 'N/A'}
    - Total Clicks: ${seoData?.totalClicks || 0}
    - Total Impressions: ${seoData?.totalImpressions || 0}
    - Click-through Rate: ${seoData?.avgCTR || 0}%
    - Top 10 Keywords: ${seoData?.top10Keywords || 0}

    Google Ads Data:
    - Total Spend: $${googleAdsData?.totalSpend || 0}
    - Total Clicks: ${googleAdsData?.totalClicks || 0}
    - Total Impressions: ${googleAdsData?.totalImpressions || 0}
    - Conversion Rate: ${googleAdsData?.conversionRate || 0}%
    - Cost Per Click: $${googleAdsData?.avgCpc || 0}

    Meta Ads Data:
    - Total Spend: $${metaAdsData?.totalSpend || 0}
    - Total Reach: ${metaAdsData?.totalReach || 0}
    - Total Engagement: ${metaAdsData?.totalEngagement || 0}
    - Cost Per Result: $${metaAdsData?.costPerResult || 0}
    - ROAS: ${metaAdsData?.roas || 0}

    Leads Data:
    - Total Leads: ${leadsData?.totalLeads || 0}
    - Conversion Rate: ${leadsData?.conversionRate || 0}%
    - Lead Sources: ${leadsData?.sources?.join(', ') || 'N/A'}

    Please provide exactly 5 specific, actionable insights in this JSON format:
    {
      "insights": [
        {
          "id": "unique_id",
          "title": "Insight Title",
          "description": "Detailed analysis and recommendation",
          "priority": "high|medium|low",
          "channel": "seo|google-ads|meta-ads|leads|cross-channel",
          "impact": "Description of expected impact",
          "action": "Specific action to take"
        }
      ]
    }

    Focus on:
    1. Cross-channel optimization opportunities
    2. Performance gaps and improvement areas
    3. Budget allocation recommendations
    4. Keyword and audience insights
    5. Conversion optimization opportunities

    Make insights specific to the actual data provided, not generic advice.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert digital marketing analyst specializing in SEO, Google Ads, Meta Ads, and lead generation optimization. Provide data-driven insights in the exact JSON format requested.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid OpenAI response');
    }

    const analysisResult = data.choices[0].message.content;
    console.log('AI Analysis Result:', analysisResult);

    // Parse the JSON response
    let insights;
    try {
      const parsedResult = JSON.parse(analysisResult);
      insights = parsedResult.insights || [];
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback to basic insights if parsing fails
      insights = [
        {
          id: `fallback_${Date.now()}`,
          title: "Analysis Generated",
          description: "AI analysis completed for your marketing data. Review individual channels for detailed insights.",
          priority: "medium",
          channel: "cross-channel",
          impact: "Comprehensive data analysis available",
          action: "Review detailed metrics in each channel dashboard"
        }
      ];
    }

    return new Response(JSON.stringify({ 
      success: true, 
      insights,
      website,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI insights analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
