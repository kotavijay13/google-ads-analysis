
export interface KeywordData {
  keyword: string;
  impressions: number;
  clicks: number;
  ctr: number | string;
  position: number | string;
  change: string;
}

export interface PageData {
  url: string;
  impressions: number;
  clicks: number;
  ctr: number | string;
  position: number | string;
}

export interface UrlMetaData {
  url: string;
  indexStatus: string;
  crawlStatus: string;
  lastCrawled: string | null;
  userAgent: string;
}

export interface SitePerformance {
  totalPages: number;
  indexedPages: number;
  crawlErrors: number;
  avgLoadTime: string;
  mobileUsability: string;
  coreWebVitals?: {
    lcp: string;
    fid: string;
    cls: string;
  };
}

export interface SerpStats {
  totalKeywords: number;
  top10Keywords: number;
  avgPosition: string;
  estTraffic: number;
  totalPages: number;
  topPerformingPages: PageData[];
  totalClicks: number;
  totalImpressions: number;
  avgCTR: number;
}
