
import Header from "@/components/Header";
import DateRangePicker from "@/components/DateRangePicker";
import MetricsOverview from "@/components/MetricsOverview";
import PerformanceChart from "@/components/PerformanceChart";
import CampaignTable from "@/components/CampaignTable";
import ChangeTracker from "@/components/dashboard/ChangeTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useCallback } from "react";
import { 
  dailyPerformance, 
  getOverviewMetrics
} from "@/data/mockData";

// Mock campaigns data with all required Campaign interface properties
const mockCampaigns = [
  {
    id: "1",
    name: "Spring Collection Campaign",
    status: "Active" as const,
    impressions: 45000,
    clicks: 1200,
    ctr: 2.67,
    cpc: 0.85,
    conversions: 89,
    spend: 1020,
    conversionRate: 7.42, // (89/1200) * 100
    costPerConversion: 11.46 // 1020/89
  },
  {
    id: "2", 
    name: "Summer Promotion",
    status: "Active" as const,
    impressions: 32000,
    clicks: 890,
    ctr: 2.78,
    cpc: 0.92,
    conversions: 67,
    spend: 819,
    conversionRate: 7.53, // (67/890) * 100
    costPerConversion: 12.22 // 819/67
  }
];

const Index = () => {
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
      setMetrics(getOverviewMetrics());
      setIsLoading(false);
      console.log('Data refreshed');
    }, 1000);
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Dashboard" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Marketing Performance Overview</h2>
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
        
        <ChangeTracker />
      </div>
      
      <CampaignTable campaigns={mockCampaigns} />
    </div>
  );
};

export default Index;
