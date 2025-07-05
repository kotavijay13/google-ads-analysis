
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
  console.log('AI Insights Analysis function called, method:', req.method);
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting AI insights analysis...');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured. Please check your environment variables.',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('OpenAI API key found, proceeding...');

    const { website, seoData, googleAdsData, metaAdsData, leadsData } = await req.json();

    console.log(`Analyzing data for website: ${website}`);

    // Analyze the rich GSC data to provide specific insights
    const keywordsData = seoData?.keywords || [];
    const pagesData = seoData?.pages || [];
    const urlMetaData = seoData?.urlMetaData || [];
    
    console.log(`Analyzing rich GSC data: ${keywordsData.length} keywords, ${pagesData.length} pages, ${urlMetaData.length} meta entries`);

    // Prepare comprehensive analysis prompt with actual GSC data
    const analysisPrompt = `
    As an expert SEO analyst, analyze the following REAL Google Search Console data for website: ${website}

    KEYWORD ANALYSIS (${keywordsData.length} total keywords):
    ${keywordsData.slice(0, 20).map(k => 
      `- "${k.keyword}": Position ${k.position}, ${k.clicks} clicks, ${k.impressions} impressions, CTR ${k.ctr}%`
    ).join('\n')}

    PAGE PERFORMANCE (${pagesData.length} total pages):
    ${pagesData.slice(0, 15).map(p => 
      `- ${p.url}: ${p.clicks} clicks, ${p.impressions} impressions, Position ${p.position}, CTR ${p.ctr}%`
    ).join('\n')}

    META DATA ANALYSIS (${urlMetaData.length} pages analyzed):
    ${urlMetaData.slice(0, 10).map(u => 
      `- ${u.url}: Title: "${u.metaTitle || 'Missing'}", Description: "${u.metaDescription || 'Missing'}", Images: ${u.imageCount || 0} (${u.imagesWithoutAlt || 0} without alt)`
    ).join('\n')}

    SUMMARY STATS:
    - Total Keywords: ${seoData?.totalKeywords || 0}
    - Average Position: ${seoData?.avgPosition || 'N/A'}
    - Total Clicks: ${seoData?.totalClicks || 0}
    - Total Impressions: ${seoData?.totalImpressions || 0}
    - Click-through Rate: ${seoData?.avgCTR || 0}%
    - Top 10 Keywords: ${seoData?.top10Keywords || 0}
    - Top 3 Keywords: ${seoData?.top3Keywords || 0}

    Analyze this data and provide exactly 4-5 specific, actionable insights covering these categories:
    1. KEYWORD OPPORTUNITIES: Find underperforming keywords with high potential
    2. PAGE OPTIMIZATION: Identify top pages that need improvement or scaling
    3. META DATA ISSUES: Find missing or poorly optimized titles/descriptions
    4. TECHNICAL SEO: Identify image, crawling, or indexing issues
    5. CONTENT STRATEGY: Suggest content improvements based on performance

    Return insights in this JSON format:
    {
      "insights": [
        {
          "id": "unique_id",
          "title": "Insight Title",
          "description": "Detailed analysis and specific recommendations",
          "priority": "high|medium|low",
          "channel": "seo|google-ads|meta-ads|leads|cross-channel",
          "impact": "Description of expected impact",
          "action": "Specific action to take",
          "recommendations": {
            "metaTitle": "Exact meta title recommendation (if applicable)",
            "metaDescription": "Exact meta description recommendation (if applicable)",
            "headerTags": ["H1: Exact H1 recommendation", "H2: Exact H2 recommendations"],
            "keywordDensity": "Target keyword density percentage and keywords",
            "internalLinks": ["Specific internal linking suggestions"],
            "externalLinks": ["Specific external linking suggestions"],
            "technicalSeo": ["Specific technical SEO improvements"]
          }
        }
      ]
    }

    For SEO insights, provide EXACT recommendations:
    - Specific meta titles (50-60 characters)
    - Specific meta descriptions (150-160 characters)
    - Exact H1/H2/H3 tag suggestions
    - Target keyword density percentages
    - Specific internal linking opportunities
    - Relevant external link suggestions
    - Technical SEO improvements

    Focus on actionable, specific recommendations rather than generic advice. Use actual data from ${website} to make recommendations.
    `;

    console.log('Making OpenAI API call...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert digital marketing analyst specializing in SEO, Google Ads, Meta Ads, and lead generation optimization. Provide data-driven insights in the exact JSON format requested.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log('OpenAI API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

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
      
      // Ensure each insight has required properties
      insights = insights.map((insight: any) => ({
        id: insight.id || `ai_${Date.now()}_${Math.random()}`,
        title: insight.title || 'AI Insight',
        description: insight.description || 'Analysis completed',
        priority: insight.priority || 'medium',
        channel: insight.channel || 'cross-channel',
        impact: insight.impact || 'Analysis impact available',
        action: insight.action || 'Review recommendation',
        recommendations: insight.recommendations || {}
      }));
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
          action: "Review detailed metrics in each channel dashboard",
          recommendations: {}
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
