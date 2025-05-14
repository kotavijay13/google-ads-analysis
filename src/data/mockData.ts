
export interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Ended';
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  costPerConversion: number;
}

export interface DailyData {
  date: string;
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
}

export interface DeviceData {
  device: string;
  clicks: number;
  spend: number;
  conversions: number;
}

export interface GeoData {
  region: string;
  clicks: number;
  spend: number;
  conversions: number;
}

export const campaignsData: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale Promotion',
    status: 'Active',
    spend: 1245.67,
    impressions: 48972,
    clicks: 3241,
    conversions: 157,
    ctr: 6.62,
    cpc: 0.38,
    conversionRate: 4.84,
    costPerConversion: 7.93,
  },
  {
    id: '2',
    name: 'Brand Awareness',
    status: 'Active',
    spend: 3567.89,
    impressions: 124563,
    clicks: 6789,
    conversions: 321,
    ctr: 5.45,
    cpc: 0.53,
    conversionRate: 4.73,
    costPerConversion: 11.12,
  },
  {
    id: '3',
    name: 'Product Launch',
    status: 'Active',
    spend: 5432.10,
    impressions: 87654,
    clicks: 5432,
    conversions: 278,
    ctr: 6.20,
    cpc: 1.00,
    conversionRate: 5.12,
    costPerConversion: 19.54,
  },
  {
    id: '4',
    name: 'Retargeting Campaign',
    status: 'Paused',
    spend: 2345.67,
    impressions: 34521,
    clicks: 4532,
    conversions: 289,
    ctr: 13.13,
    cpc: 0.52,
    conversionRate: 6.38,
    costPerConversion: 8.12,
  },
  {
    id: '5',
    name: 'Holiday Special',
    status: 'Ended',
    spend: 4321.09,
    impressions: 56789,
    clicks: 4321,
    conversions: 231,
    ctr: 7.61,
    cpc: 1.00,
    conversionRate: 5.35,
    costPerConversion: 18.71,
  },
];

export const dailyPerformance: DailyData[] = [
  { date: '2023-05-01', spend: 432.12, clicks: 654, impressions: 12451, conversions: 34 },
  { date: '2023-05-02', spend: 456.78, clicks: 689, impressions: 13245, conversions: 38 },
  { date: '2023-05-03', spend: 478.34, clicks: 712, impressions: 13876, conversions: 41 },
  { date: '2023-05-04', spend: 501.23, clicks: 743, impressions: 14231, conversions: 44 },
  { date: '2023-05-05', spend: 534.67, clicks: 782, impressions: 14987, conversions: 46 },
  { date: '2023-05-06', spend: 578.90, clicks: 826, impressions: 15432, conversions: 49 },
  { date: '2023-05-07', spend: 601.45, clicks: 867, impressions: 16201, conversions: 52 },
  { date: '2023-05-08', spend: 589.34, clicks: 845, impressions: 15876, conversions: 51 },
  { date: '2023-05-09', spend: 612.78, clicks: 879, impressions: 16543, conversions: 54 },
  { date: '2023-05-10', spend: 645.23, clicks: 921, impressions: 17324, conversions: 58 },
  { date: '2023-05-11', spend: 678.90, clicks: 967, impressions: 18012, conversions: 61 },
  { date: '2023-05-12', spend: 701.45, clicks: 998, impressions: 18765, conversions: 65 },
  { date: '2023-05-13', spend: 723.67, clicks: 1034, impressions: 19432, conversions: 69 },
  { date: '2023-05-14', spend: 745.89, clicks: 1067, impressions: 19876, conversions: 72 },
];

export const deviceData: DeviceData[] = [
  { device: 'Mobile', clicks: 8765, spend: 6789.45, conversions: 543 },
  { device: 'Desktop', clicks: 6543, spend: 5432.12, conversions: 423 },
  { device: 'Tablet', clicks: 2345, spend: 1876.34, conversions: 154 },
];

export const geoData: GeoData[] = [
  { region: 'California', clicks: 3421, spend: 2876.45, conversions: 178 },
  { region: 'New York', clicks: 2765, spend: 2345.67, conversions: 143 },
  { region: 'Texas', clicks: 2134, spend: 1876.23, conversions: 112 },
  { region: 'Florida', clicks: 1987, spend: 1654.89, conversions: 98 },
  { region: 'Illinois', clicks: 1654, spend: 1432.56, conversions: 87 },
];

export const getOverviewMetrics = () => {
  const totalSpend = campaignsData.reduce((sum, campaign) => sum + campaign.spend, 0);
  const totalClicks = campaignsData.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalImpressions = campaignsData.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalConversions = campaignsData.reduce((sum, campaign) => sum + campaign.conversions, 0);
  
  const avgCTR = (totalClicks / totalImpressions) * 100;
  const avgCPC = totalSpend / totalClicks;
  const avgConvRate = (totalConversions / totalClicks) * 100;
  const avgCPA = totalSpend / totalConversions;

  return {
    totalSpend,
    totalClicks,
    totalImpressions,
    totalConversions,
    avgCTR,
    avgCPC,
    avgConvRate,
    avgCPA
  };
};
