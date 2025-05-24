
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ColumnSelector from './ColumnSelector';
import AIInsights from './AIInsights';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchTerm {
  id: string;
  searchTerm: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
  campaignId: string;
  adGroupId: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  costPerConversion: number;
  queryMatchType: 'EXACT' | 'PHRASE' | 'BROAD' | 'NEAR_EXACT' | 'NEAR_PHRASE';
  addedToKeywords: boolean;
}

interface Campaign {
  id: string;
  name: string;
}

interface AdGroup {
  id: string;
  name: string;
  campaignId: string;
}

interface SearchTermsPerformanceProps {
  searchTerms: SearchTerm[];
  campaigns: Campaign[];
  adGroups: AdGroup[];
}

const SearchTermsPerformance = ({ searchTerms, campaigns, adGroups }: SearchTermsPerformanceProps) => {
  const allColumns = [
    { key: 'searchTerm', label: 'Search Term' },
    { key: 'matchType', label: 'Match Type' },
    { key: 'queryMatchType', label: 'Query Match Type' },
    { key: 'campaignName', label: 'Campaign' },
    { key: 'adGroupName', label: 'Ad Group' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clicks', label: 'Clicks' },
    { key: 'spend', label: 'Cost' },
    { key: 'ctr', label: 'CTR' },
    { key: 'cpc', label: 'Avg. CPC' },
    { key: 'conversions', label: 'Conversions' },
    { key: 'conversionRate', label: 'Conv. Rate' },
    { key: 'costPerConversion', label: 'Cost/Conv.' },
    { key: 'addedToKeywords', label: 'Added as Keyword' },
    { key: 'aiInsights', label: 'AI Insights' }
  ];

  const [visibleColumns, setVisibleColumns] = useState([
    'searchTerm', 'matchType', 'campaignName', 'impressions', 'clicks', 'spend', 'ctr', 'conversions', 'costPerConversion', 'aiInsights'
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [selectedAdGroup, setSelectedAdGroup] = useState<string>('all');

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey) 
        : [...prev, columnKey]
    );
  };

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

  const formatPercent = (value: number) => {
    return value.toFixed(2) + '%';
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'EXACT':
        return 'bg-green-100 text-green-800';
      case 'PHRASE':
        return 'bg-blue-100 text-blue-800';
      case 'BROAD':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter search terms based on selected campaign and ad group
  const filteredSearchTerms = searchTerms.filter(searchTerm => {
    if (selectedCampaign !== 'all' && searchTerm.campaignId !== selectedCampaign) {
      return false;
    }
    if (selectedAdGroup !== 'all' && searchTerm.adGroupId !== selectedAdGroup) {
      return false;
    }
    return true;
  });

  // Get ad groups for the selected campaign
  const availableAdGroups = selectedCampaign === 'all' 
    ? adGroups 
    : adGroups.filter(ag => ag.campaignId === selectedCampaign);

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Search Terms Performance</CardTitle>
            <CardDescription>Analyze performance by actual search queries</CardDescription>
          </div>
          <ColumnSelector 
            columns={allColumns} 
            visibleColumns={visibleColumns} 
            onColumnToggle={toggleColumn} 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAdGroup} onValueChange={setSelectedAdGroup}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Ad Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ad Groups</SelectItem>
              {availableAdGroups.map((adGroup) => (
                <SelectItem key={adGroup.id} value={adGroup.id}>
                  {adGroup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {allColumns.filter(column => visibleColumns.includes(column.key)).map(column => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSearchTerms.map((searchTerm) => {
                const campaign = campaigns.find(c => c.id === searchTerm.campaignId);
                const adGroup = adGroups.find(ag => ag.id === searchTerm.adGroupId);
                
                return (
                  <TableRow key={searchTerm.id}>
                    {visibleColumns.includes('searchTerm') && (
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={searchTerm.searchTerm}>
                          {searchTerm.searchTerm}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes('matchType') && (
                      <TableCell>
                        <Badge className={getMatchTypeColor(searchTerm.matchType)}>
                          {searchTerm.matchType}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.includes('queryMatchType') && (
                      <TableCell>
                        <Badge variant="outline">
                          {searchTerm.queryMatchType}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.includes('campaignName') && (
                      <TableCell>{campaign?.name || 'Unknown'}</TableCell>
                    )}
                    {visibleColumns.includes('adGroupName') && (
                      <TableCell>{adGroup?.name || 'Unknown'}</TableCell>
                    )}
                    {visibleColumns.includes('impressions') && (
                      <TableCell>{formatNumber(searchTerm.impressions)}</TableCell>
                    )}
                    {visibleColumns.includes('clicks') && (
                      <TableCell>{formatNumber(searchTerm.clicks)}</TableCell>
                    )}
                    {visibleColumns.includes('spend') && (
                      <TableCell>{formatCurrency(searchTerm.spend)}</TableCell>
                    )}
                    {visibleColumns.includes('ctr') && (
                      <TableCell>{formatPercent(searchTerm.ctr)}</TableCell>
                    )}
                    {visibleColumns.includes('cpc') && (
                      <TableCell>{formatCurrency(searchTerm.cpc)}</TableCell>
                    )}
                    {visibleColumns.includes('conversions') && (
                      <TableCell>{formatNumber(searchTerm.conversions)}</TableCell>
                    )}
                    {visibleColumns.includes('conversionRate') && (
                      <TableCell>{formatPercent(searchTerm.conversionRate)}</TableCell>
                    )}
                    {visibleColumns.includes('costPerConversion') && (
                      <TableCell>{formatCurrency(searchTerm.costPerConversion)}</TableCell>
                    )}
                    {visibleColumns.includes('addedToKeywords') && (
                      <TableCell>
                        <Badge variant={searchTerm.addedToKeywords ? 'default' : 'secondary'}>
                          {searchTerm.addedToKeywords ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.includes('aiInsights') && (
                      <TableCell>
                        <AIInsights data={searchTerm} type="searchterm" />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchTermsPerformance;
