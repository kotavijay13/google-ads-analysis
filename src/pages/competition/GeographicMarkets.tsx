
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EnhancedAnalysisResponse } from './types';

interface GeographicMarketsProps {
  data: EnhancedAnalysisResponse;
}

const GeographicMarkets = ({ data }: GeographicMarketsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Geographic Markets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.overview.topCountries.map((country, index) => (
            <div key={country.country} className="flex items-center justify-between">
              <span className="font-medium">{country.country}</span>
              <div className="flex items-center gap-2">
                <Progress value={country.percentage} className="w-24" />
                <span className="text-sm font-medium">{country.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GeographicMarkets;
