
import { Card, CardContent } from '@/components/ui/card';

interface SEOStatsCardsProps {
  serpStats: {
    totalKeywords: number;
    top10Keywords: number;
    avgPosition: string;
    estTraffic: number;
  };
}

const SEOStatsCards = ({ serpStats }: SEOStatsCardsProps) => {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">SEO Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Organic Traffic</p>
              <p className="text-3xl font-bold">5,238</p>
              <p className="text-sm text-green-500">+12% from last month</p>
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
              <p className="text-sm text-green-500">Improved by 1.2</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Est. Traffic</p>
              <p className="text-3xl font-bold">{serpStats.estTraffic.toLocaleString()}</p>
              <p className="text-sm text-green-500">+18% from SERP data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SEOStatsCards;
