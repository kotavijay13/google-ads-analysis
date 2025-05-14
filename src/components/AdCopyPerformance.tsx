
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
import { AdCopyData, Campaign, AdGroup } from '../data/mockData';
import { MessageSquareText } from "lucide-react";

interface AdCopyPerformanceProps {
  adCopies: AdCopyData[];
  campaigns: Campaign[];
  adGroups: AdGroup[];
}

const AdCopyPerformance = ({ adCopies, campaigns, adGroups }: AdCopyPerformanceProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [selectedAdGroup, setSelectedAdGroup] = useState<string>('all');
  
  // Filter ad copies first by campaign
  const campaignFilteredAdCopies = selectedCampaign === 'all' 
    ? adCopies
    : adCopies.filter(adCopy => adCopy.campaignId === selectedCampaign);
  
  // Then filter by ad group
  const filteredAdCopies = selectedAdGroup === 'all' 
    ? campaignFilteredAdCopies
    : campaignFilteredAdCopies.filter(adCopy => adCopy.adGroupId === selectedAdGroup);

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
        return <Badge className="bg-[#9b87f5]">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-red-100 text-[#ea384c]">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-blue-500" />
          <div>
            <CardTitle>Ad Copy Performance</CardTitle>
            <CardDescription>Campaign-wise ad copy performance analysis</CardDescription>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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
                <TableHead>Headline</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Ad Group</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead className="hidden md:table-cell">Impressions</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Spend</TableHead>
                <TableHead className="hidden md:table-cell">Conversions</TableHead>
                <TableHead>Cost/Conv</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdCopies.map((adCopy) => (
                <TableRow key={adCopy.id}>
                  <TableCell className="font-medium max-w-[150px] truncate" title={adCopy.headline}>
                    {adCopy.headline}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[250px] truncate" title={adCopy.description}>
                    {adCopy.description}
                  </TableCell>
                  <TableCell>{adCopy.campaignName}</TableCell>
                  <TableCell>{adCopy.adGroupName}</TableCell>
                  <TableCell>{formatNumber(adCopy.clicks)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatNumber(adCopy.impressions)}</TableCell>
                  <TableCell>{formatPercent(adCopy.ctr)}</TableCell>
                  <TableCell>{formatCurrency(adCopy.spend)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatNumber(adCopy.conversions)}</TableCell>
                  <TableCell>{formatCurrency(adCopy.costPerConversion)}</TableCell>
                  <TableCell>{getPerformanceBadge(adCopy.performanceScore)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdCopyPerformance;
