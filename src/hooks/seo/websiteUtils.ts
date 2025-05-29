export const processGSCWebsites = (gscProperties: any[]) => {
  const websites = gscProperties
    .map(property => {
      try {
        const url = new URL(property.account_id);
        return url.hostname;
      } catch {
        return property.account_name || property.account_id;
      }
    })
    .filter(website => website && typeof website === 'string' && website.trim().length > 0);
  
  // Remove duplicates and clean up
  return [...new Set(websites)];
};

export const processGoogleAdsWebsites = (googleAdsAccounts: any[]) => {
  const websites = googleAdsAccounts
    .map(account => {
      const accountName = account.account_name?.toLowerCase().replace(/\s+/g, '') || 'website';
      return `${accountName}.com`;
    })
    .filter(website => website && website !== '.com' && website.trim().length > 0);
  
  // Remove duplicates
  return [...new Set(websites)];
};

export const getDefaultWebsites = () => {
  return ['www.vantagesecurity.com', 'thedempseyproject.com', 'mergeinsights.ai', 'example.com'];
};

export const combineWebsites = (websites: string[], defaultWebsites: string[]) => {
  // Combine and remove duplicates
  const combined = [...new Set([...defaultWebsites, ...websites])];
  
  // Remove any entries that are just domain variations of the same site
  const cleaned = combined.filter((website, index, arr) => {
    const withoutWww = website.replace(/^www\./, '');
    const withWww = `www.${withoutWww}`;
    
    // If this is the www version, only keep it if there's no non-www version
    if (website.startsWith('www.')) {
      return !arr.includes(withoutWww);
    }
    
    // If this is the non-www version, only keep it if there's no www version or this comes first
    return !arr.includes(withWww) || arr.indexOf(withWww) > index;
  });
  
  return cleaned;
};
