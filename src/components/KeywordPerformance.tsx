
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

interface KeywordPerformanceProps {
  keywords: KeywordData[];
  campaigns: Campaign[];
  adGroups: AdGroup[];
}

const KeywordPerformance = ({ keywords, campaigns, adGroups }: KeywordPerformanceProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [selectedAdGroup, setSelectedAdGroup] = useState<string>('all');
  
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
                <TableHead>Keyword</TableHead>
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
              {filteredKeywords.map((keyword) => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  <TableCell>{keyword.campaignName}</TableCell>
                  <TableCell>{keyword.adGroupName}</TableCell>
                  <TableCell>{formatNumber(keyword.clicks)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatNumber(keyword.impressions)}</TableCell>
                  <TableCell>{formatPercent(keyword.ctr)}</TableCell>
                  <TableCell>{formatCurrency(keyword.spend)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatNumber(keyword.conversions)}</TableCell>
                  <TableCell>{formatCurrency(keyword.costPerConversion)}</TableCell>
                  <TableCell>{getPerformanceBadge(keyword.performanceScore)}</TableCell>
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
