
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

export interface SearchTermData {
  id: string;
  searchTerm: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
  campaignId: string;
  adGroupId: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  costPerConversion: number;
  queryMatchType: 'EXACT' | 'PHRASE' | 'BROAD' | 'NEAR_EXACT' | 'NEAR_PHRASE';
  addedToKeywords: boolean;
}
