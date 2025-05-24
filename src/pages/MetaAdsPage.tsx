
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import ChannelMetricsOverview from '@/components/ChannelMetricsOverview';
import MetaAdsOverview from '@/components/meta-ads/MetaAdsOverview';
import MetaAdsTabs from '@/components/meta-ads/MetaAdsTabs';
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

      <ChannelMetricsOverview metrics={metrics} />
      
      <MetaAdsOverview 
        dailyPerformance={dailyPerformance} 
        totalRevenue={totalRevenue} 
      />
      
      <MetaAdsTabs 
        accounts={mockMetaAccounts}
        selectedAccount={selectedAccount}
        onSelectAccount={handleSelectAccount}
      />
    </div>
  );
};

export default MetaAdsPage;
