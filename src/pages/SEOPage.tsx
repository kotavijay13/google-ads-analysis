
import { useState, useEffect } from 'react';
import WebsiteSelector from '@/components/seo/WebsiteSelector';
import SEOStatsCards from '@/components/seo/SEOStatsCards';
import SEOHeader from '@/components/seo/SEOHeader';
import SEOTabsContent from '@/components/seo/SEOTabsContent';
import { useSEOData } from '@/hooks/useSEOData';
import { useSEOContext } from '@/context/SEOContext';

const SEOPage = () => {
  const [activeTab, setActiveTab] = useState('keywords');

  const { seoState, updateSEOState } = useSEOContext();
  
  const {
    isRefreshing,
    availableWebsites,
    googleAdsConnected,
    handleRefreshSerpData,
    handleWebsiteChange,
  } = useSEOData();

  // Load data from context on mount
  useEffect(() => {
    if (seoState.isDataLoaded) {
      console.log('Loading persisted SEO data from context');
    }
  }, [seoState]);

  const connected = availableWebsites.length > 0;
  const gscLoading = false;

  const handleConnect = () => {
    window.location.href = '/integrations';
  };

  const handleWebsiteSelection = async (website: string) => {
    updateSEOState({ selectedWebsite: website });
    await handleWebsiteChange(website);
  };

  const handleRefresh = async () => {
    await handleRefreshSerpData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="w-full px-4 py-4">
        <div className="max-w-none">
          <SEOHeader />

          <div className="space-y-4 mb-4">
            {/* Top Section: Website Details + Average Position */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
              <div className="h-fit">
                <WebsiteSelector
                  selectedWebsite={seoState.selectedWebsite}
                  availableWebsites={availableWebsites}
                  connected={connected}
                  gscLoading={gscLoading}
                  isRefreshing={isRefreshing}
                  onWebsiteChange={handleWebsiteSelection}
                  onConnect={handleConnect}
                  onRefresh={handleRefresh}
                />
              </div>
              <div className="h-fit">
                <SEOStatsCards 
                  serpStats={seoState.serpStats} 
                  serpKeywords={seoState.serpKeywords}
                  selectedWebsite={seoState.selectedWebsite}
                  showOnlyAveragePosition={true}
                />
              </div>
            </div>

            {/* Bottom Section: Stats Cards + Ranking Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
              {/* Stats Cards - Left Side */}
              <div className="lg:col-span-1 h-fit">
                <SEOStatsCards 
                  serpStats={seoState.serpStats} 
                  serpKeywords={seoState.serpKeywords}
                  selectedWebsite={seoState.selectedWebsite}
                  showOnlyStatsCards={true}
                />
              </div>
              
              {/* Keyword Ranking Breakdown - Right Side */}
              <div className="lg:col-span-2 h-fit">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <SEOStatsCards 
                    serpStats={seoState.serpStats} 
                    serpKeywords={seoState.serpKeywords}
                    selectedWebsite={seoState.selectedWebsite}
                    showOnlyRankingBreakdown={true}
                  />
                </div>
              </div>
            </div>
          </div>

          <SEOTabsContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            serpKeywords={seoState.serpKeywords}
            pages={seoState.pages}
            urlMetaData={seoState.urlMetaData}
            sitePerformance={seoState.sitePerformance}
            selectedWebsite={seoState.selectedWebsite}
          />
        </div>
      </div>
    </div>
  );
};

export default SEOPage;
