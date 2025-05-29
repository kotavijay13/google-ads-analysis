
export const processGSCWebsites = (gscProperties: any[]) => {
  return gscProperties
    .map(property => {
      try {
        const url = new URL(property.account_id);
        return url.hostname;
      } catch {
        return property.account_name || property.account_id;
      }
    })
    .filter(website => website && typeof website === 'string' && website.trim().length > 0);
};

export const processGoogleAdsWebsites = (googleAdsAccounts: any[]) => {
  return googleAdsAccounts
    .map(account => {
      const accountName = account.account_name?.toLowerCase().replace(/\s+/g, '') || 'website';
      return `${accountName}.com`;
    })
    .filter(website => website && website !== '.com' && website.trim().length > 0);
};

export const getDefaultWebsites = () => {
  return ['www.vantagesecurity.com', 'mergeinsights.ai', 'example.com', 'testsite.org'];
};

export const combineWebsites = (websites: string[], defaultWebsites: string[]) => {
  return [...new Set([...defaultWebsites, ...websites])];
};
