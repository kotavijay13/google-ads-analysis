
import { useState } from 'react';
import { KeywordData, PageData, UrlMetaData, SitePerformance, SerpStats } from './seo/types';
import { initialKeywords, initialPages } from './seo/constants';
import { useGSCConnection } from './seo/useGSCConnection';
import { useGSCData } from './seo/useGSCData';

export const useSEOData = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string>('');
  const [serpKeywords, setSerpKeywords] = useState<KeywordData[]>(initialKeywords);
  const [pages, setPages] = useState<PageData[]>(initialPages);
  const [urlMetaData, setUrlMetaData] = useState<UrlMetaData[]>([]);
  const [sitePerformance, setSitePerformance] = useState<SitePerformance>({});
  const [serpStats, setSerpStats] = useState<SerpStats>({
    totalKeywords: 5,
    top10Keywords: 3,
    avgPosition: '3.6',
    estTraffic: 970,
    totalPages: 5,
    topPerformingPages: initialPages.slice(0, 3),
    totalClicks: 0,
    totalImpressions: 0,
    avgCTR: 0
  });

  const { availableWebsites, googleAdsConnected, checkGoogleSearchConsoleConnection } = useGSCConnection();
  const { fetchRealTimeGSCData, fallbackToSerpAPI } = useGSCData();

  const handleRefreshSerpData = async () => {
    if (!selectedWebsite) {
      return;
    }

    setIsRefreshing(true);
    console.log(`Refreshing comprehensive data for: ${selectedWebsite}`);

    try {
      const result = await fetchRealTimeGSCData(selectedWebsite);
      
      if (result) {
        setSerpKeywords(result.keywords);
        setPages(result.pages);
        setUrlMetaData(result.urlMetaData);
        setSitePerformance(result.sitePerformance);
        setSerpStats({
          ...result.stats,
          totalClicks: result.stats.totalClicks || 0,
          totalImpressions: result.stats.totalImpressions || 0,
          avgCTR: result.stats.avgCTR || 0
        });
      }
    } catch (gscError) {
      console.log('GSC data fetch failed, falling back to SERP API');
      
      try {
        const serpResult = await fallbackToSerpAPI(selectedWebsite);
        if (serpResult) {
          setSerpKeywords(serpResult.keywords);
          setSerpStats(serpResult.stats);
        }
      } catch (serpError) {
        // Error already handled in fallbackToSerpAPI
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleWebsiteChange = async (website: string) => {
    console.log(`Website change requested: "${website}"`);
    if (website && website.trim().length > 0) {
      setSelectedWebsite(website);
      console.log(`Selected website: ${website}`);
      
      // Auto-refresh data when website changes
      setIsRefreshing(true);
      try {
        const result = await fetchRealTimeGSCData(website);
        
        if (result) {
          setSerpKeywords(result.keywords);
          setPages(result.pages);
          setUrlMetaData(result.urlMetaData);
          setSitePerformance(result.sitePerformance);
          setSerpStats({
            ...result.stats,
            totalClicks: result.stats.totalClicks || 0,
            totalImpressions: result.stats.totalImpressions || 0,
            avgCTR: result.stats.avgCTR || 0
          });
        }
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    } else {
      console.warn('Empty website value received, ignoring');
    }
  };

  // Auto-select first website and refresh data when websites become available
  useState(() => {
    if (availableWebsites.length > 0 && !selectedWebsite) {
      const firstWebsite = availableWebsites[0];
      setSelectedWebsite(firstWebsite);
      console.log(`Auto-selected website: ${firstWebsite}`);
      
      // Auto-refresh data for the first website
      setTimeout(() => {
        handleRefreshSerpData();
      }, 1000);
    }
  });

  return {
    isRefreshing,
    selectedWebsite,
    availableWebsites,
    serpKeywords,
    pages,
    urlMetaData,
    sitePerformance,
    serpStats,
    googleAdsConnected,
    handleRefreshSerpData,
    handleWebsiteChange,
  };
};
