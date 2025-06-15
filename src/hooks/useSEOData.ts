import { useState } from 'react';
import { KeywordData, PageData, UrlMetaData, SitePerformance, SerpStats } from './seo/types';
import { initialKeywords, initialPages } from './seo/constants';
import { useGSCConnection } from './seo/useGSCConnection';
import { useGSCData } from './seo/useGSCData';
import { useSEOContext } from '@/context/SEOContext';

export const useSEOData = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const { seoState, updateSEOState } = useSEOContext();
  const { availableWebsites, googleAdsConnected, checkGoogleSearchConsoleConnection } = useGSCConnection();
  const { fetchRealTimeGSCData, fallbackToSerpAPI } = useGSCData();

  const fetchDataWithDateRange = async (websiteUrl: string, startDate?: string, endDate?: string) => {
    setIsRefreshing(true);
    console.log(`Refreshing comprehensive data for: ${websiteUrl} (${startDate} to ${endDate})`);

    try {
      const result = await fetchRealTimeGSCData(websiteUrl, startDate, endDate);
      
      if (result) {
        const newState = {
          serpKeywords: result.keywords || [],
          pages: result.pages || [],
          urlMetaData: result.urlMetaData || [],
          sitePerformance: result.sitePerformance || {
            totalPages: 0,
            indexedPages: 0,
            crawlErrors: 0,
            avgLoadTime: '0ms',
            mobileUsability: 'Good'
          },
          serpStats: {
            totalKeywords: result.stats?.totalKeywords || 0,
            top10Keywords: result.stats?.top10Keywords || 0,
            avgPosition: result.stats?.avgPosition || '0.0',
            estTraffic: result.stats?.estTraffic || 0,
            totalPages: result.stats?.totalPages || 0,
            topPerformingPages: result.stats?.topPerformingPages || [],
            totalClicks: typeof result.stats?.totalClicks === 'number' ? result.stats.totalClicks : 0,
            totalImpressions: typeof result.stats?.totalImpressions === 'number' ? result.stats.totalImpressions : 0,
            avgCTR: typeof result.stats?.avgCTR === 'number' ? result.stats.avgCTR : 0
          },
          isDataLoaded: true
        };
        
        updateSEOState(newState);
      }
    } catch (gscError) {
      console.log('GSC data fetch failed, falling back to SERP API');
      
      try {
        const serpResult = await fallbackToSerpAPI(seoState.selectedWebsite);
        if (serpResult) {
          updateSEOState({
            serpKeywords: serpResult.keywords || [],
            serpStats: {
              ...serpResult.stats,
              totalClicks: typeof serpResult.stats?.totalClicks === 'number' ? serpResult.stats.totalClicks : 0,
              totalImpressions: typeof serpResult.stats?.totalImpressions === 'number' ? serpResult.stats.totalImpressions : 0,
              avgCTR: typeof serpResult.stats?.avgCTR === 'number' ? serpResult.stats.avgCTR : 0
            },
            isDataLoaded: true
          });
        }
      } catch (serpError) {
        // Error already handled in fallbackToSerpAPI
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefreshSerpData = async () => {
    if (!seoState.selectedWebsite) {
      return;
    }

    const startDate = dateRange.from.toISOString().split('T')[0];
    const endDate = dateRange.to.toISOString().split('T')[0];
    
    await fetchDataWithDateRange(seoState.selectedWebsite, startDate, endDate);
  };

  const handleWebsiteChange = async (website: string) => {
    console.log(`Website change requested: "${website}"`);
    if (website && website.trim().length > 0) {
      updateSEOState({ selectedWebsite: website });
      console.log(`Selected website: ${website}`);
      
      const startDate = dateRange.from.toISOString().split('T')[0];
      const endDate = dateRange.to.toISOString().split('T')[0];
      
      await fetchDataWithDateRange(website, startDate, endDate);
    } else {
      console.warn('Empty website value received, ignoring');
    }
  };

  return {
    isRefreshing,
    selectedWebsite: seoState.selectedWebsite,
    availableWebsites,
    serpKeywords: seoState.serpKeywords,
    pages: seoState.pages,
    urlMetaData: seoState.urlMetaData,
    sitePerformance: seoState.sitePerformance,
    serpStats: seoState.serpStats,
    googleAdsConnected,
    handleRefreshSerpData,
    handleWebsiteChange,
  };
};
