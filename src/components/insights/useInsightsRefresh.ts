import { useState, useCallback } from 'react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useSEOContext } from '@/context/SEOContext';
import { AIInsight } from './types';

export interface Insight {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  channel: 'seo' | 'google-ads' | 'meta-ads' | 'leads' | 'cross-channel';
  impact: string;
  action: string;
  recommendations?: {
    metaTitle?: string;
    metaDescription?: string;
    headerTags?: string[];
    keywordDensity?: string;
    internalLinks?: string[];
    externalLinks?: string[];
    technicalSeo?: string[];
  };
}

export interface Top5AIInsightsProps {
  onInsightCompleted?: (insightId: string) => void;
}

export const useInsightsRefresh = (initialInsights: any[]) => {
  const [insights, setInsights] = useState(initialInsights);
  const [isLoading, setIsLoading] = useState(false);
  const { generateInsights, insights: aiInsights, isAnalyzing, error } = useAIAnalysis();
  const { seoState } = useSEOContext();

  const handleRefresh = useCallback(async (website?: string) => {
    // Prevent multiple simultaneous calls
    if (isLoading || isAnalyzing) {
      console.log('AI insights already loading, skipping duplicate call');
      return;
    }

    setIsLoading(true);
    
    try {
      if (website && seoState.selectedWebsite) {
        console.log('Generating AI insights for:', website);
        
        // Prepare data for AI analysis
        const analysisData = {
          seoData: {
            totalKeywords: seoState.serpStats?.totalKeywords || 0,
            avgPosition: seoState.serpStats?.avgPosition || '0.0',
            totalClicks: seoState.serpStats?.totalClicks || 0,
            totalImpressions: seoState.serpStats?.totalImpressions || 0,
            avgCTR: seoState.serpStats?.avgCTR || 0,
            top10Keywords: seoState.serpStats?.top10Keywords || 0
          },
          googleAdsData: {
            totalSpend: 0, // Will be populated from actual Google Ads data
            totalClicks: 0,
            totalImpressions: 0,
            conversionRate: 0,
            avgCpc: 0
          },
          metaAdsData: {
            totalSpend: 0, // Will be populated from actual Meta Ads data
            totalReach: 0,
            totalEngagement: 0,
            costPerResult: 0,
            roas: 0
          },
          leadsData: {
            totalLeads: 0, // Will be populated from actual leads data
            conversionRate: 0,
            sources: []
          }
        };

        await generateInsights(website, analysisData);
      } else {
        // Fallback to mock insights if no website selected
        console.log('No website selected, using fallback insights');
        setInsights(initialInsights);
      }
    } catch (error) {
      console.error('Error refreshing insights:', error);
      setInsights(initialInsights);
    } finally {
      setIsLoading(false);
    }
  }, [generateInsights, seoState.selectedWebsite, seoState.serpStats, initialInsights, isLoading, isAnalyzing]);

  // Use AI insights when available, otherwise use initial insights
  const currentInsights = aiInsights.length > 0 ? aiInsights.map((insight: AIInsight) => ({
    ...insight,
    // Ensure all required properties exist
    id: insight.id || `insight_${Date.now()}`,
    title: insight.title || 'AI Insight',
    description: insight.description || 'Analysis available',
    priority: insight.priority || 'medium',
    channel: insight.channel || 'cross-channel',
    impact: insight.impact || 'Impact analysis available',
    action: insight.action || 'Review recommendation',
    recommendations: insight.recommendations || {}
  })) : insights;

  return {
    insights: currentInsights,
    isLoading: isLoading || isAnalyzing,
    handleRefresh,
    error
  };
};
