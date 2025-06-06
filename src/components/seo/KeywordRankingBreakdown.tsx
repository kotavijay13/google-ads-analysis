
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
        <div className="bg-white border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
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
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Current Search Result Rankings
          <Badge variant="outline" className="text-xs">
            {keywords.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-3">
            {[
              { label: 'Top 3', value: breakdown.top3, color: '#10b981' },
              { label: 'Top 5', value: breakdown.top5, color: '#f59e0b' },
              { label: 'Top 10', value: breakdown.top10, color: '#3b82f6' },
              { label: 'Top 50', value: breakdown.top50, color: '#8b5cf6' },
              { label: 'Top 100', value: breakdown.top100, color: '#ef4444' },
              { label: 'Not ranking', value: breakdown.notRanking, color: '#f87171' }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {keywords.length > 0 ? ((item.value / keywords.length) * 100).toFixed(0) : 0}%
                  </span>
                  <Badge variant="outline" className="text-xs">
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
