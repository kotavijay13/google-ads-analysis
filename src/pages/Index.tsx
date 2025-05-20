
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import MetricsOverview from '@/components/MetricsOverview';
import PerformanceChart from '@/components/PerformanceChart';
import { useGoogleAdsAPI } from '@/hooks/use-google-ads-api';
import { getOverviewMetrics, dailyPerformance } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Search, FileText, PieChart, InfoIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface AccountInfo {
  googleAds: {
    id: string;
    name: string;
  } | null;
  metaAds: {
    id: string;
    name: string;
  } | null;
}

const Index = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(getOverviewMetrics());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    googleAds: null,
    metaAds: null
  });
  
  const { 
    fetchData, 
    isLoading, 
    error 
  } = useGoogleAdsAPI();
  
  const handleRefresh = () => {
    // Fetch fresh data from all marketing channels
    fetchData(dateRange.from, dateRange.to);
    console.log('Refreshing dashboard data...');
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
    // Fetch updated data with new date range
    fetchData(range.from, range.to);
  }, [fetchData]);

  // Initial data fetch and account info fetch
  useEffect(() => {
    if (user) {
      fetchAccountsInfo();
    }
    console.log('Initial dashboard data fetch with date range:', dateRange);
  }, [user]);

  // Fetch account information from localStorage and database
  const fetchAccountsInfo = async () => {
    if (!user) return;
    
    // Get Google Ads account info from localStorage
    const googleAccountId = localStorage.getItem('selectedGoogleAccount');
    const googleAccountName = localStorage.getItem('selectedGoogleAccountName');
    
    // Get Meta Ads account info from localStorage
    const metaAccountId = localStorage.getItem('selectedMetaAccount');
    
    let metaAccountName = '';
    
    // Fetch Meta account name from database if we have the ID
    if (metaAccountId) {
      try {
        const { data, error } = await supabase
          .from('ad_accounts')
          .select('account_name')
          .eq('user_id', user.id)
          .eq('platform', 'meta')
          .eq('account_id', metaAccountId)
          .single();
          
        if (data) {
          metaAccountName = data.account_name || metaAccountId;
        }
      } catch (error) {
        console.error('Error fetching Meta account name:', error);
      }
    }
    
    setAccountInfo({
      googleAds: googleAccountId && googleAccountName ? {
        id: googleAccountId,
        name: googleAccountName
      } : null,
      metaAds: metaAccountId ? {
        id: metaAccountId,
        name: metaAccountName || metaAccountId
      } : null
    });
  };

  // Mock top changes data
  const topChanges = [
    {
      id: 1,
      category: "Google Ads",
      title: "Increase bid for 'digital marketing' keyword",
      description: "Currently underperforming with high potential ROI",
      impact: "High",
      icon: TrendingUp
    },
    {
      id: 2,
      category: "SEO",
      title: "Optimize meta descriptions for top 5 landing pages",
      description: "Current CTR is below industry average",
      impact: "Medium",
      icon: Search
    },
    {
      id: 3,
      category: "Meta Ads",
      title: "Refresh creative for Instagram Story campaign",
      description: "Engagement dropping over the past week",
      impact: "High",
      icon: FileText
    },
    {
      id: 4,
      category: "Competition",
      title: "Target competitor keyword 'marketing automation'",
      description: "Competitor ranking dropped, opportunity to gain position",
      impact: "Medium",
      icon: PieChart
    },
    {
      id: 5,
      category: "Leads",
      title: "Follow up with 12 high-value leads",
      description: "Leads from last week's campaign waiting for response",
      impact: "High",
      icon: AlertTriangle
    }
  ];

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Merge Insights AI" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Merge Insights AI Overview</h2>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>
      
      {/* Connected Accounts Display */}
      {(accountInfo.googleAds || accountInfo.metaAds) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            {accountInfo.googleAds && (
              <div className="bg-primary/10 p-3 rounded-md flex-1">
                <span className="text-xs font-medium text-muted-foreground">Google Ads</span>
                <h3 className="text-md font-semibold">{accountInfo.googleAds.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">ID: {accountInfo.googleAds.id}</p>
              </div>
            )}
            
            {accountInfo.metaAds && (
              <div className="bg-blue-500/10 p-3 rounded-md flex-1">
                <span className="text-xs font-medium text-muted-foreground">Meta Ads</span>
                <h3 className="text-md font-semibold">{accountInfo.metaAds.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">ID: {accountInfo.metaAds.id}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <MetricsOverview metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <PerformanceChart data={dailyPerformance} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Google Ads Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,543</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              {accountInfo.googleAds && (
                <p className="text-xs text-muted-foreground mt-1">
                  Account: {accountInfo.googleAds.name}
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Meta Ads Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,752</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              {accountInfo.metaAds && (
                <p className="text-xs text-muted-foreground mt-1">
                  Account: {accountInfo.metaAds.name}
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">SEO Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,238</div>
              <p className="text-xs text-muted-foreground">Organic visits</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">347</div>
              <p className="text-xs text-muted-foreground">+8.2% from last month</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Changes To Be Done Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topChanges.map((item) => (
                <div key={item.id} className="flex justify-between items-start pb-2 border-b">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.impact === "High" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {item.impact} Impact
                    </span>
                    <div className="text-xs text-muted-foreground mt-1">{item.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
