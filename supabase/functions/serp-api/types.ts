
export interface KeywordData {
  keyword: string;
  landingUrl: string;
  position: number;
  searchVolume: number;
  competitorUrl: string;
  change: string;
  estimatedVisits: number;
  difficulty: number;
  difficultyLevel: string;
  ctr?: number;
  cpc?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface OverviewStats {
  totalKeywords: number;
  top10Keywords: number;
  top3Keywords?: number;
  avgPosition: string;
  estTraffic: number;
  visibilityScore?: number;
  competitionLevel?: 'Low' | 'Medium' | 'High';
  totalPages?: number;
  topPerformingPages?: Array<{
    url: string;
    traffic: number;
    keywords: number;
  }>;
}

export interface SerpApiResponse {
  keywords: KeywordData[];
  stats: OverviewStats;
}
