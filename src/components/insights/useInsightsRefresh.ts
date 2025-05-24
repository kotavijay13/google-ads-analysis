
import { useState } from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { AIInsight } from './types';

export const useInsightsRefresh = (initialInsights: AIInsight[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>(initialInsights);

  const handleRefresh = async () => {
    setIsLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      console.log('Refreshing AI insights with latest data from all channels...');
      
      // Simulate new insights based on fresh data analysis
      const newInsights: AIInsight[] = [
        {
          id: Math.random().toString(),
          title: "Boost budget for high-performing Summer Sale campaign",
          description: "ROI increased 23% this week, scale opportunity detected",
          impact: 'High Impact',
          source: 'Google Ads',
          icon: TrendingUp,
          actionable: true
        },
        {
          id: Math.random().toString(),
          title: "Update ad copy for mobile users",
          description: "Mobile CTR 15% lower than desktop, creative refresh needed",
          impact: 'Medium Impact',
          source: 'Meta Ads',
          icon: AlertTriangle,
          actionable: true
        },
        ...insights.slice(2, 5)
      ];
      
      setInsights(newInsights);
      setIsLoading(false);
    }, 2000);
  };

  return { insights, isLoading, handleRefresh };
};
