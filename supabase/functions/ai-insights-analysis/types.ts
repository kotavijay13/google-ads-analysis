export interface GSCData {
  totalKeywords: number;
  avgPosition: string;
  totalClicks: number;
  totalImpressions: number;
  avgCTR: number;
  top10Keywords: number;
  top3Keywords: number;
  keywords: Array<{
    keyword: string;
    position: string;
    clicks: number;
    impressions: number;
    ctr: string;
  }>;
  pages: Array<{
    url: string;
    clicks: number;
    impressions: number;
    position: string;
    ctr: string;
  }>;
  urlMetaData: Array<{
    url: string;
    metaTitle?: string;
    metaDescription?: string;
    imageCount?: number;
    imagesWithoutAlt?: number;
  }>;
  sitePerformance: Record<string, any>;
}

export interface AnalysisRequest {
  website: string;
  seoData: GSCData;
  googleAdsData: Record<string, any>;
  metaAdsData: Record<string, any>;
  leadsData: Record<string, any>;
}

export interface AIInsight {
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

export interface AnalysisResponse {
  success: boolean;
  insights?: AIInsight[];
  website?: string;
  timestamp?: string;
  error?: string;
}