
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Globe, TrendingUp, Eye, Users } from 'lucide-react';
import { EnhancedAnalysisResponse } from './types';

interface TrafficOverviewCardsProps {
  data: EnhancedAnalysisResponse;
}

const TrafficOverviewCards = ({ data }: TrafficOverviewCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Monthly Visits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.overview.monthlyVisits.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Estimated organic visits</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Domain Authority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.overview.domainAuthority}</div>
          <Progress value={data.overview.domainAuthority} className="mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visibility Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.stats.visibilityScore}%</div>
          <Badge variant={data.stats.competitionLevel === 'High' ? 'destructive' : 
            data.stats.competitionLevel === 'Medium' ? 'secondary' : 'default'}>
            {data.stats.competitionLevel} Competition
          </Badge>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Backlinks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.overview.backlinks.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{data.overview.referringDomains.toLocaleString()} referring domains</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficOverviewCards;
