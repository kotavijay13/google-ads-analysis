
import type { KeywordData, OverviewStats } from './types.ts';

export function calculateEnhancedStats(keywords: KeywordData[], enhanced: boolean = false): OverviewStats {
  const totalKeywords = keywords.length;
  const top10Keywords = keywords.filter(k => k.position <= 10).length;
  const top3Keywords = keywords.filter(k => k.position <= 3).length;
  const avgPosition = totalKeywords > 0 ? 
    (keywords.reduce((acc, k) => acc + k.position, 0) / totalKeywords).toFixed(1) : '0.0';
  const estTraffic = keywords.reduce((acc, k) => acc + k.estimatedVisits, 0);
  
  const baseStats: OverviewStats = {
    totalKeywords,
    top10Keywords,
    avgPosition,
    estTraffic
  };
  
  if (enhanced) {
    return {
      ...baseStats,
      top3Keywords,
      visibilityScore: Math.round((top10Keywords / totalKeywords) * 100),
      competitionLevel: avgPosition < 20 ? 'High' : avgPosition < 40 ? 'Medium' : 'Low',
      totalPages: Math.floor(keywords.length * 0.8), // Assume 80% of keywords have dedicated pages
      topPerformingPages: keywords.slice(0, 10).map(k => ({
        url: k.landingUrl,
        traffic: k.estimatedVisits,
        keywords: Math.floor(Math.random() * 20) + 5
      }))
    };
  }
  
  return baseStats;
}
