
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, Target, TrendingDown } from 'lucide-react';

interface RankingBreakdown {
  top3: number;
  top5: number;
  top10: number;
  top50: number;
  top100: number;
  notRanking: number;
}

interface RankingStatsListProps {
  breakdown: RankingBreakdown;
  totalKeywords: number;
  hasData: boolean;
}

const RankingStatsList = ({ breakdown, totalKeywords, hasData }: RankingStatsListProps) => {
  const statsItems = [
    { label: 'Top 3', value: breakdown.top3, color: '#10b981', icon: Award, desc: 'Excellent positions' },
    { label: 'Top 5', value: breakdown.top5, color: '#f59e0b', icon: TrendingUp, desc: 'Great positions' },
    { label: 'Top 10', value: breakdown.top10, color: '#3b82f6', icon: Target, desc: 'Good positions' },
    { label: 'Top 50', value: breakdown.top50, color: '#8b5cf6', icon: TrendingUp, desc: 'Moderate positions' },
    { label: 'Top 100', value: breakdown.top100, color: '#ef4444', icon: TrendingDown, desc: 'Lower positions' },
    { label: 'Not ranking', value: breakdown.notRanking, color: '#f87171', icon: TrendingDown, desc: 'Below position 100' }
  ];

  return (
    <div className="space-y-2">
      {statsItems.map((item) => (
        <div 
          key={item.label} 
          className={`flex items-center justify-between p-2.5 rounded-lg border border-gray-100 transition-colors ${
            hasData ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-50/70 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shadow-sm border border-white"
                style={{ backgroundColor: item.color }}
              />
              <div className="p-1 bg-white rounded-md shadow-sm">
                <item.icon className={`w-3 h-3 ${hasData ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <span className={`text-xs font-semibold ${hasData ? 'text-gray-700' : 'text-gray-600'}`}>
                  {item.label}
                </span>
                <p className={`text-xs ${hasData ? 'text-gray-500' : 'text-gray-400'} hidden sm:block`}>
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${hasData ? 'text-gray-600' : 'text-gray-400'}`}>
              {hasData && totalKeywords > 0 ? ((item.value / totalKeywords) * 100).toFixed(0) : 0}%
            </span>
            <Badge 
              variant="secondary" 
              className={`text-xs px-2 py-0.5 bg-white border border-gray-200 min-w-[2rem] justify-center ${
                hasData ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {item.value}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RankingStatsList;
