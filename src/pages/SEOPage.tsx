
import { useState, useEffect } from 'react';
import WebsiteSelector from '@/components/seo/WebsiteSelector';
import SEOStatsCards from '@/components/seo/SEOStatsCards';
import SEOHeader from '@/components/seo/SEOHeader';
import SEOTabsContent from '@/components/seo/SEOTabsContent';
import DateRangePicker from '@/components/DateRangePicker';
import { useSEOData } from '@/hooks/useSEOData';
import { useSEOContext } from '@/context/SEOContext';
import { useGlobalWebsite } from '@/context/GlobalWebsiteContext';

const SEOPage = () => {
  const [activeTab, setActiveTab] = useState('keywords');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // Default to last 28 days
    to: new Date()
  });

  const { seoState, updateSEOState } = useSEOContext();
  const { selectedWebsite, setSelectedWebsite } = useGlobalWebsite();
  
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

  // Sync global website selection with SEO state and automatically refresh data
  useEffect(() => {
    if (selectedWebsite && selectedWebsite !== seoState.selectedWebsite) {
      console.log(`Global website changed to: ${selectedWebsite}, updating SEO state and fetching data`);
      updateSEOState({ selectedWebsite });
      // Automatically trigger data fetch when website changes
      handleWebsiteChangeWithDateRange(selectedWebsite);
    }
  }, [selectedWebsite, seoState.selectedWebsite, updateSEOState]);

  // Also refresh data when navigating to SEO page with a selected website but no data
  useEffect(() => {
    if (selectedWebsite && !seoState.isDataLoaded && !isRefreshing) {
      console.log(`SEO page loaded with website ${selectedWebsite} but no data, fetching data`);
      handleWebsiteChangeWithDateRange(selectedWebsite);
    }
  }, [selectedWebsite, seoState.isDataLoaded, isRefreshing]);

  const handleWebsiteChangeWithDateRange = async (website: string) => {
    const startDate = dateRange.from.toISOString().split('T')[0];
    const endDate = dateRange.to.toISOString().split('T')[0];
    await handleWebsiteChange(website);
  };

  const handleDateRangeChange = async (newDateRange: { from: Date; to: Date }) => {
    setDateRange(newDateRange);
    if (selectedWebsite) {
      const startDate = newDateRange.from.toISOString().split('T')[0];
      const endDate = newDateRange.to.toISOString().split('T')[0];
      console.log(`Date range changed: ${startDate} to ${endDate}`);
      await handleWebsiteChange(selectedWebsite);
    }
  };

  const connected = availableWebsites.length > 0;
  const gscLoading = false;

  const handleConnect = () => {
    window.location.href = '/integrations';
  };

  const handleWebsiteSelection = async (website: string) => {
    setSelectedWebsite(website); // Update global context
    updateSEOState({ selectedWebsite: website });
    await handleWebsiteChangeWithDateRange(website);
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
            {/* Top Section: Website Details + Date Range in Top Right + Average Position */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <div className="h-fit">
                <WebsiteSelector
                  selectedWebsite={selectedWebsite}
                  availableWebsites={availableWebsites}
                  connected={connected}
                  gscLoading={gscLoading}
                  isRefreshing={isRefreshing}
                  onWebsiteChange={handleWebsiteSelection}
                  onConnect={handleConnect}
                  onRefresh={handleRefresh}
                />
              </div>
              <div className="flex gap-4 justify-end">
                <div className="h-fit">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date Range
                    </label>
                    <DateRangePicker onDateChange={handleDateRangeChange} />
                  </div>
                </div>
                <div className="h-fit">
                  <SEOStatsCards 
                    serpStats={seoState.serpStats} 
                    serpKeywords={seoState.serpKeywords}
                    selectedWebsite={selectedWebsite}
                    showOnlyAveragePosition={true}
                  />
                </div>
              </div>
            </div>

            {/* Stats Cards Section */}
            <div className="h-fit">
              <SEOStatsCards 
                serpStats={seoState.serpStats} 
                serpKeywords={seoState.serpKeywords}
                selectedWebsite={selectedWebsite}
                showOnlyStatsCards={true}
              />
            </div>
            
            {/* Current Search Results Ranking - Full Width */}
            <div className="w-full">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <SEOStatsCards 
                  serpStats={seoState.serpStats} 
                  serpKeywords={seoState.serpKeywords}
                  selectedWebsite={selectedWebsite}
                  showOnlyRankingBreakdown={true}
                />
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
            selectedWebsite={selectedWebsite}
          />
        </div>
      </div>
    </div>
  );
};

export default SEOPage;
