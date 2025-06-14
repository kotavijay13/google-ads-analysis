
import { useState } from 'react';
import Header from '@/components/Header';
import MetricsOverview from '@/components/MetricsOverview';
import CampaignTable from '@/components/CampaignTable';
import Top5AIInsights from '@/components/Top5AIInsights';
import { getOverviewMetrics, getDailyPerformance, getCampaigns } from '@/data/mockData';

const Index = () => {
  const metrics = getOverviewMetrics();
  const dailyPerformance = getDailyPerformance();
  const campaigns = getCampaigns();

  const handleRefresh = () => {
    // Refresh functionality - could trigger data refetch
    window.location.reload();
  };

  const handleInsightCompleted = (insightId: string) => {
    console.log(`AI Insight ${insightId} has been completed and will trigger fresh data analysis`);
    // Here you could trigger a refresh of related data based on the completed insight
  };

  return (
    <div className="min-h-screen">
      <Header onRefresh={handleRefresh} title="Marketing Dashboard" />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <MetricsOverview metrics={metrics} />
          
          <div className="w-full">
            <Top5AIInsights onInsightCompleted={handleInsightCompleted} />
          </div>
          
          <CampaignTable campaigns={campaigns} />
        </div>
      </main>
    </div>
  );
};

export default Index;
