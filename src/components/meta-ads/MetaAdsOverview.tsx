
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PerformanceChart from '@/components/PerformanceChart';
import MetaRevenueCard from './MetaRevenueCard';

interface MetaAdsOverviewProps {
  dailyPerformance: any[];
  totalRevenue: number;
}

const MetaAdsOverview = ({ dailyPerformance, totalRevenue }: MetaAdsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <PerformanceChart data={dailyPerformance} />
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <MetaRevenueCard totalRevenue={totalRevenue} />
      </div>
    </div>
  );
};

export default MetaAdsOverview;
