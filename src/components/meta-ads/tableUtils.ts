
export const campaignColumns = [
  { key: 'selected', label: 'Selected' },
  { key: 'campaignId', label: 'Campaign ID' },
  { key: 'campaignName', label: 'Campaign Name' },
  { key: 'objective', label: 'Objective' },
  { key: 'buyingType', label: 'Buying Type' },
  { key: 'status', label: 'Status' },
  { key: 'budget', label: 'Budget' },
  { key: 'amountSpent', label: 'Amount Spent' },
  { key: 'impressions', label: 'Impressions' },
  { key: 'reach', label: 'Reach' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'cpm', label: 'CPM (Cost per 1,000 Impressions)' },
  { key: 'ctr', label: 'CTR (Click-through Rate)' },
  { key: 'cpc', label: 'CPC (Cost per Click)' },
  { key: 'results', label: 'Results' },
  { key: 'costPerResult', label: 'Cost per Result' },
  { key: 'resultRate', label: 'Result Rate' },
  { key: 'roas', label: 'ROAS (Return on Ad Spend)' },
  { key: 'purchases', label: 'Purchases' },
  { key: 'purchaseValue', label: 'Purchase Conversion Value' },
  { key: 'websiteLeads', label: 'Website Leads' },
  { key: 'addToCart', label: 'Add to Cart' },
  { key: 'landingPageViews', label: 'Landing Page Views' },
  { key: 'linkClicks', label: 'Link Clicks' },
  { key: 'saves', label: 'Saves' }
];

export const adSetColumns = [
  { key: 'selected', label: 'Selected' },
  { key: 'adSetId', label: 'Ad Set ID' },
  { key: 'adSetName', label: 'Ad Set Name' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'optimizationGoal', label: 'Optimization Goal' },
  { key: 'bidStrategy', label: 'Bid Strategy' },
  { key: 'budget', label: 'Budget' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'audience', label: 'Audience' },
  { key: 'placement', label: 'Placement' },
  { key: 'devices', label: 'Devices' },
  { key: 'impressions', label: 'Impressions' },
  { key: 'reach', label: 'Reach' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'clicks', label: 'Clicks' },
  { key: 'linkClicks', label: 'Link Clicks' },
  { key: 'cpcLinkClick', label: 'CPC (Cost per Link Click)' },
  { key: 'ctr', label: 'CTR' },
  { key: 'cpm', label: 'CPM' },
  { key: 'conversions', label: 'Conversions' },
  { key: 'costPerConversion', label: 'Cost per Conversion' },
  { key: 'leads', label: 'Leads' },
  { key: 'addToCart', label: 'Add to Cart' },
  { key: 'initiatedCheckout', label: 'Initiated Checkout' },
  { key: 'purchases', label: 'Purchases' },
  { key: 'purchaseValue', label: 'Purchase Value' }
];

export const adColumns = [
  { key: 'selected', label: 'Selected' },
  { key: 'adId', label: 'Ad ID' },
  { key: 'adName', label: 'Ad Name' },
  { key: 'adCreative', label: 'Ad Creative' },
  { key: 'status', label: 'Status' },
  { key: 'format', label: 'Format' },
  { key: 'callToAction', label: 'Call to Action' },
  { key: 'impressions', label: 'Impressions' },
  { key: 'reach', label: 'Reach' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'linkClicks', label: 'Link Clicks' },
  { key: 'allClicks', label: 'All Clicks' },
  { key: 'cpc', label: 'CPC (Cost per Click)' },
  { key: 'cpm', label: 'CPM' },
  { key: 'ctr', label: 'CTR' },
  { key: 'engagements', label: 'Engagements' },
  { key: 'videoPlays', label: 'Video Plays' },
  { key: 'leads', label: 'Leads' },
  { key: 'addToCart', label: 'Add to Cart' },
  { key: 'purchase', label: 'Purchase' },
  { key: 'roas', label: 'ROAS' },
  { key: 'qualityRanking', label: 'Quality Ranking' },
  { key: 'engagementRateRanking', label: 'Engagement Rate Ranking' },
  { key: 'conversionRateRanking', label: 'Conversion Rate Ranking' }
];

export const renderTableCell = (columnKey: string, account: any) => {
  if (columnKey === 'selected') {
    return null; // Will be handled by the table component
  }
  if (columnKey === 'campaignId' || columnKey === 'adSetId' || columnKey === 'adId') {
    return account.id;
  }
  if (columnKey === 'campaignName' || columnKey === 'adSetName' || columnKey === 'adName') {
    return account.name;
  }
  return '-';
};
