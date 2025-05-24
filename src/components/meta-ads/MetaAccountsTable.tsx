
import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColumnSelector from '../ColumnSelector';
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
  // Campaign Level Headers
  const campaignColumns = [
    { key: 'selected', label: 'Selected' },
    { key: 'campaignId', label: 'Campaign ID' },
    { key: 'campaignName', label: 'Campaign Name' },
    { key: 'objective', label: 'Objective' },
    { key: 'buyingType', label: 'Buying Type' },
    { key: 'status', label: 'Status' },
    { key: 'budget', label: 'Budget' },
    { key: 'amountSpent', label: 'Amount Spent' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'reach', label: 'Reach' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'cpm', label: 'CPM (Cost per 1,000 Impressions)' },
    { key: 'ctr', label: 'CTR (Click-through Rate)' },
    { key: 'cpc', label: 'CPC (Cost per Click)' },
    { key: 'results', label: 'Results' },
    { key: 'costPerResult', label: 'Cost per Result' },
    { key: 'resultRate', label: 'Result Rate' },
    { key: 'roas', label: 'ROAS (Return on Ad Spend)' },
    { key: 'purchases', label: 'Purchases' },
    { key: 'purchaseValue', label: 'Purchase Conversion Value' },
    { key: 'websiteLeads', label: 'Website Leads' },
    { key: 'addToCart', label: 'Add to Cart' },
    { key: 'landingPageViews', label: 'Landing Page Views' },
    { key: 'linkClicks', label: 'Link Clicks' },
    { key: 'saves', label: 'Saves' }
  ];

  // Ad Set Level Headers  
  const adSetColumns = [
    { key: 'selected', label: 'Selected' },
    { key: 'adSetId', label: 'Ad Set ID' },
    { key: 'adSetName', label: 'Ad Set Name' },
    { key: 'delivery', label: 'Delivery' },
    { key: 'optimizationGoal', label: 'Optimization Goal' },
    { key: 'bidStrategy', label: 'Bid Strategy' },
    { key: 'budget', label: 'Budget' },
    { key: 'schedule', label: 'Schedule' },
    { key: 'audience', label: 'Audience' },
    { key: 'placement', label: 'Placement' },
    { key: 'devices', label: 'Devices' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'reach', label: 'Reach' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'clicks', label: 'Clicks' },
    { key: 'linkClicks', label: 'Link Clicks' },
    { key: 'cpcLinkClick', label: 'CPC (Cost per Link Click)' },
    { key: 'ctr', label: 'CTR' },
    { key: 'cpm', label: 'CPM' },
    { key: 'conversions', label: 'Conversions' },
    { key: 'costPerConversion', label: 'Cost per Conversion' },
    { key: 'leads', label: 'Leads' },
    { key: 'addToCart', label: 'Add to Cart' },
    { key: 'initiatedCheckout', label: 'Initiated Checkout' },
    { key: 'purchases', label: 'Purchases' },
    { key: 'purchaseValue', label: 'Purchase Value' }
  ];

  // Ad Level Headers
  const adColumns = [
    { key: 'selected', label: 'Selected' },
    { key: 'adId', label: 'Ad ID' },
    { key: 'adName', label: 'Ad Name' },
    { key: 'adCreative', label: 'Ad Creative' },
    { key: 'status', label: 'Status' },
    { key: 'format', label: 'Format' },
    { key: 'callToAction', label: 'Call to Action' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'reach', label: 'Reach' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'linkClicks', label: 'Link Clicks' },
    { key: 'allClicks', label: 'All Clicks' },
    { key: 'cpc', label: 'CPC (Cost per Click)' },
    { key: 'cpm', label: 'CPM' },
    { key: 'ctr', label: 'CTR' },
    { key: 'engagements', label: 'Engagements' },
    { key: 'videoPlays', label: 'Video Plays' },
    { key: 'leads', label: 'Leads' },
    { key: 'addToCart', label: 'Add to Cart' },
    { key: 'purchase', label: 'Purchase' },
    { key: 'roas', label: 'ROAS' },
    { key: 'qualityRanking', label: 'Quality Ranking' },
    { key: 'engagementRateRanking', label: 'Engagement Rate Ranking' },
    { key: 'conversionRateRanking', label: 'Conversion Rate Ranking' }
  ];

  // State for visible columns for each table
  const [campaignVisibleColumns, setCampaignVisibleColumns] = useState([
    'selected', 'campaignId', 'campaignName', 'status', 'budget', 'amountSpent', 'impressions', 'ctr', 'cpc', 'roas'
  ]);
  
  const [adSetVisibleColumns, setAdSetVisibleColumns] = useState([
    'selected', 'adSetId', 'adSetName', 'delivery', 'optimizationGoal', 'budget', 'impressions', 'clicks', 'ctr', 'conversions'
  ]);
  
  const [adVisibleColumns, setAdVisibleColumns] = useState([
    'selected', 'adId', 'adName', 'status', 'format', 'impressions', 'linkClicks', 'ctr', 'cpc', 'roas'
  ]);

  const toggleCampaignColumn = (columnKey: string) => {
    setCampaignVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey) 
        : [...prev, columnKey]
    );
  };

  const toggleAdSetColumn = (columnKey: string) => {
    setAdSetVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey) 
        : [...prev, columnKey]
    );
  };

  const toggleAdColumn = (columnKey: string) => {
    setAdVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey) 
        : [...prev, columnKey]
    );
  };

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

  const renderTableCell = (columnKey: string, account: MetaAdsAccount) => {
    if (columnKey === 'selected') {
      return selectedAccount?.id === account.id && <Check className="h-4 w-4 text-green-500" />;
    }
    if (columnKey === 'campaignId' || columnKey === 'adSetId' || columnKey === 'adId') {
      return account.id;
    }
    if (columnKey === 'campaignName' || columnKey === 'adSetName' || columnKey === 'adName') {
      return account.name;
    }
    return '-';
  };

  return (
    <div className="space-y-6">
      {/* Campaign Level Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Campaign Level Data</CardTitle>
          <ColumnSelector 
            columns={campaignColumns.filter(col => col.key !== 'selected')} 
            visibleColumns={campaignVisibleColumns} 
            onColumnToggle={toggleCampaignColumn} 
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {campaignColumns.filter(column => campaignVisibleColumns.includes(column.key)).map(column => (
                    <TableHead key={column.key} className="whitespace-nowrap">
                      {column.label}
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
                    {campaignColumns.filter(column => campaignVisibleColumns.includes(column.key)).map(column => (
                      <TableCell key={column.key} className="whitespace-nowrap">
                        {renderTableCell(column.key, account)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ad Set Level Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ad Set Level Data</CardTitle>
          <ColumnSelector 
            columns={adSetColumns.filter(col => col.key !== 'selected')} 
            visibleColumns={adSetVisibleColumns} 
            onColumnToggle={toggleAdSetColumn} 
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {adSetColumns.filter(column => adSetVisibleColumns.includes(column.key)).map(column => (
                    <TableHead key={column.key} className="whitespace-nowrap">
                      {column.label}
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
                    {adSetColumns.filter(column => adSetVisibleColumns.includes(column.key)).map(column => (
                      <TableCell key={column.key} className="whitespace-nowrap">
                        {renderTableCell(column.key, account)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ad Level Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ad Level Data</CardTitle>
          <ColumnSelector 
            columns={adColumns.filter(col => col.key !== 'selected')} 
            visibleColumns={adVisibleColumns} 
            onColumnToggle={toggleAdColumn} 
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {adColumns.filter(column => adVisibleColumns.includes(column.key)).map(column => (
                    <TableHead key={column.key} className="whitespace-nowrap">
                      {column.label}
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
                    {adColumns.filter(column => adVisibleColumns.includes(column.key)).map(column => (
                      <TableCell key={column.key} className="whitespace-nowrap">
                        {renderTableCell(column.key, account)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaAccountsTable;
