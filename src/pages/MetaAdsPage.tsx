import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import MetricsOverview from '@/components/MetricsOverview';
import PerformanceChart from '@/components/PerformanceChart';
import CampaignTable from '@/components/CampaignTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  dailyPerformance, 
  getOverviewMetrics,
  Campaign
} from '@/data/mockData';

// Mock data for Meta Ads campaigns, with ctr and cpc properties added
const metaCampaigns: Campaign[] = [
  {
    id: "meta-1",
    name: "Spring Collection - Facebook",
    status: "Active",
    budget: 1500,
    spend: 1350.32,
    impressions: 592800,
    clicks: 12850,
    conversions: 342,
    cpc: 0.11,
    costPerConversion: 3.95,
    conversionRate: 2.66,
    ctr: 2.17,  // (clicks / impressions) * 100
    roas: 4.8
  },
  {
    id: "meta-2",
    name: "Instagram Story Ads",
    status: "Active",
    budget: 2000,
    spend: 1876.42,
    impressions: 734500,
    clicks: 22670,
    conversions: 587,
    cpc: 0.08,
    costPerConversion: 3.20,
    conversionRate: 2.59,
    ctr: 3.09, // (clicks / impressions) * 100
    roas: 5.2
  },
  {
    id: "meta-3",
    name: "Retargeting - Carousel",
    status: "Active",
    budget: 1200,
    spend: 1120.89,
    impressions: 428600,
    clicks: 18970,
    conversions: 524,
    cpc: 0.06,
    costPerConversion: 2.14,
    conversionRate: 2.76,
    ctr: 4.43, // (clicks / impressions) * 100
    roas: 6.5
  }
];

const MetaAdsPage = () => {
  const [metrics, setMetrics] = useState(getOverviewMetrics());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Refreshing Meta Ads data...');
    }, 1000);
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  }, []);

  // Initial data fetch when component mounts
  useEffect(() => {
    console.log('Initial Meta Ads data fetch with date range:', dateRange);
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Meta Ads Dashboard" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Meta Ads Overview</h2>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      <MetricsOverview metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PerformanceChart data={dailyPerformance} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Platform Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>Facebook</div>
                  <div className="font-medium">62%</div>
                </div>
                <div className="flex justify-between">
                  <div>Instagram</div>
                  <div className="font-medium">31%</div>
                </div>
                <div className="flex justify-between">
                  <div>Audience Network</div>
                  <div className="font-medium">7%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ad Format Performance</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>Stories</div>
                  <div className="font-medium">$0.12 CPC</div>
                </div>
                <div className="flex justify-between">
                  <div>Feed</div>
                  <div className="font-medium">$0.18 CPC</div>
                </div>
                <div className="flex justify-between">
                  <div>Reels</div>
                  <div className="font-medium">$0.14 CPC</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <CampaignTable campaigns={metaCampaigns} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Audience Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Age Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>18-24</div>
                    <div className="w-2/3">
                      <div className="bg-blue-500 h-2 rounded" style={{ width: "22%" }}></div>
                    </div>
                    <div>22%</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>25-34</div>
                    <div className="w-2/3">
                      <div className="bg-blue-500 h-2 rounded" style={{ width: "38%" }}></div>
                    </div>
                    <div>38%</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>35-44</div>
                    <div className="w-2/3">
                      <div className="bg-blue-500 h-2 rounded" style={{ width: "25%" }}></div>
                    </div>
                    <div>25%</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Gender</h4>
                <div className="flex justify-between gap-4">
                  <div className="flex-1 bg-blue-100 p-3 rounded text-center">
                    <div className="font-bold">46%</div>
                    <div className="text-sm">Male</div>
                  </div>
                  <div className="flex-1 bg-pink-100 p-3 rounded text-center">
                    <div className="font-bold">52%</div>
                    <div className="text-sm">Female</div>
                  </div>
                  <div className="flex-1 bg-gray-100 p-3 rounded text-center">
                    <div className="font-bold">2%</div>
                    <div className="text-sm">Other</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Creative Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  title: "Summer Collection Video", 
                  type: "Video Ad", 
                  ctr: "3.8%", 
                  engagement: "High",
                  thumbnail: "https://placehold.co/60x60/blue/white"
                },
                { 
                  title: "Product Carousel", 
                  type: "Carousel Ad", 
                  ctr: "2.4%", 
                  engagement: "Medium",
                  thumbnail: "https://placehold.co/60x60/green/white" 
                },
                { 
                  title: "Customer Testimonial", 
                  type: "Image Ad", 
                  ctr: "1.9%", 
                  engagement: "Medium",
                  thumbnail: "https://placehold.co/60x60/orange/white" 
                },
              ].map((ad, i) => (
                <div key={i} className="flex gap-4 items-center border-b pb-4">
                  <div className="w-[60px] h-[60px] bg-gray-200 rounded overflow-hidden">
                    <div className="w-full h-full bg-blue-200 flex items-center justify-center text-xs">Ad</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{ad.title}</div>
                    <div className="text-sm text-muted-foreground">{ad.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{ad.ctr} CTR</div>
                    <div className="text-sm text-muted-foreground">{ad.engagement} Engagement</div>
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

export default MetaAdsPage;
