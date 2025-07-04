
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import ChannelMetricsOverview from '@/components/ChannelMetricsOverview';
import MetaAdsIntegration from '@/components/MetaAdsIntegration';
import MetaAdsOverview from '@/components/meta-ads/MetaAdsOverview';
import MetaAdsTabs from '@/components/meta-ads/MetaAdsTabs';
import { useMetaAdsAccounts } from '@/components/meta-ads/useMetaAdsAccounts';
import { Card, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { useGlobalWebsite } from '@/context/GlobalWebsiteContext';
import { 
  dailyPerformance, 
  getOverviewMetrics
} from '@/data/mockData';

const MetaAdsPage = () => {
  const [metrics, setMetrics] = useState(getOverviewMetrics());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { selectedWebsite } = useGlobalWebsite();
  const {
    loading,
    accounts,
    connected,
    selectedAccount,
    handleSelectAccount
  } = useMetaAdsAccounts();
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Refreshing Meta Ads data...');
    }, 1000);
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  }, []);

  useEffect(() => {
    console.log('Initial Meta Ads data fetch with date range:', dateRange);
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Meta Ads Dashboard" />
      
      {selectedWebsite && (
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Analyzing Meta Ads data for:</span>
              <span className="font-semibold text-primary">{selectedWebsite}</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Meta Ads Overview</h2>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      {!connected ? (
        <MetaAdsIntegration />
      ) : (
        <>
          <ChannelMetricsOverview metrics={metrics} />
          
          <MetaAdsOverview 
            dailyPerformance={dailyPerformance} 
            totalRevenue={0} 
          />
          
          <MetaAdsTabs 
            accounts={accounts}
            selectedAccount={selectedAccount}
            onSelectAccount={handleSelectAccount}
          />
        </>
      )}
    </div>
  );
};

export default MetaAdsPage;
