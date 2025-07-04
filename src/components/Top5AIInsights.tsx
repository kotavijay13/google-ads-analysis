import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, Loader2 } from 'lucide-react';
import { Top5AIInsightsProps } from './insights/types';
import { initialInsights } from './insights/mockInsights';
import { useInsightsRefresh } from './insights/useInsightsRefresh';
import InsightItem from './insights/InsightItem';
import { useGlobalWebsite } from '@/context/GlobalWebsiteContext';
import ErrorBoundary from './ErrorBoundary';

const Top5AIInsights = ({ onInsightCompleted }: Top5AIInsightsProps) => {
  const { insights, isLoading, handleRefresh, error } = useInsightsRefresh(initialInsights);
  const [completedInsights, setCompletedInsights] = useState<Set<string>>(new Set());
  const { selectedWebsite } = useGlobalWebsite();

  // Auto-refresh insights when website changes
  useEffect(() => {
    if (selectedWebsite) {
      console.log(`Website changed to ${selectedWebsite}, refreshing AI insights...`);
      handleRefresh(selectedWebsite);
    }
  }, [selectedWebsite, handleRefresh]);

  const handleMarkComplete = (insightId: string) => {
    setCompletedInsights(prev => new Set([...prev, insightId]));
    onInsightCompleted?.(insightId);
    console.log(`Insight ${insightId} marked as completed`);
  };

  const handleManualRefresh = () => {
    if (selectedWebsite) {
      handleRefresh(selectedWebsite);
    } else {
      handleRefresh();
    }
  };

  return (
    <ErrorBoundary>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">
              AI Insights Analysis
              {selectedWebsite && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  • {selectedWebsite}
                </span>
              )}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="flex items-center space-x-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              <span>Generate AI Insights</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManualRefresh}
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
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>AI Analysis Error:</strong> {error}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Using fallback insights instead. Please check your configuration or try again later.
              </p>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">
                  AI is analyzing your marketing data
                  {selectedWebsite && ` for ${selectedWebsite}`}...
                </p>
              </div>
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {selectedWebsite 
                  ? `Click "Generate AI Insights" to analyze SEO performance for ${selectedWebsite}`
                  : 'Select a website and click "Generate AI Insights" to get personalized SEO recommendations'
                }
              </p>
              <Button 
                variant="default" 
                onClick={handleManualRefresh}
                disabled={!selectedWebsite}
                className="flex items-center space-x-2"
              >
                <Brain className="h-4 w-4" />
                <span>Generate AI Insights</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <InsightItem
                  key={insight.id}
                  insight={insight}
                  isCompleted={completedInsights.has(insight.id)}
                  onMarkComplete={handleMarkComplete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default Top5AIInsights;
