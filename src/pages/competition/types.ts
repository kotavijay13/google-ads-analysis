
export interface KeywordData {
  keyword: string;
  position: number;
  searchVolume: number;
  competitorUrl: string;
  change: number;
  estimatedVisits: number;
  difficulty: number;
  difficultyLevel: string;
  ctr?: number;
  cpc?: number;
  trend?: 'up' | 'down' | 'stable';
  landingUrl?: string;
}

export interface TrafficData {
  organic: number;
  paid: number;
  direct: number;
  referral: number;
  social: number;
  email: number;
}

export interface CompetitorOverview {
  domainAuthority: number;
  backlinks: number;
  referringDomains: number;
  organicKeywords: number;
  paidKeywords: number;
  trafficValue: number;
  monthlyVisits: number;
  bounceRate: number;
  avgSessionDuration: string;
  pagesPerSession: number;
  trafficDistribution: TrafficData;
  topCountries: Array<{ country: string; percentage: number }>;
  topPages: Array<{ url: string; traffic: number; keywords: number }>;
}

export interface OverviewStats {
  totalKeywords: number;
  top10Keywords: number;
  top3Keywords?: number;
  avgPosition: string;
  estTraffic: number;
  visibilityScore?: number;
  competitionLevel?: 'Low' | 'Medium' | 'High';
}

export interface EnhancedAnalysisResponse {
  keywords: KeywordData[];
  overview: CompetitorOverview;
  stats: OverviewStats & {
    visibilityScore: number;
    competitionLevel: 'Low' | 'Medium' | 'High';
  };
}

export interface Competitor {
  id: string;
  url: string;
  data: EnhancedAnalysisResponse | null;
  loading: boolean;
}
