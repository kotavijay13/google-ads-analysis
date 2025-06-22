
import { AIInsight } from './types';
import { TrendingUp, TrendingDown, AlertTriangle, Search, Target, Zap } from 'lucide-react';

export const generateSEOInsights = (
  serpKeywords: any[],
  serpStats: any,
  selectedWebsite: string
): AIInsight[] => {
  if (!selectedWebsite || serpKeywords.length === 0) {
    return [];
  }

  const insights: AIInsight[] = [];

  // Analyze average position
  const avgPosition = parseFloat(serpStats.avgPosition);
  if (avgPosition > 10) {
    insights.push({
      id: `seo-avg-position-${Date.now()}`,
      title: 'Improve Search Rankings',
      description: `Your average position is ${avgPosition.toFixed(1)}. Focus on optimizing your top ${Math.min(10, serpKeywords.length)} keywords to move into the first page of search results.`,
      impact: 'High Impact',
      source: 'SEO',
      icon: TrendingUp,
      actionable: true
    });
  }

  // Analyze top performing keywords
  const top3Keywords = serpKeywords.filter(k => parseFloat(k.position) <= 3).length;
  const top10Keywords = serpKeywords.filter(k => parseFloat(k.position) <= 10).length;
  
  if (top3Keywords < top10Keywords * 0.3) {
    insights.push({
      id: `seo-top-keywords-${Date.now()}`,
      title: 'Optimize Top 10 Keywords',
      description: `You have ${top10Keywords} keywords in top 10, but only ${top3Keywords} in top 3. Focus on improving content quality and user engagement for your top-ranking keywords.`,
      impact: 'Medium Impact',
      source: 'SEO',
      icon: Target,
      actionable: true
    });
  }

  // Analyze CTR performance
  const avgCTR = parseFloat(serpStats.avgCTR);
  if (avgCTR < 2.0) {
    insights.push({
      id: `seo-ctr-${Date.now()}`,
      title: 'Improve Click-Through Rate',
      description: `Your average CTR is ${avgCTR.toFixed(1)}%. Optimize your meta titles and descriptions to be more compelling and include relevant keywords.`,
      impact: 'High Impact',
      source: 'SEO',
      icon: Zap,
      actionable: true
    });
  }

  // Analyze keyword opportunities
  const lowPositionHighImpressions = serpKeywords.filter(k => 
    parseFloat(k.position) > 10 && k.impressions > 100
  );
  
  if (lowPositionHighImpressions.length > 0) {
    insights.push({
      id: `seo-opportunities-${Date.now()}`,
      title: 'Keyword Ranking Opportunities',
      description: `${lowPositionHighImpressions.length} keywords have high impressions but rank below position 10. These represent quick win opportunities for traffic growth.`,
      impact: 'Medium Impact',
      source: 'SEO',
      icon: Search,
      actionable: true
    });
  }

  // Traffic loss analysis
  const totalClicks = serpStats.totalClicks;
  const totalImpressions = serpStats.totalImpressions;
  const potentialClicks = Math.round(totalImpressions * 0.03); // Assuming 3% as good CTR
  
  if (totalClicks < potentialClicks * 0.7) {
    insights.push({
      id: `seo-traffic-loss-${Date.now()}`,
      title: 'Significant Traffic Loss Opportunity',
      description: `You're potentially missing ${potentialClicks - totalClicks} clicks monthly. Focus on improving rankings for high-impression keywords and optimizing meta descriptions.`,
      impact: 'High Impact',
      source: 'SEO',
      icon: AlertTriangle,
      actionable: true
    });
  }

  return insights.slice(0, 2); // Return top 2 SEO insights
};
