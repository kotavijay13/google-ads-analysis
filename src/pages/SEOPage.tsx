
import { useState } from 'react';
import GoogleSearchConsoleIntegration from '@/components/GoogleSearchConsoleIntegration';
import { useSearchConsoleIntegration } from '@/components/google-search-console/useSearchConsoleIntegration';
import WebsiteSelector from '@/components/seo/WebsiteSelector';
import SEOStatsCards from '@/components/seo/SEOStatsCards';
import SEOHeader from '@/components/seo/SEOHeader';
import GoogleAdsNotification from '@/components/seo/GoogleAdsNotification';
import SEOTabsContent from '@/components/seo/SEOTabsContent';
import { useSEOData } from '@/hooks/useSEOData';

const SEOPage = () => {
  const [activeTab, setActiveTab] = useState('keywords');

  const {
    connected,
    handleConnect,
    isLoading: gscLoading
  } = useSearchConsoleIntegration();

  const {
    isRefreshing,
    selectedWebsite,
    availableWebsites,
    serpKeywords,
    serpStats,
    googleAdsConnected,
    handleRefreshSerpData,
    handleWebsiteChange,
  } = useSEOData();

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <SEOHeader />

      <GoogleAdsNotification googleAdsConnected={googleAdsConnected} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Website Selection */}
        <div className="lg:col-span-1">
          <WebsiteSelector
            selectedWebsite={selectedWebsite}
            availableWebsites={availableWebsites}
            connected={connected}
            gscLoading={gscLoading}
            isRefreshing={isRefreshing}
            onWebsiteChange={handleWebsiteChange}
            onConnect={handleConnect}
            onRefresh={handleRefreshSerpData}
          />
        </div>

        {/* SEO Overview Stats */}
        <div className="lg:col-span-2">
          <SEOStatsCards serpStats={serpStats} />
        </div>
      </div>

      {/* Google Search Console Integration */}
      <div className="mb-6">
        <GoogleSearchConsoleIntegration />
      </div>

      <SEOTabsContent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        serpKeywords={serpKeywords}
        selectedWebsite={selectedWebsite}
      />
    </div>
  );
};

export default SEOPage;
