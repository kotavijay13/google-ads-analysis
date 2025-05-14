
import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import MetricsOverview from '@/components/MetricsOverview';
import PerformanceChart from '@/components/PerformanceChart';
import CampaignTable from '@/components/CampaignTable';
import DeviceBreakdown from '@/components/DeviceBreakdown';
import GeoPerformance from '@/components/GeoPerformance';
import { campaignsData, dailyPerformance, deviceData, geoData, getOverviewMetrics } from '@/data/mockData';

const Index = () => {
  const [metrics] = useState(getOverviewMetrics());
  
  const handleRefresh = () => {
    // In a real application, this would fetch fresh data
    console.log('Refreshing data...');
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    // In a real application, this would filter the data based on the date range
    console.log('Date range changed:', range);
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Dashboard Overview</h2>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      <MetricsOverview metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={dailyPerformance} />
        <div className="grid gap-6 grid-cols-1">
          <DeviceBreakdown data={deviceData} />
          <GeoPerformance data={geoData} />
        </div>
      </div>
      
      <CampaignTable campaigns={campaignsData} />
    </div>
  );
};

export default Index;
