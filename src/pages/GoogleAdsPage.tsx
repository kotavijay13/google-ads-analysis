
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import MetricsOverview from '@/components/MetricsOverview';
import PerformanceChart from '@/components/PerformanceChart';
import CampaignTable from '@/components/CampaignTable';
import DeviceBreakdown from '@/components/DeviceBreakdown';
import GeoPerformance from '@/components/GeoPerformance';
import KeywordPerformance from '@/components/KeywordPerformance';
import AdCopyPerformance from '@/components/AdCopyPerformance';
import AssetPerformance from '@/components/AssetPerformance';
import { useGoogleAdsAPI } from '@/hooks/use-google-ads-api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  campaignsData, 
  dailyPerformance, 
  deviceData, 
  geoData, 
  getOverviewMetrics,
  keywordPerformanceData,
  adCopyPerformanceData,
  adGroupsData,
  assetPerformanceData
} from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGoogleAccounts } from '@/hooks/use-google-accounts';

const GoogleAdsPage = () => {
  const [metrics, setMetrics] = useState(getOverviewMetrics());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  // Use the hooks to fetch Google Ads data and accounts
  const { 
    fetchData, 
    isLoading, 
    error 
  } = useGoogleAdsAPI();
  
  const { accounts, currentAccount, switchAccount, setCurrentAccount } = useGoogleAccounts();
  
  const handleRefresh = () => {
    // Fetch fresh data from Google Ads API
    fetchData(dateRange.from, dateRange.to);
    console.log('Refreshing Google Ads data...');
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
    // Fetch updated data with new date range
    fetchData(range.from, range.to);
  }, [fetchData]);

  // Initial data fetch when component mounts
  useEffect(() => {
    console.log('Initial Google Ads data fetch with date range:', dateRange);
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Google Ads Dashboard" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <h2 className="text-lg font-medium">Google Ads Overview</h2>
          <Select 
            value={currentAccount?.id || ''} 
            onValueChange={(value) => {
              const account = accounts.find(acc => acc.id === value);
              if (account) setCurrentAccount(account);
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select ad account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map(account => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} ({account.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      <MetricsOverview metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PerformanceChart data={dailyPerformance} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DeviceBreakdown data={deviceData} />
          <GeoPerformance data={geoData} />
        </div>
      </div>
      
      <Tabs defaultValue="campaigns" className="mt-6">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="adcopy">Ad Copy</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-0">
          <CampaignTable campaigns={campaignsData} />
        </TabsContent>
        
        <TabsContent value="keywords" className="mt-0">
          <KeywordPerformance 
            keywords={keywordPerformanceData} 
            campaigns={campaignsData}
            adGroups={adGroupsData}
          />
        </TabsContent>
        
        <TabsContent value="adcopy" className="mt-0">
          <AdCopyPerformance 
            adCopies={adCopyPerformanceData} 
            campaigns={campaignsData}
            adGroups={adGroupsData}
          />
        </TabsContent>
        
        <TabsContent value="assets" className="mt-0">
          <AssetPerformance 
            assets={assetPerformanceData} 
            campaigns={campaignsData}
            adGroups={adGroupsData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleAdsPage;
