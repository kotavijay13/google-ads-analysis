
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeadsStatsCardsProps {
  totalLeads: number;
  conversionRate: number;
  costPerLead: number;
  averageValue: number;
  dateRange: { from: Date; to: Date };
}

const LeadsStatsCards = ({ 
  totalLeads, 
  conversionRate, 
  costPerLead, 
  averageValue, 
  dateRange 
}: LeadsStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalLeads}</div>
          <p className="text-xs text-gray-500 mt-1">
            {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-gray-500 mt-1">From total traffic</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Cost Per Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">${costPerLead.toFixed(2)}</div>
          <p className="text-xs text-gray-500 mt-1">Average acquisition cost</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Average Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">${averageValue}</div>
          <p className="text-xs text-gray-500 mt-1">Per qualified lead</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsStatsCards;
