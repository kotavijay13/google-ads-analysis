
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetaRevenueCardProps {
  totalRevenue: number;
}

const MetaRevenueCard = ({ totalRevenue }: MetaRevenueCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-2xl font-bold">${totalRevenue.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
        <p className="text-xs text-muted-foreground">+15% from last month</p>
        <div className="space-y-4 mt-4">
          <div className="flex justify-between">
            <div>Facebook</div>
            <div className="font-medium">${(totalRevenue * 0.62).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
          </div>
          <div className="flex justify-between">
            <div>Instagram</div>
            <div className="font-medium">${(totalRevenue * 0.31).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
          </div>
          <div className="flex justify-between">
            <div>Audience Network</div>
            <div className="font-medium">${(totalRevenue * 0.07).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaRevenueCard;
