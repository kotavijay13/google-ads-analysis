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
  servingStatus?: string;
  startDate?: string;
  endDate?: string;
  channelType?: string;
  channelSubType?: string;
  budget?: number;
  allConversions?: number;
  conversionValue?: number;
  cpm?: number;
}

export interface AdGroup {
  id: string;
  name: string;
  campaignId: string;
  campaignName: string;
  status?: string;
  type?: string;
  cpcBid?: number;
  impressions?: number;
  clicks?: number;
  cost?: number;
  ctr?: number;
  cpc?: number;
  conversions?: number;
  conversionRate?: number;
  conversionValue?: number;
  costPerConversion?: number;
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

export interface KeywordData {
  id: string;
  keyword: string;
  campaignId: string;
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  clicks: number;
  impressions: number;
  ctr: number;
  spend: number;
  conversions: number;
  costPerConversion: number;
  performanceScore: 'high' | 'medium' | 'low';
  matchType?: string;
  status?: string;
  qualityScore?: number;
  expectedCtr?: string;
  adRelevance?: string;
  landingPageExp?: string;
}

export interface AdCopyData {
  id: string;
  headline: string;
  description: string;
  campaignId: string;
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  clicks: number;
  impressions: number;
  ctr: number;
  spend: number;
  conversions: number;
  costPerConversion: number;
  performanceScore: 'high' | 'medium' | 'low';
}

export interface AssetData {
  id: string;
  name: string;
  type: 'image' | 'video' | 'banner';
  url: string;
  campaignId: string;
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  conversions: number;
  costPerConversion: number;
  performanceScore: 'high' | 'medium' | 'low';
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

export const keywordPerformanceData: KeywordData[] = [
  {
    id: '1',
    keyword: 'digital marketing',
    campaignId: '1',
    campaignName: 'Summer Sale Promotion',
    adGroupId: '1',
    adGroupName: 'Summer Products',
    clicks: 487,
    impressions: 5621,
    ctr: 8.66,
    spend: 245.32,
    conversions: 21,
    costPerConversion: 11.68,
    performanceScore: 'high',
    matchType: 'Exact',
    status: 'Active',
    qualityScore: 8,
    expectedCtr: 'Above average',
    adRelevance: 'Above average',
    landingPageExp: 'Average'
  },
  {
    id: '2',
    keyword: 'online advertising',
    campaignId: '1',
    campaignName: 'Summer Sale Promotion',
    adGroupId: '1',
    adGroupName: 'Summer Products',
    clicks: 312,
    impressions: 4320,
    ctr: 7.22,
    spend: 187.45,
    conversions: 13,
    costPerConversion: 14.42,
    performanceScore: 'medium',
    matchType: 'Phrase',
    status: 'Active',
    qualityScore: 7,
    expectedCtr: 'Average',
    adRelevance: 'Above average',
    landingPageExp: 'Average'
  },
  {
    id: '3',
    keyword: 'summer deals',
    campaignId: '1',
    campaignName: 'Summer Sale Promotion',
    adGroupId: '2',
    adGroupName: 'Seasonal Deals',
    clicks: 215,
    impressions: 3210,
    ctr: 6.70,
    spend: 157.89,
    conversions: 8,
    costPerConversion: 19.74,
    performanceScore: 'low',
    matchType: 'Broad',
    status: 'Active',
    qualityScore: 5,
    expectedCtr: 'Below average',
    adRelevance: 'Average',
    landingPageExp: 'Below average'
  },
  {
    id: '4',
    keyword: 'brand awareness',
    campaignId: '2',
    campaignName: 'Brand Awareness',
    adGroupId: '3',
    adGroupName: 'Brand Visibility',
    clicks: 678,
    impressions: 12453,
    ctr: 5.44,
    spend: 432.67,
    conversions: 32,
    costPerConversion: 13.52,
    performanceScore: 'high',
    matchType: 'Exact',
    status: 'Active',
    qualityScore: 9,
    expectedCtr: 'Above average',
    adRelevance: 'Above average',
    landingPageExp: 'Above average'
  },
  {
    id: '5',
    keyword: 'company reputation',
    campaignId: '2',
    campaignName: 'Brand Awareness',
    adGroupId: '4',
    adGroupName: 'Corporate Image',
    clicks: 423,
    impressions: 8756,
    ctr: 4.83,
    spend: 312.45,
    conversions: 18,
    costPerConversion: 17.36,
    performanceScore: 'medium',
    matchType: 'Phrase',
    status: 'Active',
    qualityScore: 7,
    expectedCtr: 'Average',
    adRelevance: 'Above average',
    landingPageExp: 'Average'
  },
  {
    id: '6',
    keyword: 'new product launch',
    campaignId: '3',
    campaignName: 'Product Launch',
    adGroupId: '5',
    adGroupName: 'New Features',
    clicks: 756,
    impressions: 9876,
    ctr: 7.65,
    spend: 621.34,
    conversions: 43,
    costPerConversion: 14.45,
    performanceScore: 'high',
    matchType: 'Exact',
    status: 'Active',
    qualityScore: 8,
    expectedCtr: 'Above average',
    adRelevance: 'Above average',
    landingPageExp: 'Above average'
  },
  {
    id: '7',
    keyword: 'product features',
    campaignId: '3',
    campaignName: 'Product Launch',
    adGroupId: '6',
    adGroupName: 'Product Benefits',
    clicks: 389,
    impressions: 5432,
    ctr: 7.16,
    spend: 345.67,
    conversions: 21,
    costPerConversion: 16.46,
    performanceScore: 'medium',
    matchType: 'Phrase',
    status: 'Active',
    qualityScore: 7,
    expectedCtr: 'Average',
    adRelevance: 'Above average',
    landingPageExp: 'Average'
  },
  {
    id: '8',
    keyword: 'special discount',
    campaignId: '4',
    campaignName: 'Retargeting Campaign',
    adGroupId: '7',
    adGroupName: 'Previous Customers',
    clicks: 543,
    impressions: 4321,
    ctr: 12.57,
    spend: 276.54,
    conversions: 32,
    costPerConversion: 8.64,
    performanceScore: 'high',
    matchType: 'Broad',
    status: 'Active',
    qualityScore: 8,
    expectedCtr: 'Above average',
    adRelevance: 'Average',
    landingPageExp: 'Average'
  },
  {
    id: '9',
    keyword: 'holiday gift ideas',
    campaignId: '5',
    campaignName: 'Holiday Special',
    adGroupId: '8',
    adGroupName: 'Christmas Gifts',
    clicks: 678,
    impressions: 8765,
    ctr: 7.74,
    spend: 543.21,
    conversions: 35,
    costPerConversion: 15.52,
    performanceScore: 'high',
    matchType: 'Exact',
    status: 'Active',
    qualityScore: 9,
    expectedCtr: 'Above average',
    adRelevance: 'Above average',
    landingPageExp: 'Above average'
  },
  {
    id: '10',
    keyword: 'christmas sale',
    campaignId: '5',
    campaignName: 'Holiday Special',
    adGroupId: '9',
    adGroupName: 'Holiday Discounts',
    clicks: 456,
    impressions: 6789,
    ctr: 6.72,
    spend: 387.65,
    conversions: 24,
    costPerConversion: 16.15,
    performanceScore: 'medium',
    matchType: 'Phrase',
    status: 'Active',
    qualityScore: 6,
    expectedCtr: 'Average',
    adRelevance: 'Average',
    landingPageExp: 'Average'
  }
];

export const adCopyPerformanceData: AdCopyData[] = [
  {
    id: '1',
    headline: 'Limited Time Offer',
    description: 'Get 50% off on all summer products',
    campaignId: '1',
    campaignName: 'Summer Sale Promotion',
    adGroupId: '1',
    adGroupName: 'Summer Products',
    clicks: 523,
    impressions: 6120,
    ctr: 8.55,
    spend: 267.45,
    conversions: 24,
    costPerConversion: 11.14,
    performanceScore: 'high'
  },
  {
    id: '2',
    headline: 'Summer Discounts',
    description: 'Beat the heat with cool savings',
    campaignId: '1',
    campaignName: 'Summer Sale Promotion',
    adGroupId: '2',
    adGroupName: 'Seasonal Deals',
    clicks: 345,
    impressions: 4780,
    ctr: 7.22,
    spend: 198.60,
    conversions: 15,
    costPerConversion: 13.24,
    performanceScore: 'medium'
  },
  {
    id: '3',
    headline: 'Discover Our Brand',
    description: 'Quality and innovation you can trust',
    campaignId: '2',
    campaignName: 'Brand Awareness',
    adGroupId: '3',
    adGroupName: 'Brand Visibility',
    clicks: 712,
    impressions: 13450,
    ctr: 5.29,
    spend: 456.78,
    conversions: 35,
    costPerConversion: 13.05,
    performanceScore: 'high'
  },
  {
    id: '4',
    headline: 'Meet the Leaders',
    description: 'Industry experts with proven results',
    campaignId: '2',
    campaignName: 'Brand Awareness',
    adGroupId: '4',
    adGroupName: 'Corporate Image',
    clicks: 456,
    impressions: 9120,
    ctr: 5.00,
    spend: 342.67,
    conversions: 21,
    costPerConversion: 16.32,
    performanceScore: 'medium'
  },
  {
    id: '5',
    headline: 'Introducing New Features',
    description: 'Experience the innovation firsthand',
    campaignId: '3',
    campaignName: 'Product Launch',
    adGroupId: '5',
    adGroupName: 'New Features',
    clicks: 834,
    impressions: 10567,
    ctr: 7.89,
    spend: 678.45,
    conversions: 47,
    costPerConversion: 14.43,
    performanceScore: 'high'
  },
  {
    id: '6',
    headline: 'Transform Your Experience',
    description: 'See what our new product can do for you',
    campaignId: '3',
    campaignName: 'Product Launch',
    adGroupId: '6',
    adGroupName: 'Product Benefits',
    clicks: 421,
    impressions: 5876,
    ctr: 7.16,
    spend: 365.32,
    conversions: 23,
    costPerConversion: 15.88,
    performanceScore: 'medium'
  },
  {
    id: '7',
    headline: 'Special Offer Inside',
    description: 'Click to see exclusive deals just for you',
    campaignId: '4',
    campaignName: 'Retargeting Campaign',
    adGroupId: '7',
    adGroupName: 'Previous Customers',
    clicks: 612,
    impressions: 4845,
    ctr: 12.63,
    spend: 312.87,
    conversions: 37,
    costPerConversion: 8.46,
    performanceScore: 'high'
  },
  {
    id: '8',
    headline: 'Festive Deals',
    description: 'Celebrate the holidays with amazing offers',
    campaignId: '5',
    campaignName: 'Holiday Special',
    adGroupId: '8',
    adGroupName: 'Christmas Gifts',
    clicks: 723,
    impressions: 9234,
    ctr: 7.83,
    spend: 576.54,
    conversions: 38,
    costPerConversion: 15.17,
    performanceScore: 'high'
  },
  {
    id: '9',
    headline: 'Gift Shopping Made Easy',
    description: 'Find the perfect present for everyone',
    campaignId: '5',
    campaignName: 'Holiday Special',
    adGroupId: '8',
    adGroupName: 'Christmas Gifts',
    clicks: 489,
    impressions: 7123,
    ctr: 6.87,
    spend: 412.65,
    conversions: 26,
    costPerConversion: 15.87,
    performanceScore: 'medium'
  },
  {
    id: '10',
    headline: 'Last Minute Gifts',
    description: 'Fast shipping on all holiday orders',
    campaignId: '5',
    campaignName: 'Holiday Special',
    adGroupId: '9',
    adGroupName: 'Holiday Discounts',
    clicks: 356,
    impressions: 5432,
    ctr: 6.55,
    spend: 287.43,
    conversions: 19,
    costPerConversion: 15.13,
    performanceScore: 'medium'
  }
];

export const assetPerformanceData: AssetData[] = [
  {
    id: '1',
    name: 'Summer Beach Banner',
    type: 'banner',
    url: '/assets/beach-banner.jpg',
    campaignId: '1',
    campaignName: 'Summer Sale Promotion',
    adGroupId: '1',
    adGroupName: 'Summer Products',
    impressions: 12450,
    clicks: 876,
    ctr: 7.04,
    spend: 432.56,
    conversions: 43,
    costPerConversion: 10.06,
    performanceScore: 'high'
  },
  {
    id: '2',
    name: 'Product Showcase',
    type: 'image',
    url: '/assets/product-display.jpg',
    campaignId: '1',
    campaignName: 'Summer Sale Promotion',
    adGroupId: '2',
    adGroupName: 'Seasonal Deals',
    impressions: 8790,
    clicks: 543,
    ctr: 6.18,
    spend: 321.45,
    conversions: 28,
    costPerConversion: 11.48,
    performanceScore: 'medium'
  },
  {
    id: '3',
    name: 'Brand Introduction',
    type: 'video',
    url: '/assets/brand-video.mp4',
    campaignId: '2',
    campaignName: 'Brand Awareness',
    adGroupId: '3',
    adGroupName: 'Brand Visibility',
    impressions: 15670,
    clicks: 982,
    ctr: 6.27,
    spend: 654.32,
    conversions: 51,
    costPerConversion: 12.83,
    performanceScore: 'high'
  },
  {
    id: '4',
    name: 'Corporate Story',
    type: 'image',
    url: '/assets/corporate-image.jpg',
    campaignId: '2',
    campaignName: 'Brand Awareness',
    adGroupId: '4',
    adGroupName: 'Corporate Image',
    impressions: 9870,
    clicks: 543,
    ctr: 5.50,
    spend: 387.65,
    conversions: 32,
    costPerConversion: 12.11,
    performanceScore: 'medium'
  },
  {
    id: '5',
    name: 'New Features Demo',
    type: 'video',
    url: '/assets/features-demo.mp4',
    campaignId: '3',
    campaignName: 'Product Launch',
    adGroupId: '5',
    adGroupName: 'New Features',
    impressions: 11230,
    clicks: 876,
    ctr: 7.80,
    spend: 567.89,
    conversions: 47,
    costPerConversion: 12.08,
    performanceScore: 'high'
  },
  {
    id: '6',
    name: 'Product Benefits Infographic',
    type: 'image',
    url: '/assets/benefits-infographic.jpg',
    campaignId: '3',
    campaignName: 'Product Launch',
    adGroupId: '6',
    adGroupName: 'Product Benefits',
    impressions: 7650,
    clicks: 487,
    ctr: 6.37,
    spend: 345.67,
    conversions: 29,
    costPerConversion: 11.92,
    performanceScore: 'medium'
  },
  {
    id: '7',
    name: 'Special Offer Banner',
    type: 'banner',
    url: '/assets/special-offer.jpg',
    campaignId: '4',
    campaignName: 'Retargeting Campaign',
    adGroupId: '7',
    adGroupName: 'Previous Customers',
    impressions: 6540,
    clicks: 765,
    ctr: 11.70,
    spend: 376.54,
    conversions: 43,
    costPerConversion: 8.76,
    performanceScore: 'high'
  },
  {
    id: '8',
    name: 'Holiday Gift Guide',
    type: 'image',
    url: '/assets/gift-guide.jpg',
    campaignId: '5',
    campaignName: 'Holiday Special',
    adGroupId: '8',
    adGroupName: 'Christmas Gifts',
    impressions: 9870,
    clicks: 765,
    ctr: 7.75,
    spend: 498.76,
    conversions: 41,
    costPerConversion: 12.17,
    performanceScore: 'high'
  },
  {
    id: '9',
    name: 'Christmas Sale Banner',
    type: 'banner',
    url: '/assets/christmas-banner.jpg',
    campaignId: '5',
    campaignName: 'Holiday Special',
    adGroupId: '9',
    adGroupName: 'Holiday Discounts',
    impressions: 8760,
    clicks: 654,
    ctr: 7.47,
    spend: 432.10,
    conversions: 35,
    costPerConversion: 12.35,
    performanceScore: 'medium'
  },
  {
    id: '10',
    name: 'Fast Shipping Promotion',
    type: 'video',
    url: '/assets/shipping-promo.mp4',
    campaignId: '5',
    campaignName: 'Holiday Special',
    adGroupId: '9',
    adGroupName: 'Holiday Discounts',
    impressions: 6540,
    clicks: 487,
    ctr: 7.45,
    spend: 354.76,
    conversions: 28,
    costPerConversion: 12.67,
    performanceScore: 'medium'
  }
];

export const searchTermsData = [
  {
    id: '1',
    searchTerm: 'digital marketing services',
    matchType: 'EXACT' as const,
    campaignId: '1',
    adGroupId: '1',
    impressions: 2345,
    clicks: 187,
    spend: 89.45,
    conversions: 12,
    ctr: 7.97,
    cpc: 0.48,
    conversionRate: 6.42,
    costPerConversion: 7.45,
    queryMatchType: 'EXACT' as const,
    addedToKeywords: true
  },
  {
    id: '2',
    searchTerm: 'online marketing agency',
    matchType: 'PHRASE' as const,
    campaignId: '1',
    adGroupId: '1',
    impressions: 1876,
    clicks: 134,
    spend: 67.32,
    conversions: 8,
    ctr: 7.14,
    cpc: 0.50,
    conversionRate: 5.97,
    costPerConversion: 8.42,
    queryMatchType: 'PHRASE' as const,
    addedToKeywords: false
  },
  {
    id: '3',
    searchTerm: 'summer sale discount',
    matchType: 'BROAD' as const,
    campaignId: '1',
    adGroupId: '2',
    impressions: 3421,
    clicks: 245,
    spend: 123.67,
    conversions: 15,
    ctr: 7.16,
    cpc: 0.50,
    conversionRate: 6.12,
    costPerConversion: 8.24,
    queryMatchType: 'BROAD' as const,
    addedToKeywords: true
  },
  {
    id: '4',
    searchTerm: 'brand awareness campaign',
    matchType: 'EXACT' as const,
    campaignId: '2',
    adGroupId: '3',
    impressions: 4567,
    clicks: 298,
    spend: 156.78,
    conversions: 18,
    ctr: 6.53,
    cpc: 0.53,
    conversionRate: 6.04,
    costPerConversion: 8.71,
    queryMatchType: 'EXACT' as const,
    addedToKeywords: true
  },
  {
    id: '5',
    searchTerm: 'company reputation management',
    matchType: 'PHRASE' as const,
    campaignId: '2',
    adGroupId: '4',
    impressions: 2789,
    clicks: 167,
    spend: 89.34,
    conversions: 9,
    ctr: 5.99,
    cpc: 0.54,
    conversionRate: 5.39,
    costPerConversion: 9.93,
    queryMatchType: 'NEAR_PHRASE' as const,
    addedToKeywords: false
  },
  {
    id: '6',
    searchTerm: 'new product features',
    matchType: 'EXACT' as const,
    campaignId: '3',
    adGroupId: '5',
    impressions: 3654,
    clicks: 287,
    spend: 145.32,
    conversions: 21,
    ctr: 7.85,
    cpc: 0.51,
    conversionRate: 7.32,
    costPerConversion: 6.92,
    queryMatchType: 'EXACT' as const,
    addedToKeywords: true
  },
  {
    id: '7',
    searchTerm: 'product benefits comparison',
    matchType: 'PHRASE' as const,
    campaignId: '3',
    adGroupId: '6',
    impressions: 2156,
    clicks: 145,
    spend: 78.45,
    conversions: 7,
    ctr: 6.73,
    cpc: 0.54,
    conversionRate: 4.83,
    costPerConversion: 11.21,
    queryMatchType: 'PHRASE' as const,
    addedToKeywords: false
  },
  {
    id: '8',
    searchTerm: 'special discount offer',
    matchType: 'BROAD' as const,
    campaignId: '4',
    adGroupId: '7',
    impressions: 1987,
    clicks: 234,
    spend: 98.76,
    conversions: 16,
    ctr: 11.78,
    cpc: 0.42,
    conversionRate: 6.84,
    costPerConversion: 6.17,
    queryMatchType: 'BROAD' as const,
    addedToKeywords: true
  },
  {
    id: '9',
    searchTerm: 'holiday gift ideas 2023',
    matchType: 'EXACT' as const,
    campaignId: '5',
    adGroupId: '8',
    impressions: 4321,
    clicks: 334,
    spend: 167.89,
    conversions: 22,
    ctr: 7.73,
    cpc: 0.50,
    conversionRate: 6.59,
    costPerConversion: 7.63,
    queryMatchType: 'EXACT' as const,
    addedToKeywords: true
  },
  {
    id: '10',
    searchTerm: 'christmas sale deals',
    matchType: 'PHRASE' as const,
    campaignId: '5',
    adGroupId: '9',
    impressions: 2987,
    clicks: 198,
    spend: 89.67,
    conversions: 11,
    ctr: 6.63,
    cpc: 0.45,
    conversionRate: 5.56,
    costPerConversion: 8.15,
    queryMatchType: 'NEAR_PHRASE' as const,
    addedToKeywords: false
  }
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

export const getDailyPerformance = () => {
  return dailyPerformance;
};

export const getCampaigns = () => {
  return campaignsData;
};
