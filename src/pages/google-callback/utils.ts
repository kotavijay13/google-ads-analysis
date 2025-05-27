
export const getServiceName = (authType: 'search-console' | 'ads') => {
  return authType === 'ads' ? 'Google Ads' : 'Google Search Console';
};

export const getTargetPage = (authType: 'search-console' | 'ads') => {
  return authType === 'ads' ? '/integrations' : '/search-console';
};

export const goToIntegrations = (navigate: (path: string) => void) => {
  navigate('/integrations');
};

export const goToGoogleCloudConsole = () => {
  window.open('https://console.cloud.google.com/apis/credentials', '_blank');
};
