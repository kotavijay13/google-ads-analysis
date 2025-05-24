
import { campaignsData } from './campaigns';

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
