
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AveragePositionChartProps {
  selectedWebsite: string;
  hasData?: boolean;
}

const AveragePositionChart = ({ selectedWebsite, hasData = false }: AveragePositionChartProps) => {
  // Mock data for demonstration - in real app, this would come from props
  const mockData = [
    { date: '5/22', position: 29.2 },
    { date: '5/24', position: 32.1 },
    { date: '5/26', position: 31.8 },
    { date: '5/28', position: 33.2 },
    { date: '5/30', position: 28.9 },
    { date: '6/01', position: 27.3 },
    { date: '6/03', position: 28.1 },
    { date: '6/05', position: 26.8 },
    { date: '6/07', position: 25.4 },
    { date: '6/09', position: 24.7 },
    { date: '6/11', position: 27.1 },
    { date: '6/13', position: 28.3 },
    { date: '6/15', position: 27.6 }
  ];

  const currentPosition = hasData ? mockData[mockData.length - 1]?.position : 0;
  const previousPosition = hasData ? mockData[mockData.length - 2]?.position : 0;
  const change = hasData ? (previousPosition - currentPosition) : 0;
  const isImproving = change > 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3 border-gray-200">
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          <p className="text-xs text-gray-600 mt-1">
            Position: {payload[0].value.toFixed(1)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!hasData || !selectedWebsite) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900">Average Position</h3>
            <p className="text-gray-500 text-xs mt-0.5">Track your ranking improvements over time</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Connect a website to view position trends</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Average Position</h3>
            <p className="text-gray-500 text-xs mt-0.5">Track your ranking improvements over time</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {currentPosition.toFixed(1)}
            </span>
            {change !== 0 && (
              <div className={`flex items-center gap-1 ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
                {isImproving ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="text-xs font-medium">
                  {Math.abs(change).toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs px-2 py-0.5 mt-1 ${
              isImproving ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isImproving ? 'Improving' : 'Position tracking'}
          </Badge>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748b' }}
            domain={['dataMin - 2', 'dataMax + 2']}
            reversed={true}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="position" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 4, stroke: '#f59e0b', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AveragePositionChart;
