
import { useEffect } from 'react';
import { GoogleAdsIntegrationState } from './types';

export const useGoogleAdsEventListeners = (
  state: GoogleAdsIntegrationState,
  checkConnection: () => Promise<void>,
  fetchAccounts: () => Promise<void>
) => {
  useEffect(() => {
    const handleOAuthSuccess = () => {
      console.log('OAuth success detected, refreshing connection status...');
      setTimeout(() => {
        checkConnection();
        fetchAccounts();
      }, 1000);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !state.connected) {
        console.log('Page became visible, checking for new connection...');
        setTimeout(() => {
          checkConnection();
          fetchAccounts();
        }, 1000);
      }
    };

    window.addEventListener('google-oauth-success', handleOAuthSuccess);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('google-oauth-success', handleOAuthSuccess);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.connected, checkConnection, fetchAccounts]);
};
