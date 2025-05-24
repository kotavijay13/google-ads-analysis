
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChartLine, DollarSign, MousePointerClick, Eye, Target } from "lucide-react";

interface MetricsProps {
  metrics: {
    totalSpend: number;
    totalClicks: number;
    totalImpressions: number;
    totalConversions: number;
    avgCTR: number;
    avgCPC: number;
    avgConvRate: number;
    avgCPA: number;
  };
}

interface PlatformBreakdown {
  googleAds: {
    spend: number;
    clicks: number;
    impressions: number;
    conversions: number;
  };
  metaAds: {
    spend: number;
    clicks: number;
    impressions: number;
    conversions: number;
  };
}

const MetricsOverview = ({ metrics }: MetricsProps) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock platform breakdown data - this would come from your API
  const platformBreakdown: PlatformBreakdown = {
    googleAds: {
      spend: metrics.totalSpend * 0.65, // 65% Google Ads
      clicks: Math.floor(metrics.totalClicks * 0.58), // 58% Google Ads
      impressions: Math.floor(metrics.totalImpressions * 0.62), // 62% Google Ads
      conversions: Math.floor(metrics.totalConversions * 0.67), // 67% Google Ads
    },
    metaAds: {
      spend: metrics.totalSpend * 0.35, // 35% Meta Ads
      clicks: Math.floor(metrics.totalClicks * 0.42), // 42% Meta Ads
      impressions: Math.floor(metrics.totalImpressions * 0.38), // 38% Meta Ads
      conversions: Math.floor(metrics.totalConversions * 0.33), // 33% Meta Ads
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercent = (value: number) => {
    return value.toFixed(2) + '%';
  };

  const handleMetricClick = (metricName: string) => {
    setSelectedMetric(metricName);
    setIsDialogOpen(true);
  };

  const getBreakdownData = (metricName: string) => {
    switch (metricName) {
      case 'spend':
        return {
          total: metrics.totalSpend,
          googleValue: platformBreakdown.googleAds.spend,
          metaValue: platformBreakdown.metaAds.spend,
          formatter: formatCurrency,
        };
      case 'clicks':
        return {
          total: metrics.totalClicks,
          googleValue: platformBreakdown.googleAds.clicks,
          metaValue: platformBreakdown.metaAds.clicks,
          formatter: formatNumber,
        };
      case 'impressions':
        return {
          total: metrics.totalImpressions,
          googleValue: platformBreakdown.googleAds.impressions,
          metaValue: platformBreakdown.metaAds.impressions,
          formatter: formatNumber,
        };
      case 'conversions':
        return {
          total: metrics.totalConversions,
          googleValue: platformBreakdown.googleAds.conversions,
          metaValue: platformBreakdown.metaAds.conversions,
          formatter: formatNumber,
        };
      default:
        return null;
    }
  };

  const breakdownData = selectedMetric ? getBreakdownData(selectedMetric) : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleMetricClick('spend')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalSpend)}</div>
            <p className="text-xs text-muted-foreground">
              Avg. CPC: {formatCurrency(metrics.avgCPC)}
            </p>
            <p className="text-xs text-blue-600 mt-1">Click to see breakdown</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleMetricClick('clicks')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalClicks)}</div>
            <p className="text-xs text-muted-foreground">
              CTR: {formatPercent(metrics.avgCTR)}
            </p>
            <p className="text-xs text-blue-600 mt-1">Click to see breakdown</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleMetricClick('impressions')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalImpressions)}</div>
            <p className="text-xs text-muted-foreground">
              Visibility metric
            </p>
            <p className="text-xs text-blue-600 mt-1">Click to see breakdown</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleMetricClick('conversions')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalConversions)}</div>
            <p className="text-xs text-muted-foreground">
              Conv. Rate: {formatPercent(metrics.avgConvRate)}
            </p>
            <p className="text-xs text-blue-600 mt-1">Click to see breakdown</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="capitalize">{selectedMetric} Breakdown</DialogTitle>
            <DialogDescription>
              Platform performance comparison
            </DialogDescription>
          </DialogHeader>
          {breakdownData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="text-lg">🅖</span>
                      Google Ads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">
                      {breakdownData.formatter(breakdownData.googleValue)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((breakdownData.googleValue / breakdownData.total) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="text-lg">f</span>
                      Meta Ads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">
                      {breakdownData.formatter(breakdownData.metaValue)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((breakdownData.metaValue / breakdownData.total) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total {selectedMetric}:</span>
                  <span className="text-lg font-bold">
                    {breakdownData.formatter(breakdownData.total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MetricsOverview;
