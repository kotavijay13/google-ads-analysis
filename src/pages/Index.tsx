
import { useState } from 'react';
import Header from '@/components/Header';
import MetricsOverview from '@/components/MetricsOverview';
import AIInsights from '@/components/AIInsights';
import { getOverviewMetrics } from '@/data/mockData';

const Index = () => {
  const metrics = getOverviewMetrics();

  const handleRefresh = () => {
    // Refresh functionality - could trigger data refetch
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={handleRefresh} title="Marketing Dashboard" />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <MetricsOverview metrics={metrics} />
          <div className="grid grid-cols-1 gap-6">
            <AIInsights data={metrics} type="campaign" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
