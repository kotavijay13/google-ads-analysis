
import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { HardDrive } from 'lucide-react';
import { AssetData, Campaign, AdGroup } from '@/data/mockData';

type PerformanceScoreColor = {
  [key in 'high' | 'medium' | 'low']: string;
};

const performanceScoreColors: PerformanceScoreColor = {
  high: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  low: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

interface AssetPerformanceProps {
  assets: AssetData[];
  campaigns: Campaign[];
  adGroups: AdGroup[];
}

const AssetPerformance = ({ assets, campaigns, adGroups }: AssetPerformanceProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedAdGroup, setSelectedAdGroup] = useState<string>("all");

  const filteredAssets = assets.filter((asset) => {
    const campaignMatch = selectedCampaign === "all" || asset.campaignId === selectedCampaign;
    const adGroupMatch = selectedAdGroup === "all" || asset.adGroupId === selectedAdGroup;
    return campaignMatch && adGroupMatch;
  });

  const filteredAdGroups = adGroups.filter(
    adGroup => selectedCampaign === "all" || adGroup.campaignId === selectedCampaign
  );

  const getAssetTypeIcon = (type: string) => {
    return <HardDrive className="h-4 w-4 mr-2" />;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Asset Performance</CardTitle>
            <CardDescription>
              Performance metrics for ad assets
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select 
              value={selectedCampaign}
              onValueChange={value => {
                setSelectedCampaign(value);
                setSelectedAdGroup("all");
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Campaigns" />
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
            
            <Select
              value={selectedAdGroup}
              onValueChange={setSelectedAdGroup}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Ad Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ad Groups</SelectItem>
                {filteredAdGroups.map((adGroup) => (
                  <SelectItem key={adGroup.id} value={adGroup.id}>
                    {adGroup.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Ad Group</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Cost/Conv.</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getAssetTypeIcon(asset.type)}
                        {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>{asset.campaignName}</TableCell>
                    <TableCell>{asset.adGroupName}</TableCell>
                    <TableCell className="text-right">{asset.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{asset.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{asset.ctr.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">${asset.spend.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{asset.conversions}</TableCell>
                    <TableCell className="text-right">${asset.costPerConversion.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={performanceScoreColors[asset.performanceScore]}>
                        {asset.performanceScore.charAt(0).toUpperCase() + asset.performanceScore.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    No assets match the current filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetPerformance;
