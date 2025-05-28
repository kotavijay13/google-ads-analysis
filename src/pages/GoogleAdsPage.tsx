
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
import { 
  deviceData, 
  geoData, 
  keywordPerformanceData,
  adCopyPerformanceData,
  adGroupsData,
  assetPerformanceData,
  searchTermsData
} from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGoogleAdsIntegration } from '@/components/google-ads/useGoogleAdsIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const GoogleAdsPage = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  // Use the Google Ads integration hook
  const { 
    accounts, 
    connected, 
    selectedAccount, 
    handleSelectAccount,
    handleRefreshAccounts,
    refreshing
  } = useGoogleAdsIntegration();
  
  // Use the API hook for data fetching
  const { 
    fetchData, 
    isLoading, 
    error,
    campaigns,
    dailyPerformance,
    metrics
  } = useGoogleAdsAPI();

  // Fetch data when component mounts or when account/date changes
  useEffect(() => {
    if (selectedAccount) {
      fetchData(dateRange.from, dateRange.to);
    }
  }, [selectedAccount, fetchData]);

  const handleRefresh = () => {
    // Fetch fresh data from Google Ads API
    if (selectedAccount) {
      fetchData(dateRange.from, dateRange.to);
    }
    console.log('Refreshing Google Ads data...');
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
    // Fetch updated data with new date range
    if (selectedAccount) {
      fetchData(range.from, range.to);
    }
  }, [fetchData, selectedAccount]);

  // If not connected, show connection prompt
  if (!connected) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Header onRefresh={handleRefresh} title="Google Ads Dashboard" />
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Google Ads Not Connected</CardTitle>
            <CardDescription>
              You need to connect your Google Ads account first to view your dashboard data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="gap-2">
              <a href="/integrations">
                <ExternalLink className="h-4 w-4" />
                Go to Integrations
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create metrics for overview component
  const overviewMetrics = metrics ? [
    {
      title: "Total Spend",
      value: `$${metrics.totalSpend?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`,
      change: "+0.0%",
      trend: "up" as const
    },
    {
      title: "Clicks",
      value: metrics.totalClicks?.toLocaleString() || '0',
      change: "+0.0%",
      trend: "up" as const
    },
    {
      title: "Impressions",
      value: metrics.totalImpressions?.toLocaleString() || '0',
      change: "+0.0%",
      trend: "up" as const
    },
    {
      title: "Conversions",
      value: metrics.totalConversions?.toLocaleString() || '0',
      change: "+0.0%",
      trend: "up" as const
    },
    {
      title: "CTR",
      value: `${metrics.avgCtr?.toFixed(2) || '0.00'}%`,
      change: "+0.0%",
      trend: "up" as const
    },
    {
      title: "Avg. CPC",
      value: `$${metrics.avgCpc?.toFixed(2) || '0.00'}`,
      change: "+0.0%",
      trend: "down" as const
    }
  ] : [];

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Google Ads Dashboard" isLoading={isLoading} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <h2 className="text-lg font-medium">Google Ads Overview</h2>
          <Select 
            value={selectedAccount || ''} 
            onValueChange={handleSelectAccount}
            disabled={refreshing}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder={accounts.length === 0 ? "No accounts available" : "Select ad account"} />
            </SelectTrigger>
            <SelectContent>
              {accounts.length === 0 ? (
                <SelectItem value="no-accounts" disabled>
                  No Google Ads accounts found
                </SelectItem>
              ) : (
                accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.id})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          {accounts.length === 0 && (
            <div className="text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="font-medium">No Google Ads accounts found</p>
              <p>Please try refreshing accounts or go to the Integrations page to reconnect.</p>
              <Button 
                onClick={handleRefreshAccounts} 
                className="mt-2" 
                size="sm" 
                variant="outline"
                disabled={refreshing}
              >
                {refreshing ? 'Refreshing...' : 'Refresh Accounts'}
              </Button>
            </div>
          )}
        </div>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      {selectedAccount && (
        <div className="mb-4 bg-primary/10 p-3 rounded-md">
          <p className="text-sm font-medium">Current Account:</p>
          <h4 className="text-lg font-bold">
            {accounts.find(a => a.id === selectedAccount)?.name || selectedAccount}
          </h4>
          <p className="text-xs text-muted-foreground">ID: {selectedAccount}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 font-medium">Error loading data</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <ChannelMetricsOverview metrics={overviewMetrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PerformanceChart data={dailyPerformance || []} />
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
          <CampaignTable campaigns={campaigns || []} />
        </TabsContent>
        
        <TabsContent value="keywords" className="mt-0">
          <KeywordPerformance 
            keywords={keywordPerformanceData} 
            campaigns={campaigns || []}
            adGroups={adGroupsData}
          />
        </TabsContent>
        
        <TabsContent value="adcopy" className="mt-0">
          <AdCopyPerformance 
            adCopies={adCopyPerformanceData} 
            campaigns={campaigns || []}
            adGroups={adGroupsData}
          />
        </TabsContent>
        
        <TabsContent value="assets" className="mt-0">
          <AssetPerformance 
            assets={assetPerformanceData} 
            campaigns={campaigns || []}
            adGroups={adGroupsData}
          />
        </TabsContent>
        
        <TabsContent value="searchterms" className="mt-0">
          <SearchTermsPerformance 
            searchTerms={searchTermsData} 
            campaigns={campaigns || []}
            adGroups={adGroupsData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleAdsPage;
