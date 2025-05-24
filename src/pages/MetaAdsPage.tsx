
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import MetricsOverview from '@/components/MetricsOverview';
import PerformanceChart from '@/components/PerformanceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetaAccountsTable from '@/components/meta-ads/MetaAccountsTable';
import CampaignLevelTable from '@/components/meta-ads/CampaignLevelTable';
import AdSetLevelTable from '@/components/meta-ads/AdSetLevelTable';
import AdLevelTable from '@/components/meta-ads/AdLevelTable';
import { MetaAdsAccount } from '@/components/meta-ads/types';
import { 
  dailyPerformance, 
  getOverviewMetrics
} from '@/data/mockData';

// Mock data for Meta Ads accounts with comprehensive data
const mockMetaAccounts: MetaAdsAccount[] = [
  {
    id: "meta-1",
    name: "Spring Collection - Facebook",
    // Campaign level data
    objective: "Conversions",
    buyingType: "Auction",
    status: "Active",
    budget: "$50.00/day",
    amountSpent: 1350.32,
    impressions: 592800,
    reach: 485600,
    frequency: 1.22,
    cpm: 2.28,
    ctr: 2.17,
    cpc: 0.11,
    results: 342,
    costPerResult: 3.95,
    resultRate: 0.058,
    roas: 4.8,
    purchases: 342,
    purchaseValue: 6481.54,
    websiteLeads: 28,
    addToCart: 89,
    landingPageViews: 11420,
    linkClicks: 12850,
    saves: 156,
    // Ad Set level data
    delivery: "Active",
    optimizationGoal: "Conversions",
    bidStrategy: "Lowest Cost",
    schedule: "Ongoing",
    audience: "Custom Audience",
    placement: "Automatic",
    devices: "All Devices",
    clicks: 12850,
    cpcLinkClick: 0.11,
    conversions: 342,
    costPerConversion: 3.95,
    leads: 28,
    initiatedCheckout: 198,
    // Ad level data
    adCreative: "Video + Text",
    format: "Single Video",
    callToAction: "Shop Now",
    allClicks: 13200,
    engagements: 2840,
    videoPlays: 45600,
    purchase: 342,
    qualityRanking: "Above Average",
    engagementRateRanking: "Above Average",
    conversionRateRanking: "Average"
  },
  {
    id: "meta-2", 
    name: "Instagram Story Ads",
    // Campaign level data
    objective: "Traffic",
    buyingType: "Auction", 
    status: "Active",
    budget: "$75.00/day",
    amountSpent: 1876.42,
    impressions: 734500,
    reach: 612300,
    frequency: 1.20,
    cpm: 2.55,
    ctr: 3.09,
    cpc: 0.08,
    results: 587,
    costPerResult: 3.20,
    resultRate: 0.080,
    roas: 5.2,
    purchases: 587,
    purchaseValue: 9757.38,
    websiteLeads: 45,
    addToCart: 156,
    landingPageViews: 18970,
    linkClicks: 22670,
    saves: 234,
    // Ad Set level data
    delivery: "Active",
    optimizationGoal: "Link Clicks",
    bidStrategy: "Lowest Cost",
    schedule: "Ongoing", 
    audience: "Lookalike Audience",
    placement: "Instagram Stories",
    devices: "Mobile Only",
    clicks: 22670,
    cpcLinkClick: 0.08,
    conversions: 587,
    costPerConversion: 3.20,
    leads: 45,
    initiatedCheckout: 324,
    // Ad level data
    adCreative: "Image + Text",
    format: "Single Image",
    callToAction: "Learn More",
    allClicks: 23100,
    engagements: 4560,
    videoPlays: 0,
    purchase: 587,
    qualityRanking: "Above Average",
    engagementRateRanking: "Above Average", 
    conversionRateRanking: "Above Average"
  },
  {
    id: "meta-3",
    name: "Retargeting - Carousel",
    // Campaign level data
    objective: "Conversions",
    buyingType: "Auction",
    status: "Active", 
    budget: "$45.00/day",
    amountSpent: 1120.89,
    impressions: 428600,
    reach: 356200,
    frequency: 1.20,
    cpm: 2.61,
    ctr: 4.43,
    cpc: 0.06,
    results: 524,
    costPerResult: 2.14,
    resultRate: 0.122,
    roas: 6.5,
    purchases: 524,
    purchaseValue: 7285.79,
    websiteLeads: 67,
    addToCart: 234,
    landingPageViews: 15680,
    linkClicks: 18970,
    saves: 312,
    // Ad Set level data
    delivery: "Active",
    optimizationGoal: "Conversions",
    bidStrategy: "Cost Cap",
    schedule: "Ongoing",
    audience: "Website Visitors",
    placement: "Facebook & Instagram",
    devices: "All Devices",
    clicks: 18970,
    cpcLinkClick: 0.06,
    conversions: 524,
    costPerConversion: 2.14,
    leads: 67,
    initiatedCheckout: 398,
    // Ad level data
    adCreative: "Carousel",
    format: "Carousel",
    callToAction: "Shop Now",
    allClicks: 19450,
    engagements: 3890,
    videoPlays: 0,
    purchase: 524,
    qualityRanking: "Above Average",
    engagementRateRanking: "Average",
    conversionRateRanking: "Above Average"
  }
];

