
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import MetricsOverview from '@/components/MetricsOverview';
import PerformanceChart from '@/components/PerformanceChart';
import { useGoogleAdsAPI } from '@/hooks/use-google-ads-api';
import { getOverviewMetrics, dailyPerformance } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
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
  
  const handleRefresh = () => {
    // Fetch fresh data from all marketing channels
    fetchData(dateRange.from, dateRange.to);
    console.log('Refreshing dashboard data...');
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  }, []);

  // Initial data fetch when component mounts
  useEffect(() => {
    console.log('Initial dashboard data fetch with date range:', dateRange);
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Marketing Dashboard" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Marketing Overview</h2>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Meta Ads Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,752</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
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
            <CardTitle>Recent Marketing Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { channel: "Google Ads", event: "Campaign 'Summer Sale' started", time: "2 hours ago" },
                { channel: "Meta Ads", event: "Ad set 'Product Launch' got 3,245 impressions", time: "5 hours ago" },
                { channel: "SEO", event: "Keyword 'digital marketing services' ranked #3", time: "1 day ago" },
                { channel: "Leads", event: "New lead from contact form: John Doe", time: "1 day ago" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-start pb-2 border-b">
                  <div>
                    <div className="font-medium">{item.channel}</div>
                    <div className="text-sm text-muted-foreground">{item.event}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
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
