
export interface MetaAdsAccount {
  id: string;
  name: string;
  
  // Campaign level fields
  objective?: string;
  buyingType?: string;
  status?: string;
  budget?: string;
  amountSpent?: number;
  impressions?: number;
  reach?: number;
  frequency?: number;
  cpm?: number;
  ctr?: number;
  cpc?: number;
  results?: number;
  costPerResult?: number;
  resultRate?: number;
  roas?: number;
  purchases?: number;
  purchaseValue?: number;
  websiteLeads?: number;
  addToCart?: number;
  landingPageViews?: number;
  linkClicks?: number;
  saves?: number;
  
  // Ad Set level fields
  delivery?: string;
  optimizationGoal?: string;
  bidStrategy?: string;
  schedule?: string;
  audience?: string;
  placement?: string;
  devices?: string;
  clicks?: number;
  cpcLinkClick?: number;
  conversions?: number;
  costPerConversion?: number;
  leads?: number;
  initiatedCheckout?: number;
  
  // Ad level fields
  adCreative?: string;
  format?: string;
  callToAction?: string;
  allClicks?: number;
  engagements?: number;
  videoPlays?: number;
  purchase?: number;
  qualityRanking?: string;
  engagementRateRanking?: string;
  conversionRateRanking?: string;
}
