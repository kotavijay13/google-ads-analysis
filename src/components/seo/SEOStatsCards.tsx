
import KeywordRankingBreakdown from './KeywordRankingBreakdown';
import AveragePositionChart from './AveragePositionChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Eye, MousePointer, Zap, Globe } from 'lucide-react';

interface SEOStatsCardsProps {
  serpStats: {
    totalKeywords: number;
    top10Keywords: number;
    avgPosition: string;
    estTraffic: number;
    totalPages: number;
    topPerformingPages: any[];
    totalClicks: number;
    totalImpressions: number;
    avgCTR: number;
  };
  serpKeywords?: any[];
  selectedWebsite?: string;
  showOnlyAveragePosition?: boolean;
  showOnlyStatsCards?: boolean;
  showOnlyRankingBreakdown?: boolean;
}

const SEOStatsCards = ({ 
  serpStats, 
  serpKeywords = [], 
  selectedWebsite = '',
  showOnlyAveragePosition = false,
  showOnlyStatsCards = false,
  showOnlyRankingBreakdown = false
}: SEOStatsCardsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const hasData = serpKeywords.length > 0 && Boolean(selectedWebsite);

  // Show only Average Position Chart
  if (showOnlyAveragePosition) {
    return (
      <div className="h-full">
        <AveragePositionChart 
          selectedWebsite={selectedWebsite} 
          hasData={hasData}
          avgPosition={serpStats.avgPosition}
        />
      </div>
    );
  }

  // Show only Stats Cards
  if (showOnlyStatsCards) {
    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        <Card className="relative overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 group h-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
          <CardHeader className="pb-2 pt-4 px-4 relative">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-500 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200">
                <MousePointer className="h-4 w-4 text-white" />
              </div>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                GSC
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4 relative">
            <CardTitle className="text-xs font-medium text-gray-600 mb-1">Total Clicks</CardTitle>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(serpStats.totalClicks)}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 group h-32">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
          <CardHeader className="pb-2 pt-4 px-4 relative">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-500 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>+{serpStats.top10Keywords}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4 relative">
            <CardTitle className="text-xs font-medium text-gray-600 mb-1">Keywords Ranked</CardTitle>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(serpStats.totalKeywords)}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 group h-32">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10"></div>
          <CardHeader className="pb-2 pt-4 px-4 relative">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-amber-500 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                Avg
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4 relative">
            <CardTitle className="text-xs font-medium text-gray-600 mb-1">Average Position</CardTitle>
            <div className="text-2xl font-bold text-gray-900">{serpStats.avgPosition}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 group h-32">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
          <CardHeader className="pb-2 pt-4 px-4 relative">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-500 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs text-purple-600 font-medium">
                <span>CTR: {serpStats.avgCTR.toFixed(1)}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4 relative">
            <CardTitle className="text-xs font-medium text-gray-600 mb-1">Total Impressions</CardTitle>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(serpStats.totalImpressions)}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show only Ranking Breakdown
  if (showOnlyRankingBreakdown) {
    return <KeywordRankingBreakdown keywords={serpKeywords} />;
  }

  // Default view (shouldn't be used with the new layout)
  return null;
};

export default SEOStatsCards;
