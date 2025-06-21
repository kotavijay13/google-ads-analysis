
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

  const hasData = serpKeywords.length > 0 && selectedWebsite;

  // Show only Average Position Chart
  if (showOnlyAveragePosition) {
    return (
      <div className="h-full">
        <AveragePositionChart 
          selectedWebsite={selectedWebsite} 
          hasData={hasData} 
        />
      </div>
    );
  }

  // Show only Stats Cards
  if (showOnlyStatsCards) {
    return (
      <div className="grid grid-cols-1 gap-3">
        <Card className="relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
          <CardHeader className="pb-1 pt-2 px-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 bg-blue-500 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200">
                  <MousePointer className="h-2.5 w-2.5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xs font-medium text-gray-600">Total Clicks</CardTitle>
                  <div className="text-lg font-bold text-gray-900 mt-0.5">{formatNumber(serpStats.totalClicks)}</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-2 px-3 relative">
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              From GSC data
            </Badge>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
          <CardHeader className="pb-1 pt-2 px-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 bg-green-500 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="h-2.5 w-2.5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xs font-medium text-gray-600">Keywords Ranked</CardTitle>
                  <div className="text-lg font-bold text-gray-900 mt-0.5">{formatNumber(serpStats.totalKeywords)}</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-2 px-3 relative">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-1.5 w-1.5 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+{serpStats.top10Keywords} in top 10</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10"></div>
          <CardHeader className="pb-1 pt-2 px-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 bg-amber-500 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200">
                  <Zap className="h-2.5 w-2.5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xs font-medium text-gray-600">Average Position</CardTitle>
                  <div className="text-lg font-bold text-gray-900 mt-0.5">{serpStats.avgPosition}</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-2 px-3 relative">
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              Overall ranking
            </Badge>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
          <CardHeader className="pb-1 pt-2 px-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 bg-purple-500 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200">
                  <Eye className="h-2.5 w-2.5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xs font-medium text-gray-600">Total Impressions</CardTitle>
                  <div className="text-lg font-bold text-gray-900 mt-0.5">{formatNumber(serpStats.totalImpressions)}</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-2 px-3 relative">
            <div className="flex items-center gap-1">
              <Eye className="h-1.5 w-1.5 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">CTR: {serpStats.avgCTR.toFixed(1)}%</span>
            </div>
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
