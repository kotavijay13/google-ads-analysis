
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
  
  // Handle ID fields
  if (columnKey === 'campaignId' || columnKey === 'adSetId' || columnKey === 'adId') {
    return account.id;
  }
  
  // Handle name fields
  if (columnKey === 'campaignName' || columnKey === 'adSetName' || columnKey === 'adName') {
    return account.name;
  }
  
  // Handle specific field mappings
  switch (columnKey) {
    // Campaign level fields
    case 'objective':
      return account.objective || '-';
    case 'buyingType':
      return account.buyingType || '-';
    case 'status':
      return account.status || '-';
    case 'budget':
      return account.budget || '-';
    case 'amountSpent':
      return account.amountSpent ? `$${account.amountSpent.toLocaleString(undefined, {maximumFractionDigits: 2})}` : '-';
    case 'impressions':
      return account.impressions ? account.impressions.toLocaleString() : '-';
    case 'reach':
      return account.reach ? account.reach.toLocaleString() : '-';
    case 'frequency':
      return account.frequency ? account.frequency.toFixed(2) : '-';
    case 'cpm':
      return account.cpm ? `$${account.cpm.toFixed(2)}` : '-';
    case 'ctr':
      return account.ctr ? `${account.ctr.toFixed(2)}%` : '-';
    case 'cpc':
      return account.cpc ? `$${account.cpc.toFixed(2)}` : '-';
    case 'results':
      return account.results ? account.results.toLocaleString() : '-';
    case 'costPerResult':
      return account.costPerResult ? `$${account.costPerResult.toFixed(2)}` : '-';
    case 'resultRate':
      return account.resultRate ? `${(account.resultRate * 100).toFixed(2)}%` : '-';
    case 'roas':
      return account.roas ? `${account.roas.toFixed(1)}x` : '-';
    case 'purchases':
      return account.purchases ? account.purchases.toLocaleString() : '-';
    case 'purchaseValue':
      return account.purchaseValue ? `$${account.purchaseValue.toLocaleString(undefined, {maximumFractionDigits: 2})}` : '-';
    case 'websiteLeads':
      return account.websiteLeads ? account.websiteLeads.toLocaleString() : '-';
    case 'addToCart':
      return account.addToCart ? account.addToCart.toLocaleString() : '-';
    case 'landingPageViews':
      return account.landingPageViews ? account.landingPageViews.toLocaleString() : '-';
    case 'linkClicks':
      return account.linkClicks ? account.linkClicks.toLocaleString() : '-';
    case 'saves':
      return account.saves ? account.saves.toLocaleString() : '-';
    
    // Ad Set level fields
    case 'delivery':
      return account.delivery || '-';
    case 'optimizationGoal':
      return account.optimizationGoal || '-';
    case 'bidStrategy':
      return account.bidStrategy || '-';
    case 'schedule':
      return account.schedule || '-';
    case 'audience':
      return account.audience || '-';
    case 'placement':
      return account.placement || '-';
    case 'devices':
      return account.devices || '-';
    case 'clicks':
      return account.clicks ? account.clicks.toLocaleString() : '-';
    case 'cpcLinkClick':
      return account.cpcLinkClick ? `$${account.cpcLinkClick.toFixed(2)}` : '-';
    case 'conversions':
      return account.conversions ? account.conversions.toLocaleString() : '-';
    case 'costPerConversion':
      return account.costPerConversion ? `$${account.costPerConversion.toFixed(2)}` : '-';
    case 'leads':
      return account.leads ? account.leads.toLocaleString() : '-';
    case 'initiatedCheckout':
      return account.initiatedCheckout ? account.initiatedCheckout.toLocaleString() : '-';
    
    // Ad level fields
    case 'adCreative':
      return account.adCreative || '-';
    case 'format':
      return account.format || '-';
    case 'callToAction':
      return account.callToAction || '-';
    case 'allClicks':
      return account.allClicks ? account.allClicks.toLocaleString() : '-';
    case 'engagements':
      return account.engagements ? account.engagements.toLocaleString() : '-';
    case 'videoPlays':
      return account.videoPlays ? account.videoPlays.toLocaleString() : '-';
    case 'purchase':
      return account.purchase ? account.purchase.toLocaleString() : '-';
    case 'qualityRanking':
      return account.qualityRanking || '-';
    case 'engagementRateRanking':
      return account.engagementRateRanking || '-';
    case 'conversionRateRanking':
      return account.conversionRateRanking || '-';
    
    default:
      return '-';
  }
};
