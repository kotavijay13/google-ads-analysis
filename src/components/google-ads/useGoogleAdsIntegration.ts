
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { GoogleAdsIntegrationState } from './types';
import { 
  checkGoogleAdsConnection, 
  fetchGoogleAdsAccounts, 
  selectGoogleAdsAccount,
  initializeSelectedAccount 
} from './googleAdsUtils';
import { initiateGoogleAdsOAuth } from './googleAdsOAuth';
import { useGoogleAdsEventListeners } from './googleAdsEvents';

export const useGoogleAdsIntegration = () => {
  const { user } = useAuth();
  const [state, setState] = useState<GoogleAdsIntegrationState>({
    loading: false,
    refreshing: false,
    accounts: [],
    connected: false,
    configError: null,
    selectedAccount: null,
  });

  const checkConnection = useCallback(async () => {
    if (!user) return;
    
    try {
      const isConnected = await checkGoogleAdsConnection(user.id);
      setState(prev => ({ ...prev, connected: isConnected, configError: null }));
    } catch (error) {
      console.error("Error checking connection:", error);
      setState(prev => ({ ...prev, connected: false }));
    }
  }, [user]);

  const fetchAccounts = useCallback(async () => {
    if (!user) return;
    
    try {
      const accounts = await fetchGoogleAdsAccounts(user.id);
      setState(prev => ({ ...prev, accounts }));
      
      if (accounts.length > 0) {
        const selectedAccountId = initializeSelectedAccount(accounts);
        setState(prev => ({ ...prev, selectedAccount: selectedAccountId }));
      }
    } catch (error) {
      console.error('Error in fetchAccounts:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      checkConnection();
      fetchAccounts();
    }
  }, [user, checkConnection, fetchAccounts]);

  // Set up event listeners
  useGoogleAdsEventListeners(state, checkConnection, fetchAccounts);

  const handleConnect = async () => {
    try {
      setState(prev => ({ ...prev, configError: null, loading: true }));
      console.log('Starting Google Ads OAuth flow...');
      await initiateGoogleAdsOAuth();
    } catch (error) {
      console.error("Error initiating Google OAuth:", error);
      setState(prev => ({ 
        ...prev, 
        configError: (error as Error).message || "OAuth initialization failed. Check console for details." 
      }));
      toast.error("Failed to connect to Google Ads");
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };
  
  const handleRefreshAccounts = async () => {
    setState(prev => ({ ...prev, refreshing: true }));
    await checkConnection();
    await fetchAccounts();
    setState(prev => ({ ...prev, refreshing: false }));
    toast.success('Account data refreshed');
  };
  
  const handleSelectAccount = (accountId: string) => {
    setState(prev => ({ ...prev, selectedAccount: accountId }));
    selectGoogleAdsAccount(accountId, state.accounts);
  };

  return {
    ...state,
    checkConnection,
    fetchAccounts,
    handleConnect,
    handleRefreshAccounts,
    handleSelectAccount,
  };
};
