
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GeoData } from '../data/mockData';

interface GeoPerformanceProps {
  data: GeoData[];
}

const GeoPerformance = ({ data }: GeoPerformanceProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Sort data by clicks in descending order and limit to top 5
  const sortedData = [...data]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  return (
    <Card className="col-span-1 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Geographic Performance</CardTitle>
        <CardDescription className="text-xs">Top 5 regions by clicks</CardDescription>
      </CardHeader>
      <CardContent className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 50,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              dataKey="region" 
              type="category" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              width={60}
            />
            <Tooltip 
              formatter={(value: number) => formatNumber(value)}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderColor: '#e2e8f0',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Bar dataKey="clicks" fill="#3b82f6" name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GeoPerformance;
