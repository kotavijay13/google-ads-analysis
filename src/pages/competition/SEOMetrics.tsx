
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedAnalysisResponse } from './types';

interface SEOMetricsProps {
  data: EnhancedAnalysisResponse;
}

const SEOMetrics = ({ data }: SEOMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Organic Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.overview.organicKeywords.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {data.stats.top10Keywords} in top 10 • {data.stats.top3Keywords || 0} in top 3
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.stats.avgPosition}</div>
          <p className="text-xs text-muted-foreground">Across all ranked keywords</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Traffic Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.overview.trafficValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Estimated monthly value</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOMetrics;
