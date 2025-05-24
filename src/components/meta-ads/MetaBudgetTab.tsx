
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetaAdsAccount } from './types';

interface MetaBudgetTabProps {
  accounts: MetaAdsAccount[];
}

const MetaBudgetTab = ({ accounts }: MetaBudgetTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget & Bidding</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {accounts.map((account) => (
            <div key={account.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{account.name}</h3>
                  <p className="text-sm text-muted-foreground">Budget: {account.budget}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    <span className="font-medium">ROAS: </span>{account.roas}x
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">CPC: </span>${account.cpc?.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs">Daily Budget</label>
                  <div className="mt-1 flex items-center">
                    <span className="text-sm font-medium">$</span>
                    <input
                      type="number"
                      className="ml-1 flex-1 border-0 border-b focus:ring-0 focus:border-black text-sm p-0"
                      defaultValue={parseFloat(account.budget?.replace(/[^0-9.]/g, '') || '0')}
                      step="1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs">Bid Strategy</label>
                  <select className="w-full mt-1 bg-transparent border-0 border-b focus:ring-0 focus:border-black text-sm p-0">
                    <option>Lowest Cost</option>
                    <option>Target CPA</option>
                    <option>Target ROAS</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaBudgetTab;
