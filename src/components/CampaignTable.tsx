
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
import { Campaign } from '../data/mockData';
import { Badge } from "@/components/ui/badge";
import ColumnSelector from './ColumnSelector';

interface CampaignTableProps {
  campaigns: Campaign[];
}

const CampaignTable = ({ campaigns }: CampaignTableProps) => {
  const allColumns = [
    { key: 'name', label: 'Campaign Name' },
    { key: 'id', label: 'Campaign ID' },
    { key: 'status', label: 'Status' },
    { key: 'servingStatus', label: 'Serving Status' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'channelType', label: 'Advertising Channel Type' },
    { key: 'channelSubType', label: 'Advertising Channel Sub-type' },
    { key: 'budget', label: 'Campaign Budget' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clicks', label: 'Clicks' },
    { key: 'spend', label: 'Cost' },
    { key: 'cpc', label: 'Avg. CPC' },
    { key: 'cpm', label: 'Avg. CPM' },
    { key: 'ctr', label: 'CTR' },
    { key: 'conversions', label: 'Conversions' },
    { key: 'conversionRate', label: 'Conversion Rate' },
    { key: 'allConversions', label: 'All Conversions' },
    { key: 'conversionValue', label: 'Conversion Value' },
    { key: 'costPerConversion', label: 'Cost/Conversion' }
  ];

  // Default visible columns
  const [visibleColumns, setVisibleColumns] = useState([
    'name', 'status', 'spend', 'impressions', 'clicks', 'ctr', 
    'conversions', 'costPerConversion'
  ]);

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

  const formatPercent = (value: number | undefined) => {
    // Handle undefined or null values
    if (value === undefined || value === null) {
      return '0.00%';
    }
    return value.toFixed(2) + '%';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Make sure each campaign has the required properties
  const sanitizeCampaigns = campaigns.map(campaign => {
    return {
      ...campaign,
      // If ctr is missing, calculate it or set to 0
      ctr: campaign.ctr || (campaign.clicks && campaign.impressions ? (campaign.clicks / campaign.impressions) * 100 : 0),
      // If cpc (cost per click) is missing, calculate it or set to 0
      cpc: campaign.cpc || (campaign.spend && campaign.clicks ? campaign.spend / campaign.clicks : 0)
    };
  });

  return (
    <Card className="col-span-1 lg:col-span-3 mb-6">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Overview of all campaign metrics</CardDescription>
        </div>
        <div className="mt-4 md:mt-0">
          <ColumnSelector 
            columns={allColumns} 
            visibleColumns={visibleColumns} 
            onColumnToggle={toggleColumn} 
          />
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
              {sanitizeCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  {visibleColumns.includes('name') && (
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                  )}
                  {visibleColumns.includes('id') && (
                    <TableCell>{campaign.id}</TableCell>
                  )}
                  {visibleColumns.includes('status') && (
                    <TableCell>
                      <Badge 
                        variant={
                          campaign.status === 'Active' 
                            ? 'default' 
                            : campaign.status === 'Paused' 
                              ? 'outline' 
                              : 'secondary'
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes('servingStatus') && (
                    <TableCell>{campaign.servingStatus || 'Eligible'}</TableCell>
                  )}
                  {visibleColumns.includes('startDate') && (
                    <TableCell>{formatDate(campaign.startDate)}</TableCell>
                  )}
                  {visibleColumns.includes('endDate') && (
                    <TableCell>{formatDate(campaign.endDate)}</TableCell>
                  )}
                  {visibleColumns.includes('channelType') && (
                    <TableCell>{campaign.channelType || 'Search'}</TableCell>
                  )}
                  {visibleColumns.includes('channelSubType') && (
                    <TableCell>{campaign.channelSubType || 'N/A'}</TableCell>
                  )}
                  {visibleColumns.includes('budget') && (
                    <TableCell>{formatCurrency(campaign.budget || 0)}</TableCell>
                  )}
                  {visibleColumns.includes('impressions') && (
                    <TableCell>{formatNumber(campaign.impressions)}</TableCell>
                  )}
                  {visibleColumns.includes('clicks') && (
                    <TableCell>{formatNumber(campaign.clicks)}</TableCell>
                  )}
                  {visibleColumns.includes('spend') && (
                    <TableCell>{formatCurrency(campaign.spend)}</TableCell>
                  )}
                  {visibleColumns.includes('cpc') && (
                    <TableCell>{formatCurrency(campaign.cpc || 0)}</TableCell>
                  )}
                  {visibleColumns.includes('cpm') && (
                    <TableCell>{formatCurrency((campaign.spend / campaign.impressions * 1000) || 0)}</TableCell>
                  )}
                  {visibleColumns.includes('ctr') && (
                    <TableCell>{formatPercent(campaign.ctr)}</TableCell>
                  )}
                  {visibleColumns.includes('conversions') && (
                    <TableCell>{formatNumber(campaign.conversions)}</TableCell>
                  )}
                  {visibleColumns.includes('conversionRate') && (
                    <TableCell>{formatPercent((campaign.conversions / campaign.clicks * 100) || 0)}</TableCell>
                  )}
                  {visibleColumns.includes('allConversions') && (
                    <TableCell>{formatNumber(campaign.allConversions || campaign.conversions)}</TableCell>
                  )}
                  {visibleColumns.includes('conversionValue') && (
                    <TableCell>{formatCurrency(campaign.conversionValue || 0)}</TableCell>
                  )}
                  {visibleColumns.includes('costPerConversion') && (
                    <TableCell>{formatCurrency(campaign.costPerConversion)}</TableCell>
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

export default CampaignTable;
