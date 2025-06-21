
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
      <div className="w-full px-6 py-8">
        <div className="max-w-none">
          <SEOHeader />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
            <div className="xl:col-span-1">
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

            <div className="xl:col-span-3">
              <SEOStatsCards 
                serpStats={seoState.serpStats} 
                serpKeywords={seoState.serpKeywords}
              />
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