const MetaAdsPage = () => {
  const [metrics, setMetrics] = useState(getOverviewMetrics());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<MetaAdsAccount | null>(null);
  
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

  const handleSelectAccount = (accountId: string) => {
    const account = mockMetaAccounts.find(acc => acc.id === accountId);
    setSelectedAccount(account || null);
    console.log('Selected account:', account);
  };

  // Initial data fetch when component mounts
  useEffect(() => {
    console.log('Initial Meta Ads data fetch with date range:', dateRange);
  }, []);

  // Calculate revenue data
  const totalRevenue = mockMetaAccounts.reduce((total, account) => {
    return total + (account.purchaseValue || 0);
  }, 0);

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Meta Ads Dashboard" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Meta Ads Overview</h2>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      <MetricsOverview metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <PerformanceChart data={dailyPerformance} />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-full">
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
          
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between">
                  <div>Facebook</div>
                  <div className="font-medium">${(totalRevenue * 0.62).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                </div>
                <div className="flex justify-between">
                  <div>Instagram</div>
                  <div className="font-medium">${(totalRevenue * 0.31).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                </div>
                <div className="flex justify-between">
                  <div>Audience Network</div>
                  <div className="font-medium">${(totalRevenue * 0.07).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="campaigns" className="mt-6">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="adsets">Ad Sets</TabsTrigger>
          <TabsTrigger value="ads">Ads</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="creative">Creative</TabsTrigger>
          <TabsTrigger value="budget">Budget & Bidding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-0">
          <CampaignLevelTable
            accounts={mockMetaAccounts}
            selectedAccount={selectedAccount}
            onSelectAccount={handleSelectAccount}
          />
        </TabsContent>
        
        <TabsContent value="adsets" className="mt-0">
          <AdSetLevelTable
            accounts={mockMetaAccounts}
            selectedAccount={selectedAccount}
            onSelectAccount={handleSelectAccount}
          />
        </TabsContent>
        
        <TabsContent value="ads" className="mt-0">
          <AdLevelTable
            accounts={mockMetaAccounts}
            selectedAccount={selectedAccount}
            onSelectAccount={handleSelectAccount}
          />
        </TabsContent>
        
        <TabsContent value="audience" className="mt-0">
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
        </TabsContent>
        
        <TabsContent value="creative" className="mt-0">
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
        </TabsContent>
        
        <TabsContent value="budget" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Budget & Bidding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockMetaAccounts.map((account) => (
                  <div key={account.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{account.name}</h3>
                        <p className="text-sm text-muted-foreground">Budget: {account.budget}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          <span className="font-medium">ROAS: </span>{account.roas}x
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">CPC: </span>${account.cpc.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs">Daily Budget</label>
                        <div className="mt-1 flex items-center">
                          <span className="text-sm font-medium">$</span>
                          <input
                            type="number"
                            className="ml-1 flex-1 border-0 border-b focus:ring-0 focus:border-black text-sm p-0"
                            defaultValue={parseFloat(account.budget.replace(/[^0-9.]/g, ''))}
                            step="1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs">Bid Strategy</label>
                        <select className="w-full mt-1 bg-transparent border-0 border-b focus:ring-0 focus:border-black text-sm p-0">
                          <option>Lowest Cost</option>
                          <option>Target CPA</option>
                          <option>Target ROAS</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetaAdsPage;
