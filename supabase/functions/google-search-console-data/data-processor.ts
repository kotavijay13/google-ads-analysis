
import { GSCKeyword, GSCPage, UrlMetaData, SitePerformance, GSCStats } from './types.ts';

export const calculateSitePerformance = (urlMetaData: UrlMetaData[], pages: GSCPage[]): SitePerformance => {
  return {
    totalPages: pages.length,
    indexedPages: urlMetaData.filter(page => page.indexStatus === 'PASS').length,
    crawlErrors: urlMetaData.filter(page => page.indexStatus !== 'PASS').length,
    avgLoadTime: '2.1s',
    mobileUsability: 'Good',
    coreWebVitals: {
      lcp: '2.1s',
      fid: '45ms',
      cls: '0.08'
    }
  };
};

export const calculateStats = (
  keywords: GSCKeyword[],
  pages: GSCPage[],
  startDate: string,
  endDate: string
): GSCStats => {
  const totalClicks = keywords.reduce((acc, k) => acc + k.clicks, 0);
  const totalImpressions = keywords.reduce((acc, k) => acc + k.impressions, 0);
  
  return {
    totalKeywords: keywords.length,
    top10Keywords: keywords.filter(k => parseFloat(k.position) <= 10).length,
    top3Keywords: keywords.filter(k => parseFloat(k.position) <= 3).length,
    avgPosition: keywords.length > 0 ? (keywords.reduce((acc, k) => acc + parseFloat(k.position), 0) / keywords.length).toFixed(1) : '0.0',
    totalClicks: totalClicks,
    totalImpressions: totalImpressions,
    avgCTR: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0',
    estTraffic: totalClicks,
    totalPages: pages.length,
    topPerformingPages: pages.slice(0, 10),
    dateRange: {
      startDate: startDate,
      endDate: endDate
    }
  };
};

export const formatWebsiteUrl = (websiteUrl: string): string => {
  return websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
};

export const getDateRange = (startDate?: string, endDate?: string) => {
  const baseStartDate = startDate || new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const baseEndDate = endDate || new Date().toISOString().split('T')[0];
  
  return { baseStartDate, baseEndDate };
};
