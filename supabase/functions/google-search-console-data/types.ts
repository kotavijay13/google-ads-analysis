
export interface GSCKeyword {
  keyword: string;
  landingUrl: string;
  impressions: number;
  clicks: number;
  ctr: string;
  position: string;
  change: string;
}

export interface GSCPage {
  url: string;
  impressions: number;
  clicks: number;
  ctr: string;
  position: string;
}

export interface UrlMetaData {
  url: string;
  indexStatus: string;
  crawlStatus: string;
  lastCrawled: string | null;
  userAgent: string;
  metaTitle: string;
  metaDescription: string;
}

export interface SitePerformance {
  totalPages: number;
  indexedPages: number;
  crawlErrors: number;
  avgLoadTime: string;
  mobileUsability: string;
  coreWebVitals: {
    lcp: string;
    fid: string;
    cls: string;
  };
}

export interface GSCStats {
  totalKeywords: number;
  top10Keywords: number;
  top3Keywords: number;
  avgPosition: string;
  totalClicks: number;
  totalImpressions: number;
  avgCTR: string;
  estTraffic: number;
  totalPages: number;
  topPerformingPages: GSCPage[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface GSCResponse {
  success: boolean;
  keywords: GSCKeyword[];
  pages: GSCPage[];
  urlMetaData: UrlMetaData[];
  sitePerformance: SitePerformance;
  stats: GSCStats;
  error?: string;
}
