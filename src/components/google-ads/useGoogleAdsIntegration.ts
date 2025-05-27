
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
    if (!user) {
      console.log('No user found for connection check');
      return;
    }
    
    console.log('Checking Google Ads connection for user:', user.id);
    
    try {
      const isConnected = await checkGoogleAdsConnection(user.id);
      console.log('Connection check result:', isConnected);
      setState(prev => ({ ...prev, connected: isConnected, configError: null }));
      
      // If connected, immediately try to fetch accounts
      if (isConnected) {
        console.log('User is connected, fetching accounts...');
        await fetchAccounts();
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      setState(prev => ({ ...prev, connected: false }));
    }
  }, [user]);

  const fetchAccounts = useCallback(async () => {
    if (!user) {
      console.log('No user found for account fetch');
      return;
    }
    
    console.log('Fetching Google Ads accounts for user:', user.id);
    
    try {
      setState(prev => ({ ...prev, refreshing: true }));
      const accounts = await fetchGoogleAdsAccounts(user.id);
      console.log('Fetched accounts:', accounts);
      
      setState(prev => ({ ...prev, accounts, refreshing: false }));
      
      if (accounts.length > 0) {
        const selectedAccountId = initializeSelectedAccount(accounts);
        setState(prev => ({ ...prev, selectedAccount: selectedAccountId }));
        console.log('Set selected account:', selectedAccountId);
      } else {
        console.log('No accounts found, user may need to reconnect');
        setState(prev => ({ ...prev, selectedAccount: null }));
      }
    } catch (error) {
      console.error('Error in fetchAccounts:', error);
      setState(prev => ({ ...prev, refreshing: false }));
    }
  }, [user]);

  useEffect(() => {
    console.log('useGoogleAdsIntegration effect triggered, user:', user?.id);
    if (user) {
      checkConnection();
    }
  }, [user, checkConnection]);

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
    console.log('Refreshing accounts manually...');
    setState(prev => ({ ...prev, refreshing: true }));
    await checkConnection();
    setState(prev => ({ ...prev, refreshing: false }));
    toast.success('Account data refreshed');
  };
  
  const handleSelectAccount = (accountId: string) => {
    console.log('Selecting account:', accountId);
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
