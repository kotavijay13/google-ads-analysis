
import KeywordRankingBreakdown from './KeywordRankingBreakdown';
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
}

const SEOStatsCards = ({ serpStats, serpKeywords = [] }: SEOStatsCardsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-8">
      {/* Main Stats Grid - Enhanced with better visual hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">Total Clicks</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <MousePointer className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-blue-900 mb-1">{formatNumber(serpStats.totalClicks)}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                From GSC data
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">Keywords Ranked</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-green-900 mb-1">{formatNumber(serpStats.totalKeywords)}</div>
            <div className="flex items-center text-xs">
              <div className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{serpStats.top10Keywords} in top 10
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-amber-700">Average Position</CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-amber-900 mb-1">{serpStats.avgPosition}</div>
            <div className="flex items-center text-xs text-amber-600">
              <Badge variant="outline" className="text-xs border-amber-200 text-amber-700 bg-amber-50">
                Overall ranking
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">Total Impressions</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-purple-900 mb-1">{formatNumber(serpStats.totalImpressions)}</div>
            <div className="flex items-center text-xs">
              <div className="flex items-center text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                <Eye className="h-3 w-3 mr-1" />
                CTR: {serpStats.avgCTR.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Ranking Breakdown - Enhanced card */}
      {serpKeywords.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <KeywordRankingBreakdown keywords={serpKeywords} />
        </div>
      )}
    </div>
  );
};

export default SEOStatsCards;
