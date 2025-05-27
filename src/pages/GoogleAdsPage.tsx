
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import ChannelMetricsOverview from '@/components/ChannelMetricsOverview';
import PerformanceChart from '@/components/PerformanceChart';
import CampaignTable from '@/components/CampaignTable';
import DeviceBreakdown from '@/components/DeviceBreakdown';
import GeoPerformance from '@/components/GeoPerformance';
import KeywordPerformance from '@/components/KeywordPerformance';
import AdCopyPerformance from '@/components/AdCopyPerformance';
import AssetPerformance from '@/components/AssetPerformance';
import SearchTermsPerformance from '@/components/SearchTermsPerformance';
import { useGoogleAdsAPI } from '@/hooks/use-google-ads-api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  campaignsData, 
  dailyPerformance, 
  deviceData, 
  geoData, 
  getOverviewMetrics,
  keywordPerformanceData,
  adCopyPerformanceData,
  adGroupsData,
  assetPerformanceData,
  searchTermsData
} from '@/data/mockData';
import { useGoogleAccounts } from '@/hooks/use-google-accounts';
import { useGoogleAdsIntegration } from '@/components/google-ads/useGoogleAdsIntegration';
import GoogleAdsIntegration from '@/components/GoogleAdsIntegration';

const GoogleAdsPage = () => {
  const [metrics, setMetrics] = useState(getOverviewMetrics());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const { 
    fetchData, 
    isLoading, 
    error 
  } = useGoogleAdsAPI();
  
  const { accounts, currentAccount, switchAccount, setCurrentAccount } = useGoogleAccounts();
  const { connected, accounts: googleAdsAccounts } = useGoogleAdsIntegration();
  
  const handleRefresh = () => {
    fetchData(dateRange.from, dateRange.to);
    console.log('Refreshing Google Ads data...');
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
    fetchData(range.from, range.to);
  }, [fetchData]);

  useEffect(() => {
    console.log('Google Ads accounts:', googleAdsAccounts);
    console.log('Connected status:', connected);
    console.log('Current account:', currentAccount);
  }, [googleAdsAccounts, connected, currentAccount]);

  // Show integration component if not connected or no accounts
  if (!connected || googleAdsAccounts.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Header onRefresh={handleRefresh} title="Google Ads Dashboard" />
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Connect Your Google Ads Account</CardTitle>
            <CardDescription>
              You need to connect your Google Ads account to view your campaign data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleAdsIntegration />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Google Ads Dashboard" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <h2 className="text-lg font-medium">Google Ads Overview</h2>
          {currentAccount && (
            <div className="text-sm text-muted-foreground">
              Current Account: {currentAccount.name} ({currentAccount.id})
            </div>
          )}
        </div>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      {/* Show a notice about data source */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You're currently viewing sample data. Real Google Ads data integration is in development.
            Your connected account: {currentAccount?.name || 'No account selected'}
          </p>
        </CardContent>
      </Card>

      <ChannelMetricsOverview metrics={metrics} />
      
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
          <TabsTrigger value="searchterms">Search Terms</TabsTrigger>
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
        
        <TabsContent value="searchterms" className="mt-0">
          <SearchTermsPerformance 
            searchTerms={searchTermsData} 
            campaigns={campaignsData}
            adGroups={adGroupsData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleAdsPage;
