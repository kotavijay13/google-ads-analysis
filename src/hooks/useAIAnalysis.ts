
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  channel: 'seo' | 'google-ads' | 'meta-ads' | 'leads' | 'cross-channel';
  impact: string;
  action: string;
}

interface AnalysisData {
  seoData?: any;
  googleAdsData?: any;
  metaAdsData?: any;
  leadsData?: any;
}

export const useAIAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async (website: string, data: AnalysisData) => {
    if (!website) {
      setError('Website selection is required for AI analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log('Generating AI insights for website:', website);
      console.log('Analysis data:', data);

      const { data: result, error: functionError } = await supabase.functions.invoke('ai-insights-analysis', {
        body: {
          website,
          seoData: data.seoData,
          googleAdsData: data.googleAdsData,
          metaAdsData: data.metaAdsData,
          leadsData: data.leadsData
        }
      });

      if (functionError) {
        throw new Error(`Analysis failed: ${functionError.message}`);
      }

      if (result?.success && result?.insights) {
        setInsights(result.insights);
        console.log('AI insights generated successfully:', result.insights);
      } else {
        throw new Error('Invalid response from AI analysis');
      }

    } catch (err) {
      console.error('Error generating AI insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate AI insights');
      
      // Fallback insights
      setInsights([
        {
          id: `fallback_${Date.now()}`,
          title: "Analysis Pending",
          description: `AI analysis for ${website} encountered an issue. Please ensure you have sufficient SEO data and try again. Make sure your website has GSC data available.`,
          priority: "medium",
          channel: "cross-channel",
          impact: "Comprehensive analysis will be available once data is properly loaded",
          action: "Check your Google Search Console connection and data availability, then retry AI analysis"
        }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    generateInsights,
    insights,
    isAnalyzing,
    error
  };
};
