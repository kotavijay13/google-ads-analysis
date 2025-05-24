

// Type exports
export type {
  Campaign,
  AdGroup,
  DailyData,
  DeviceData,
  GeoData,
  KeywordData,
  AdCopyData,
  AssetData,
  SearchTermData
} from './types';

// Data exports
export { campaignsData, adGroupsData } from './campaigns';
export { dailyPerformance, deviceData, geoData } from './performance';
export { keywordPerformanceData } from './keywords';
export { adCopyPerformanceData } from './adCopy';
export { assetPerformanceData } from './assets';
export { searchTermsData } from './searchTerms';

// Utility function exports
export { getOverviewMetrics } from './utils';

// Import the data needed for legacy functions
import { dailyPerformance } from './performance';
import { campaignsData } from './campaigns';

// Legacy function exports for backward compatibility
export const getDailyPerformance = () => {
  return dailyPerformance;
};

export const getCampaigns = () => {
  return campaignsData;
};

