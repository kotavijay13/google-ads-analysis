
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import RankingPieChart from './keyword-ranking/RankingPieChart';
import RankingStatsList from './keyword-ranking/RankingStatsList';
import RankingPlaceholder from './keyword-ranking/RankingPlaceholder';
import { calculateRankingBreakdown, createChartData } from './keyword-ranking/utils';

interface KeywordRankingBreakdownProps {
  keywords: any[];
}

const KeywordRankingBreakdown = ({ keywords }: KeywordRankingBreakdownProps) => {
  const breakdown = calculateRankingBreakdown(keywords);
  const chartData = createChartData(breakdown);
  const hasData = keywords.length > 0;

  return (
    <div className="p-5">
      <div className="flex items-center gap-4 mb-5">
        <div className="p-2.5 bg-blue-100 rounded-xl">
          <Target className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Current Search Result Rankings</h3>
          <p className="text-gray-500 text-sm mt-0.5">Keyword performance breakdown by ranking position</p>
        </div>
        <Badge 
          variant="outline" 
          className={`ml-auto text-sm px-3 py-1 border-gray-200 ${
            hasData ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600'
          }`}
        >
          {keywords.length} total
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {hasData ? (
            <RankingPieChart chartData={chartData} totalKeywords={keywords.length} />
          ) : (
            <RankingPlaceholder />
          )}
        </div>
        
        <RankingStatsList 
          breakdown={breakdown} 
          totalKeywords={keywords.length} 
          hasData={hasData} 
        />
      </div>
    </div>
  );
};

export default KeywordRankingBreakdown;
