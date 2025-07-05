import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

import { corsHeaders, handleCorsPreflightRequest, createCorsResponse } from './cors.ts';
import { prepareAnalysisPrompt } from './dataProcessor.ts';
import { OpenAIClient } from './openaiClient.ts';
import { parseInsightsResponse } from './responseParser.ts';
import type { AnalysisRequest, AnalysisResponse } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  console.log('AI Insights Analysis function called, method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    console.log('Starting AI insights analysis...');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment');
      const errorResponse: AnalysisResponse = {
        error: 'OpenAI API key not configured. Please check your environment variables.',
        success: false 
      };
      return createCorsResponse(JSON.stringify(errorResponse), 500);
    }

    console.log('OpenAI API key found, proceeding...');

    const requestData: AnalysisRequest = await req.json();
    const { website, seoData, googleAdsData, metaAdsData, leadsData } = requestData;

    console.log(`Analyzing data for website: ${website}`);

    // Prepare analysis prompt with rich GSC data
    const analysisPrompt = prepareAnalysisPrompt(website, seoData);

    // Generate insights using OpenAI
    const openaiClient = new OpenAIClient(openAIApiKey);
    const analysisResult = await openaiClient.generateInsights(analysisPrompt);

    // Parse the response
    const insights = parseInsightsResponse(analysisResult);

    const response: AnalysisResponse = {
      success: true,
      insights,
      website,
      timestamp: new Date().toISOString()
    };

    return createCorsResponse(JSON.stringify(response));

  } catch (error) {
    console.error('Error in AI insights analysis:', error);
    const errorResponse: AnalysisResponse = {
      error: error.message,
      success: false 
    };
    return createCorsResponse(JSON.stringify(errorResponse), 500);
  }
});