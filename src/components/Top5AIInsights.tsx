import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, Loader2 } from 'lucide-react';
import { Top5AIInsightsProps } from './insights/types';
import { initialInsights } from './insights/mockInsights';
import { useInsightsRefresh } from './insights/useInsightsRefresh';
import InsightItem from './insights/InsightItem';
import { useGlobalWebsite } from '@/context/GlobalWebsiteContext';

const Top5AIInsights = ({ onInsightCompleted }: Top5AIInsightsProps) => {
  const { insights, isLoading, handleRefresh } = useInsightsRefresh(initialInsights);
  const [completedInsights, setCompletedInsights] = useState<Set<string>>(new Set());
  const { selectedWebsite } = useGlobalWebsite();

  // Auto-refresh insights when website changes
  useEffect(() => {
    if (selectedWebsite) {
      console.log(`Website changed to ${selectedWebsite}, refreshing AI insights...`);
      handleRefresh();
    }
  }, [selectedWebsite, handleRefresh]);

  const handleMarkComplete = (insightId: string) => {
    setCompletedInsights(prev => new Set([...prev, insightId]));
    onInsightCompleted?.(insightId);
    console.log(`Insight ${insightId} marked as completed`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">
            Top 5 AI Insights for Today
            {selectedWebsite && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                • {selectedWebsite}
              </span>
            )}
          </CardTitle>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center space-x-1"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">
                Analyzing latest data from all channels
                {selectedWebsite && ` for ${selectedWebsite}`}...
              </p>
            </div>
          </div>
        ) : (
          insights.map((insight) => (
            <InsightItem
              key={insight.id}
              insight={insight}
              isCompleted={completedInsights.has(insight.id)}
              onMarkComplete={handleMarkComplete}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default Top5AIInsights;
