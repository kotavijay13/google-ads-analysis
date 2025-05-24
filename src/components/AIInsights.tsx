
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Loader2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AIInsightsProps {
  data: any;
  type: 'campaign' | 'adset' | 'ad';
}

const AIInsights = ({ data, type }: AIInsightsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const generateInsights = async () => {
    setIsLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const analysisData = analyzePerformance(data, type);
      setInsights(analysisData);
      setIsLoading(false);
    }, 2000);
  };

  const analyzePerformance = (itemData: any, itemType: string) => {
    const ctr = itemData.ctr || 0;
    const cpc = itemData.cpc || 0;
    const conversions = itemData.conversions || 0;
    const roas = itemData.roas || 0;
    const spend = itemData.spend || itemData.amountSpent || 0;

    let insights = [];
    let severity = 'good';

    // CTR Analysis
    if (ctr < 1) {
      insights.push("🔴 Low CTR detected. Consider refreshing ad creatives or improving targeting.");
      severity = 'critical';
    } else if (ctr < 2) {
      insights.push("🟡 CTR could be improved. Test new headlines or descriptions.");
      severity = 'warning';
    } else {
      insights.push("🟢 Strong CTR performance. Current creatives are resonating well.");
    }

    // CPC Analysis
    if (cpc > 2) {
      insights.push("🔴 High CPC detected. Consider adjusting bids or improving Quality Score.");
      if (severity !== 'critical') severity = 'critical';
    } else if (cpc > 1) {
      insights.push("🟡 CPC is moderate. Monitor competitor activity and optimize keywords.");
      if (severity === 'good') severity = 'warning';
    } else {
      insights.push("🟢 Excellent CPC efficiency. Current bidding strategy is effective.");
    }

    // ROAS Analysis
    if (roas < 2) {
      insights.push("🔴 Low ROAS. Review targeting, landing pages, and conversion tracking.");
      severity = 'critical';
    } else if (roas < 4) {
      insights.push("🟡 ROAS has room for improvement. Consider A/B testing different approaches.");
      if (severity === 'good') severity = 'warning';
    } else {
      insights.push("🟢 Excellent ROAS. This campaign is highly profitable.");
    }

    // Conversion Analysis
    if (conversions < 10) {
      insights.push("🔴 Low conversion volume. Increase budget or expand targeting.");
      if (severity !== 'critical') severity = 'critical';
    } else if (conversions < 50) {
      insights.push("🟡 Moderate conversion volume. Consider scaling successful elements.");
      if (severity === 'good') severity = 'warning';
    } else {
      insights.push("🟢 Strong conversion performance. Campaign is generating good results.");
    }

    // Recommendations
    insights.push("\n📊 Recommendations:");
    if (severity === 'critical') {
      insights.push("• Pause underperforming ads and reallocate budget");
      insights.push("• Review and optimize landing page experience");
      insights.push("• Consider testing new audiences or keywords");
    } else if (severity === 'warning') {
      insights.push("• Test new ad variations to improve performance");
      insights.push("• Monitor daily and adjust bids as needed");
      insights.push("• Consider expanding to similar audiences");
    } else {
      insights.push("• Scale this successful campaign by increasing budget");
      insights.push("• Use these learnings for other campaigns");
      insights.push("• Continue monitoring for optimization opportunities");
    }

    return insights.join('\n');
  };

  const getSeverityIcon = () => {
    if (!insights) return <Brain className="h-4 w-4" />;
    
    if (insights.includes('🔴')) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (insights.includes('🟡')) return <TrendingDown className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            if (!insights) {
              generateInsights();
            }
            setIsOpen(true);
          }}
          className="h-8 w-8 p-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            getSeverityIcon()
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Brain className="h-4 w-4" />
                AI Performance Insights
              </div>
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing performance data...
                </div>
              ) : insights ? (
                <div className="text-xs whitespace-pre-line text-muted-foreground">
                  {insights}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Click to generate AI insights for this {type}.
                </div>
              )}
              {insights && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={generateInsights}
                  className="w-full mt-2"
                >
                  Refresh Analysis
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default AIInsights;
