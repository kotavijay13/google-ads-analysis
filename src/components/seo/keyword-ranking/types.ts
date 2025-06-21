
export interface RankingBreakdown {
  top3: number;
  top5: number;
  top10: number;
  top50: number;
  top100: number;
  notRanking: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}
