
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
import { KeywordData, Campaign } from '../data/mockData';
import { Tag, ChartLine } from "lucide-react";

interface KeywordPerformanceProps {
  keywords: KeywordData[];
  campaigns: Campaign[];
}

const KeywordPerformance = ({ keywords, campaigns }: KeywordPerformanceProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  
  const filteredKeywords = selectedCampaign === 'all' 
    ? keywords
    : keywords.filter(keyword => keyword.campaignId === selectedCampaign);

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
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-blue-500" />
          <div>
            <CardTitle>Keyword Performance</CardTitle>
            <CardDescription>Campaign-wise keyword performance analysis</CardDescription>
          </div>
        </div>
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Campaign</TableHead>
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
