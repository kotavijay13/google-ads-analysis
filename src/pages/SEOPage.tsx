
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
    <div className="w-full px-4 py-6">
      <div className="max-w-none">
        <SEOHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
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

          <div className="lg:col-span-2">
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
  );
};

export default SEOPage;
