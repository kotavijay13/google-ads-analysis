
import { Check, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MetaAdsAccount } from './types';

interface MetaAccountsTableProps {
  accounts: MetaAdsAccount[];
  selectedAccount: MetaAdsAccount | null;
  loading: boolean;
  onSelectAccount: (accountId: string) => void;
}

const MetaAccountsTable = ({ 
  accounts, 
  selectedAccount, 
  loading, 
  onSelectAccount 
}: MetaAccountsTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  
  if (accounts.length === 0) {
    return (
      <p className="text-center text-muted-foreground my-4">No Meta Ads accounts found</p>
    );
  }

  // Campaign Level Headers
  const campaignHeaders = [
    'Selected',
    'Campaign ID',
    'Campaign Name', 
    'Objective',
    'Buying Type',
    'Status',
    'Budget',
    'Amount Spent',
    'Impressions',
    'Reach',
    'Frequency',
    'CPM (Cost per 1,000 Impressions)',
    'CTR (Click-through Rate)',
    'CPC (Cost per Click)',
    'Results',
    'Cost per Result',
    'Result Rate',
    'ROAS (Return on Ad Spend)',
    'Purchases',
    'Purchase Conversion Value',
    'Website Leads',
    'Add to Cart',
    'Landing Page Views',
    'Link Clicks',
    'Saves'
  ];

  // Ad Set Level Headers  
  const adSetHeaders = [
    'Selected',
    'Ad Set ID',
    'Ad Set Name',
    'Delivery',
    'Optimization Goal',
    'Bid Strategy',
    'Budget',
    'Schedule',
    'Audience',
    'Placement',
    'Devices',
    'Impressions',
    'Reach',
    'Frequency',
    'Clicks',
    'Link Clicks',
    'CPC (Cost per Link Click)',
    'CTR',
    'CPM',
    'Conversions',
    'Cost per Conversion',
    'Leads',
    'Add to Cart',
    'Initiated Checkout',
    'Purchases',
    'Purchase Value'
  ];

  // Ad Level Headers
  const adHeaders = [
    'Selected',
    'Ad ID',
    'Ad Name',
    'Ad Creative',
    'Status',
    'Format',
    'Call to Action',
    'Impressions',
    'Reach',
    'Frequency',
    'Link Clicks',
    'All Clicks',
    'CPC (Cost per Click)',
    'CPM',
    'CTR',
    'Engagements',
    'Video Plays',
    'Leads',
    'Add to Cart',
    'Purchase',
    'ROAS',
    'Quality Ranking',
    'Engagement Rate Ranking',
    'Conversion Rate Ranking'
  ];

  return (
    <div className="space-y-6">
      {/* Campaign Level Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Campaign Level Data</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {campaignHeaders.map((header) => (
                  <TableHead key={header} className="whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow 
                  key={`campaign-${account.id}`} 
                  className={selectedAccount?.id === account.id ? "bg-muted/80" : ""}
                  onClick={() => onSelectAccount(account.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    {selectedAccount?.id === account.id && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{account.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{account.name}</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Ad Set Level Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Ad Set Level Data</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {adSetHeaders.map((header) => (
                  <TableHead key={header} className="whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow 
                  key={`adset-${account.id}`} 
                  className={selectedAccount?.id === account.id ? "bg-muted/80" : ""}
                  onClick={() => onSelectAccount(account.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    {selectedAccount?.id === account.id && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{account.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{account.name}</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Ad Level Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Ad Level Data</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {adHeaders.map((header) => (
                  <TableHead key={header} className="whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow 
                  key={`ad-${account.id}`} 
                  className={selectedAccount?.id === account.id ? "bg-muted/80" : ""}
                  onClick={() => onSelectAccount(account.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    {selectedAccount?.id === account.id && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{account.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{account.name}</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                  <TableCell className="whitespace-nowrap">-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MetaAccountsTable;
