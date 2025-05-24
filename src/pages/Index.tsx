
import { useState } from 'react';
import Header from '@/components/Header';
import MetricsOverview from '@/components/MetricsOverview';
import AIInsights from '@/components/AIInsights';
import { dailyData } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <MetricsOverview />
          <div className="grid grid-cols-1 gap-6">
            <AIInsights />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
