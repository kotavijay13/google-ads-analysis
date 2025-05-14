
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DailyData } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PerformanceChartProps {
  data: DailyData[];
}

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const [metric, setMetric] = useState<'clicks' | 'spend' | 'impressions' | 'conversions'>('clicks');
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getYAxisLabel = () => {
    switch (metric) {
      case 'clicks':
      case 'impressions':
      case 'conversions':
        return 'Count';
      case 'spend':
        return 'Spend ($)';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (metric) {
      case 'clicks':
        return '#3b82f6';
      case 'spend':
        return '#ef4444';
      case 'impressions':
        return '#10b981';
      case 'conversions':
        return '#8b5cf6';
      default:
        return '#3b82f6';
    }
  };

  const getMetricName = () => {
    return metric.charAt(0).toUpperCase() + metric.slice(1);
  };

  const formattedData = data.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  return (
    <Card className="col-span-1 lg:col-span-2 mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Daily performance metrics</CardDescription>
        </div>
        <Select value={metric} onValueChange={(value) => setMetric(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clicks">Clicks</SelectItem>
            <SelectItem value="spend">Spend</SelectItem>
            <SelectItem value="impressions">Impressions</SelectItem>
            <SelectItem value="conversions">Conversions</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              label={{ 
                value: getYAxisLabel(), 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#64748b' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderColor: '#e2e8f0',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={getColor()}
              strokeWidth={2}
              name={getMetricName()}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
