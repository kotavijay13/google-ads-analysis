
import { useState } from 'react';
import Header from '@/components/Header';
import MetricsOverview from '@/components/MetricsOverview';
import AIInsights from '@/components/AIInsights';
import { getOverviewMetrics } from '@/data/mockData';

const Index = () => {
  const [metrics] = useState(getOverviewMetrics());
  
  const handleRefresh = () => {
    console.log('Data refreshed');
  };

  // Mock data for AI insights
  const mockInsightsData = {
    ctr: 2.5,
    cpc: 0.85,
    conversions: 89,
    roas: 4.2,
    spend: 1020
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={handleRefresh} title="Dashboard" />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <MetricsOverview metrics={metrics} />
          <div className="grid grid-cols-1 gap-6">
            <AIInsights data={mockInsightsData} type="campaign" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
