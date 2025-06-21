
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, Award, Target, BarChart3 } from 'lucide-react';

interface KeywordRankingBreakdownProps {
  keywords: any[];
}

const KeywordRankingBreakdown = ({ keywords }: KeywordRankingBreakdownProps) => {
  const calculateRankingBreakdown = () => {
    const breakdown = {
      top3: 0,
      top5: 0,
      top10: 0,
      top50: 0,
      top100: 0,
      notRanking: 0
    };

    keywords.forEach(keyword => {
      const position = parseFloat(keyword.position);
      
      if (position <= 3) {
        breakdown.top3++;
      } else if (position <= 5) {
        breakdown.top5++;
      } else if (position <= 10) {
        breakdown.top10++;
      } else if (position <= 50) {
        breakdown.top50++;
      } else if (position <= 100) {
        breakdown.top100++;
      } else {
        breakdown.notRanking++;
      }
    });

    return breakdown;
  };

  const breakdown = calculateRankingBreakdown();
  
  const chartData = [
    { name: 'Top 3', value: breakdown.top3, color: '#10b981' },
    { name: 'Top 5', value: breakdown.top5, color: '#f59e0b' },
    { name: 'Top 10', value: breakdown.top10, color: '#3b82f6' },
    { name: 'Top 50', value: breakdown.top50, color: '#8b5cf6' },
    { name: 'Top 100', value: breakdown.top100, color: '#ef4444' },
    { name: 'Not ranking', value: breakdown.notRanking, color: '#f87171' }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white border rounded-xl shadow-lg p-4 border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600 mt-1">
            {data.value} keywords ({((data.value / keywords.length) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Placeholder content when no keywords
  if (keywords.length === 0) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            Current Search Result Rankings
            <Badge variant="outline" className="text-sm px-3 py-1 bg-blue-50 border-blue-200 text-blue-700">
              0 total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className="text-center p-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  Please select a website and refresh data to load keyword ranking information.
                </p>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 space-y-4">
              {[
                { label: 'Top 3', value: 0, color: '#10b981', icon: Award },
                { label: 'Top 5', value: 0, color: '#f59e0b', icon: TrendingUp },
                { label: 'Top 10', value: 0, color: '#3b82f6', icon: Target },
                { label: 'Top 50', value: 0, color: '#8b5cf6', icon: TrendingUp },
                { label: 'Top 100', value: 0, color: '#ef4444', icon: TrendingUp },
                { label: 'Not ranking', value: 0, color: '#f87171', icon: TrendingUp }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 rounded-full shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <item.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-400">{item.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400">0%</span>
                    <Badge variant="secondary" className="text-sm px-2 py-1 bg-white border text-gray-400">
                      0
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          Current Search Result Rankings
          <Badge variant="outline" className="text-sm px-3 py-1 bg-blue-50 border-blue-200 text-blue-700">
            {keywords.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-4">
            {[
              { label: 'Top 3', value: breakdown.top3, color: '#10b981', icon: Award },
              { label: 'Top 5', value: breakdown.top5, color: '#f59e0b', icon: TrendingUp },
              { label: 'Top 10', value: breakdown.top10, color: '#3b82f6', icon: Target },
              { label: 'Top 50', value: breakdown.top50, color: '#8b5cf6', icon: TrendingUp },
              { label: 'Top 100', value: breakdown.top100, color: '#ef4444', icon: TrendingUp },
              { label: 'Not ranking', value: breakdown.notRanking, color: '#f87171', icon: TrendingUp }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-full shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <item.icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    {keywords.length > 0 ? ((item.value / keywords.length) * 100).toFixed(0) : 0}%
                  </span>
                  <Badge variant="secondary" className="text-sm px-2 py-1 bg-white border">
                    {item.value}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordRankingBreakdown;
