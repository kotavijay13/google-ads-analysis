
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedAnalysisResponse } from './types';

interface TrafficDistributionProps {
  data: EnhancedAnalysisResponse;
}

const TrafficDistribution = ({ data }: TrafficDistributionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Sources Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(data.overview.trafficDistribution).map(([source, percentage]) => (
            <div key={source} className="text-center">
              <div className="text-2xl font-bold text-primary">{percentage}%</div>
              <div className="text-sm text-muted-foreground capitalize">{source}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficDistribution;
