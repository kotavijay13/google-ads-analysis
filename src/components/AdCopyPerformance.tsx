
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
import { AdCopyData, Campaign } from '../data/mockData';
import { MessageSquareText, ChartLine } from "lucide-react";

interface AdCopyPerformanceProps {
  adCopies: AdCopyData[];
  campaigns: Campaign[];
}

const AdCopyPerformance = ({ adCopies, campaigns }: AdCopyPerformanceProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  
  const filteredAdCopies = selectedCampaign === 'all' 
    ? adCopies
    : adCopies.filter(adCopy => adCopy.campaignId === selectedCampaign);

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
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-blue-500" />
          <div>
            <CardTitle>Ad Copy Performance</CardTitle>
            <CardDescription>Campaign-wise ad copy performance analysis</CardDescription>
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
                <TableHead>Headline</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
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
              {filteredAdCopies.map((adCopy) => (
                <TableRow key={adCopy.id}>
                  <TableCell className="font-medium max-w-[150px] truncate" title={adCopy.headline}>
                    {adCopy.headline}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[250px] truncate" title={adCopy.description}>
                    {adCopy.description}
                  </TableCell>
                  <TableCell>{adCopy.campaignName}</TableCell>
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
