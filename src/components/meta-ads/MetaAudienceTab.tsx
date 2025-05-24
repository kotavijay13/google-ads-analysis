
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MetaAudienceTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Age Distribution</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>18-24</div>
                <div className="w-2/3">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: "22%" }}></div>
                </div>
                <div>22%</div>
              </div>
              <div className="flex justify-between items-center">
                <div>25-34</div>
                <div className="w-2/3">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: "38%" }}></div>
                </div>
                <div>38%</div>
              </div>
              <div className="flex justify-between items-center">
                <div>35-44</div>
                <div className="w-2/3">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: "25%" }}></div>
                </div>
                <div>25%</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Gender</h4>
            <div className="flex justify-between gap-4">
              <div className="flex-1 bg-blue-100 p-3 rounded text-center">
                <div className="font-bold">46%</div>
                <div className="text-sm">Male</div>
              </div>
              <div className="flex-1 bg-pink-100 p-3 rounded text-center">
                <div className="font-bold">52%</div>
                <div className="text-sm">Female</div>
              </div>
              <div className="flex-1 bg-gray-100 p-3 rounded text-center">
                <div className="font-bold">2%</div>
                <div className="text-sm">Other</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaAudienceTab;
