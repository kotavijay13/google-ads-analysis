
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MetaPlatformBreakdown = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Platform Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>Facebook</div>
            <div className="font-medium">62%</div>
          </div>
          <div className="flex justify-between">
            <div>Instagram</div>
            <div className="font-medium">31%</div>
          </div>
          <div className="flex justify-between">
            <div>Audience Network</div>
            <div className="font-medium">7%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaPlatformBreakdown;
