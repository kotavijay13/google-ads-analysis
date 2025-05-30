
import { useState } from 'react';
import { useSearchConsoleIntegration } from '@/components/google-search-console/useSearchConsoleIntegration';
import WebsiteSelector from '@/components/seo/WebsiteSelector';
import SEOStatsCards from '@/components/seo/SEOStatsCards';
import SEOHeader from '@/components/seo/SEOHeader';
import SEOTabsContent from '@/components/seo/SEOTabsContent';
import DateRangePicker from '@/components/DateRangePicker';
import { useSEOData } from '@/hooks/useSEOData';

const SEOPage = () => {
  const [activeTab, setActiveTab] = useState('keywords');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // Last 28 days
    to: new Date()
  });

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
    pages,
    urlMetaData,
    sitePerformance,
    serpStats,
    googleAdsConnected,
    handleRefreshSerpData,
    handleWebsiteChange,
    handleDateRangeChange,
  } = useSEOData();

  const handleDateChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
    handleDateRangeChange(range);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <SEOHeader />

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

      {/* Date Range Picker */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Date Range</h3>
          <DateRangePicker onDateChange={handleDateChange} />
        </div>
      </div>

      <SEOTabsContent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        serpKeywords={serpKeywords}
        pages={pages}
        urlMetaData={urlMetaData}
        sitePerformance={sitePerformance}
        selectedWebsite={selectedWebsite}
      />
    </div>
  );
};

export default SEOPage;
