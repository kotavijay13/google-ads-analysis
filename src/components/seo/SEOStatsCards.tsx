
import { Card, CardContent } from '@/components/ui/card';

interface SEOStatsCardsProps {
  serpStats: {
    totalKeywords: number;
    top10Keywords: number;
    avgPosition: string;
    estTraffic: number;
    totalClicks?: number;
    totalImpressions?: number;
    avgCTR?: number;
  };
}

const SEOStatsCards = ({ serpStats }: SEOStatsCardsProps) => {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">SEO Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
              <p className="text-3xl font-bold">{formatNumber(serpStats.totalClicks || 0)}</p>
              <p className="text-sm text-green-500">From GSC data</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Keywords Ranked</p>
              <p className="text-3xl font-bold">{serpStats.totalKeywords}</p>
              <p className="text-sm text-green-500">+{serpStats.top10Keywords} in top 10</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Position</p>
              <p className="text-3xl font-bold">{serpStats.avgPosition}</p>
              <p className="text-sm text-green-500">From GSC data</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Impressions</p>
              <p className="text-3xl font-bold">{formatNumber(serpStats.totalImpressions || 0)}</p>
              <p className="text-sm text-green-500">CTR: {formatPercent(serpStats.avgCTR || 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SEOStatsCards;
