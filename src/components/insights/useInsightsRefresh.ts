
import { useState } from 'react';
import { AIInsight } from './types';
import { generateSEOInsights } from './seoInsightsGenerator';
import { useSEOContext } from '@/context/SEOContext';
import { useGlobalWebsite } from '@/context/GlobalWebsiteContext';

export const useInsightsRefresh = (initialInsights: AIInsight[]) => {
  const [insights, setInsights] = useState<AIInsight[]>(initialInsights);
  const [isLoading, setIsLoading] = useState(false);
  const { seoState } = useSEOContext();
  const { selectedWebsite } = useGlobalWebsite();

  const handleRefresh = async () => {
    setIsLoading(true);
    console.log('Refreshing AI insights with real data...');
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newInsights: AIInsight[] = [];
    
    // Generate SEO insights from real data
    if (selectedWebsite && seoState.serpKeywords.length > 0) {
      const seoInsights = generateSEOInsights(
        seoState.serpKeywords,
        seoState.serpStats,
        selectedWebsite
      );
      newInsights.push(...seoInsights);
    }

    // Add other non-campaign insights
    const otherInsights = initialInsights.filter(insight => 
      !insight.description.toLowerCase().includes('campaign') &&
      !insight.description.toLowerCase().includes('ad spend') &&
      !insight.description.toLowerCase().includes('roas')
    );

    // Combine SEO insights with other insights, prioritizing SEO
    const combinedInsights = [...newInsights, ...otherInsights].slice(0, 5);
    
    setInsights(combinedInsights);
    setIsLoading(false);
    
    console.log(`Generated ${newInsights.length} SEO insights for ${selectedWebsite}`);
  };

  return {
    insights,
    isLoading,
    handleRefresh
  };
};
