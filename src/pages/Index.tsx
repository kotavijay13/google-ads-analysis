
import { useState } from 'react';
import Header from '@/components/Header';
import MetricsOverview from '@/components/MetricsOverview';
import CampaignTable from '@/components/CampaignTable';
import Top5AIInsights from '@/components/Top5AIInsights';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { useGlobalWebsite } from '@/context/GlobalWebsiteContext';
import { useSEOData } from '@/hooks/useSEOData';
import { getOverviewMetrics, getDailyPerformance, getCampaigns } from '@/data/mockData';

const Index = () => {
  const metrics = getOverviewMetrics();
  const dailyPerformance = getDailyPerformance();
  const campaigns = getCampaigns();
  const { selectedWebsite, setSelectedWebsite } = useGlobalWebsite();
  const { availableWebsites } = useSEOData();

  const handleRefresh = () => {
    // Refresh functionality - could trigger data refetch
    window.location.reload();
  };

  const handleInsightCompleted = (insightId: string) => {
    console.log(`AI Insight ${insightId} has been completed and will trigger fresh data analysis`);
    // Here you could trigger a refresh of related data based on the completed insight
  };

  const handleWebsiteChange = (website: string) => {
    setSelectedWebsite(website);
    console.log(`Global website selection changed to: ${website}`);
  };

  return (
    <div className="min-h-screen">
      <Header onRefresh={handleRefresh} title="AI Insights" />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Website Selector Card */}
          <Card className="border-primary/20 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Globe className="h-5 w-5" />
                Select Website for Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <Select value={selectedWebsite || ''} onValueChange={handleWebsiteChange}>
                    <SelectTrigger className="w-full sm:w-[400px]">
                      <SelectValue placeholder="Choose a website to analyze across all channels" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWebsites.map((website) => (
                        <SelectItem key={website} value={website}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            {website}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedWebsite && (
                    <p className="text-sm text-muted-foreground mt-2">
                      All channels (Google Ads, Meta Ads, SEO, Leads) will show data for: <strong>{selectedWebsite}</strong>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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
