
import { Campaign, AdGroup } from './types';

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
    servingStatus: 'Eligible',
    startDate: '2023-05-01',
    endDate: '2023-08-31',
    channelType: 'Search',
    channelSubType: 'Standard Search',
    budget: 2000.00,
    allConversions: 165,
    conversionValue: 8756.45,
    cpm: 25.44
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
    servingStatus: 'Eligible',
    startDate: '2023-04-15',
    endDate: '2023-12-31',
    channelType: 'Display',
    channelSubType: 'Standard Display',
    budget: 5000.00,
    allConversions: 345,
    conversionValue: 12450.75,
    cpm: 28.64
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
    servingStatus: 'Eligible',
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    channelType: 'Search',
    channelSubType: 'Standard Search',
    budget: 6000.00,
    allConversions: 295,
    conversionValue: 15678.90,
    cpm: 61.97
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
    servingStatus: 'Paused',
    startDate: '2023-03-01',
    endDate: '2023-11-30',
    channelType: 'Display',
    channelSubType: 'Remarketing',
    budget: 3000.00,
    allConversions: 312,
    conversionValue: 9876.54,
    cpm: 67.95
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
    servingStatus: 'Ended',
    startDate: '2022-11-01',
    endDate: '2023-01-15',
    channelType: 'Search',
    channelSubType: 'Standard Search',
    budget: 5000.00,
    allConversions: 245,
    conversionValue: 11345.67,
    cpm: 76.09
  },
];

export const adGroupsData: AdGroup[] = [
  {
    id: '1',
    name: 'Summer Products',
    campaignId: '1',
    campaignName: 'Summer Sale Promotion'
  },
  {
    id: '2',
    name: 'Seasonal Deals',
    campaignId: '1',
    campaignName: 'Summer Sale Promotion'
  },
  {
    id: '3',
    name: 'Brand Visibility',
    campaignId: '2',
    campaignName: 'Brand Awareness'
  },
  {
    id: '4',
    name: 'Corporate Image',
    campaignId: '2',
    campaignName: 'Brand Awareness'
  },
  {
    id: '5',
    name: 'New Features',
    campaignId: '3',
    campaignName: 'Product Launch'
  },
  {
    id: '6',
    name: 'Product Benefits',
    campaignId: '3',
    campaignName: 'Product Launch'
  },
  {
    id: '7',
    name: 'Previous Customers',
    campaignId: '4',
    campaignName: 'Retargeting Campaign'
  },
  {
    id: '8',
    name: 'Christmas Gifts',
    campaignId: '5',
    campaignName: 'Holiday Special'
  },
  {
    id: '9',
    name: 'Holiday Discounts',
    campaignId: '5',
    campaignName: 'Holiday Special'
  }
];
