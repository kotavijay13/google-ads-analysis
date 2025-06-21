
import { RankingBreakdown } from './types';

export const calculateRankingBreakdown = (keywords: any[]): RankingBreakdown => {
  const breakdown: RankingBreakdown = {
    top3: 0,
    top5: 0,
    top10: 0,
    top50: 0,
    top100: 0,
    notRanking: 0
  };

  keywords.forEach(keyword => {
    const position = parseFloat(keyword.position);
    
    if (position <= 3) {
      breakdown.top3++;
    } else if (position <= 5) {
      breakdown.top5++;
    } else if (position <= 10) {
      breakdown.top10++;
    } else if (position <= 50) {
      breakdown.top50++;
    } else if (position <= 100) {
      breakdown.top100++;
    } else {
      breakdown.notRanking++;
    }
  });

  return breakdown;
};

export const createChartData = (breakdown: RankingBreakdown) => {
  return [
    { name: 'Top 3', value: breakdown.top3, color: '#10b981' },
    { name: 'Top 5', value: breakdown.top5, color: '#f59e0b' },
    { name: 'Top 10', value: breakdown.top10, color: '#3b82f6' },
    { name: 'Top 50', value: breakdown.top50, color: '#8b5cf6' },
    { name: 'Top 100', value: breakdown.top100, color: '#ef4444' },
    { name: 'Not ranking', value: breakdown.notRanking, color: '#f87171' }
  ].filter(item => item.value > 0);
};
