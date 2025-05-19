
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeywordData, Campaign, AdGroup } from '../data/mockData';
import { Tag } from "lucide-react";
import ColumnSelector from './ColumnSelector';

interface KeywordPerformanceProps {
  keywords: KeywordData[];
  campaigns: Campaign[];
  adGroups: AdGroup[];
}

const KeywordPerformance = ({ keywords, campaigns, adGroups }: KeywordPerformanceProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [selectedAdGroup, setSelectedAdGroup] = useState<string>('all');
  
  const allColumns = [
    { key: 'keyword', label: 'Keyword Text' },
    { key: 'id', label: 'Keyword ID' },
    { key: 'matchType', label: 'Match Type' },
    { key: 'adGroupId', label: 'Ad Group ID' },
    { key: 'adGroupName', label: 'Ad Group Name' },
    { key: 'campaignName', label: 'Campaign Name' },
    { key: 'status', label: 'Status' },
    { key: 'qualityScore', label: 'Quality Score' },
    { key: 'expectedCtr', label: 'Expected CTR' },
    { key: 'adRelevance', label: 'Ad Relevance' },
    { key: 'landingPageExp', label: 'Landing Page Experience' },
    { key: 'clicks', label: 'Clicks' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'ctr', label: 'CTR' },
    { key: 'cpc', label: 'Avg. CPC' },
    { key: 'spend', label: 'Cost' },
    { key: 'conversions', label: 'Conversions' },
    { key: 'conversionRate', label: 'Conversion Rate' },
    { key: 'costPerConversion', label: 'Cost/Conversion' }
  ];

  const [visibleColumns, setVisibleColumns] = useState([
    'keyword', 'campaignName', 'adGroupName', 'status', 'clicks', 'impressions', 
    'ctr', 'spend', 'conversions', 'costPerConversion', 'qualityScore', 'performanceScore'
  ]);
  
  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey) 
        : [...prev, columnKey]
    );
  };

  // Filter keywords first by campaign
  const campaignFilteredKeywords = selectedCampaign === 'all' 
    ? keywords
    : keywords.filter(keyword => keyword.campaignId === selectedCampaign);
  
  // Then filter by ad group
  const filteredKeywords = selectedAdGroup === 'all' 
    ? campaignFilteredKeywords
    : campaignFilteredKeywords.filter(keyword => keyword.adGroupId === selectedAdGroup);

  // Get available ad groups based on selected campaign
  const availableAdGroups = selectedCampaign === 'all' 
    ? adGroups 
    : adGroups.filter(adGroup => adGroup.campaignId === selectedCampaign);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return value.toFixed(2) + '%';
  };

  const getPerformanceBadge = (performanceScore: 'high' | 'medium' | 'low') => {
    switch (performanceScore) {
      case 'high':
        return <Badge className="bg-green-500">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-red-100 text-red-500">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-blue-500" />
          <div>
            <CardTitle>Keyword Performance</CardTitle>
            <CardDescription>Campaign-wise keyword performance analysis</CardDescription>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <ColumnSelector 
            columns={allColumns} 
            visibleColumns={visibleColumns} 
            onColumnToggle={toggleColumn} 
          />
          <Select value={selectedCampaign} onValueChange={(value) => {
            setSelectedCampaign(value);
            setSelectedAdGroup('all'); // Reset ad group filter when campaign changes
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedAdGroup} onValueChange={setSelectedAdGroup}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by ad group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ad Groups</SelectItem>
              {availableAdGroups.map((adGroup) => (
                <SelectItem key={adGroup.id} value={adGroup.id}>{adGroup.name}</SelectItem>
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
                {allColumns
                  .filter(column => visibleColumns.includes(column.key))
                  .map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))
                }
                {visibleColumns.includes('performanceScore') && (
                  <TableHead>Performance</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeywords.map((keyword) => (
                <TableRow key={keyword.id}>
                  {visibleColumns.includes('keyword') && (
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  )}
                  {visibleColumns.includes('id') && (
                    <TableCell>{keyword.id}</TableCell>
                  )}
                  {visibleColumns.includes('matchType') && (
                    <TableCell>{keyword.matchType || 'Broad'}</TableCell>
                  )}
                  {visibleColumns.includes('adGroupId') && (
                    <TableCell>{keyword.adGroupId}</TableCell>
                  )}
                  {visibleColumns.includes('adGroupName') && (
                    <TableCell>{keyword.adGroupName}</TableCell>
                  )}
                  {visibleColumns.includes('campaignName') && (
                    <TableCell>{keyword.campaignName}</TableCell>
                  )}
                  {visibleColumns.includes('status') && (
                    <TableCell>
                      <Badge variant={keyword.status === 'Active' ? 'default' : 'secondary'}>
                        {keyword.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes('qualityScore') && (
                    <TableCell>{keyword.qualityScore || 7}/10</TableCell>
                  )}
                  {visibleColumns.includes('expectedCtr') && (
                    <TableCell>{keyword.expectedCtr || 'Above average'}</TableCell>
                  )}
                  {visibleColumns.includes('adRelevance') && (
                    <TableCell>{keyword.adRelevance || 'Average'}</TableCell>
                  )}
                  {visibleColumns.includes('landingPageExp') && (
                    <TableCell>{keyword.landingPageExp || 'Above average'}</TableCell>
                  )}
                  {visibleColumns.includes('clicks') && (
                    <TableCell>{formatNumber(keyword.clicks)}</TableCell>
                  )}
                  {visibleColumns.includes('impressions') && (
                    <TableCell>{formatNumber(keyword.impressions)}</TableCell>
                  )}
                  {visibleColumns.includes('ctr') && (
                    <TableCell>{formatPercent(keyword.ctr)}</TableCell>
                  )}
                  {visibleColumns.includes('cpc') && (
                    <TableCell>{formatCurrency(keyword.spend / keyword.clicks)}</TableCell>
                  )}
                  {visibleColumns.includes('spend') && (
                    <TableCell>{formatCurrency(keyword.spend)}</TableCell>
                  )}
                  {visibleColumns.includes('conversions') && (
                    <TableCell>{formatNumber(keyword.conversions)}</TableCell>
                  )}
                  {visibleColumns.includes('conversionRate') && (
                    <TableCell>{formatPercent((keyword.conversions / keyword.clicks) * 100)}</TableCell>
                  )}
                  {visibleColumns.includes('costPerConversion') && (
                    <TableCell>{formatCurrency(keyword.costPerConversion)}</TableCell>
                  )}
                  {visibleColumns.includes('performanceScore') && (
                    <TableCell>{getPerformanceBadge(keyword.performanceScore)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordPerformance;
