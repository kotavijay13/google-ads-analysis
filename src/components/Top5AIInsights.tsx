import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, RefreshCw, Loader2, TrendingUp, AlertTriangle, Target, Users, Search, LucideIcon } from 'lucide-react';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Medium Impact' | 'Low Impact';
  source: 'Google Ads' | 'Meta Ads' | 'SEO' | 'Leads' | 'Competition';
  icon: LucideIcon;
  actionable: boolean;
}

interface Top5AIInsightsProps {
  onInsightCompleted?: (insightId: string) => void;
}

const Top5AIInsights = ({ onInsightCompleted }: Top5AIInsightsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      title: "Increase bid for 'digital marketing' keyword",
      description: "Currently underperforming with high potential ROI",
      impact: 'High Impact',
      source: 'Google Ads',
      icon: TrendingUp,
      actionable: true
    },
    {
      id: '2',
      title: "Optimize meta descriptions for top 5 landing pages",
      description: "Current CTR is below average",
      impact: 'Medium Impact',
      source: 'SEO',
      icon: Search,
      actionable: true
    },
    {
      id: '3',
      title: "Refresh creative for Instagram Story campaign",
      description: "Engagement dropping over the past week",
      impact: 'High Impact',
      source: 'Meta Ads',
      icon: AlertTriangle,
      actionable: true
    },
    {
      id: '4',
      title: "Target competitor keyword 'marketing automation'",
      description: "Competitor ranking dropped, opportunity to gain position",
      impact: 'Medium Impact',
      source: 'Competition',
      icon: Target,
      actionable: true
    },
    {
      id: '5',
      title: "Follow up with 12 high-value leads",
      description: "Leads from last week's campaign waiting for response",
      impact: 'High Impact',
      source: 'Leads',
      icon: Users,
      actionable: true
    }
  ]);

  const [completedInsights, setCompletedInsights] = useState<Set<string>>(new Set());

  const handleRefresh = async () => {
    setIsLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      console.log('Refreshing AI insights with latest data from all channels...');
      
      // Simulate new insights based on fresh data analysis
      const newInsights: AIInsight[] = [
        {
          id: Math.random().toString(),
          title: "Boost budget for high-performing Summer Sale campaign",
          description: "ROI increased 23% this week, scale opportunity detected",
          impact: 'High Impact',
          source: 'Google Ads',
          icon: TrendingUp,
          actionable: true
        },
        {
          id: Math.random().toString(),
          title: "Update ad copy for mobile users",
          description: "Mobile CTR 15% lower than desktop, creative refresh needed",
          impact: 'Medium Impact',
          source: 'Meta Ads',
          icon: AlertTriangle,
          actionable: true
        },
        ...insights.slice(2, 5)
      ];
      
      setInsights(newInsights);
      setIsLoading(false);
    }, 2000);
  };

  const handleMarkComplete = (insightId: string) => {
    setCompletedInsights(prev => new Set([...prev, insightId]));
    onInsightCompleted?.(insightId);
    console.log(`Insight ${insightId} marked as completed`);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High Impact':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium Impact':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low Impact':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'Google Ads':
        return 'bg-green-100 text-green-800';
      case 'Meta Ads':
        return 'bg-blue-100 text-blue-800';
      case 'SEO':
        return 'bg-purple-100 text-purple-800';
      case 'Leads':
        return 'bg-orange-100 text-orange-800';
      case 'Competition':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Top 5 AI Insights for Today</CardTitle>
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
              <p className="text-sm text-muted-foreground">Analyzing latest data from all channels...</p>
            </div>
          </div>
        ) : (
          insights.map((insight, index) => {
            const IconComponent = insight.icon;
            const isCompleted = completedInsights.has(insight.id);
            
            return (
              <div 
                key={insight.id} 
                className={`p-4 border rounded-lg transition-all ${
                  isCompleted ? 'bg-green-50 border-green-200 opacity-75' : 'bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <IconComponent size={16} color="currentColor" />
                    <h4 className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                      {insight.title}
                    </h4>
                  </div>
                  {!isCompleted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkComplete(insight.id)}
                      className="h-6 px-2 text-xs"
                    >
                      Done
                    </Button>
                  )}
                </div>
                
                <p className={`text-xs mb-3 ${isCompleted ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`text-xs ${getImpactColor(insight.impact)}`}>
                      {insight.impact}
                    </Badge>
                    <Badge variant="secondary" className={`text-xs ${getSourceColor(insight.source)}`}>
                      {insight.source}
                    </Badge>
                  </div>
                  {isCompleted && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default Top5AIInsights;
