
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
      console.log('No user found, skipping connection check');
      return;
    }
    
    console.log('Checking connection for user:', user.id);
    
    try {
      const isConnected = await checkGoogleAdsConnection(user.id);
      console.log('Connection status:', isConnected);
      setState(prev => ({ ...prev, connected: isConnected, configError: null }));
    } catch (error) {
      console.error("Error checking connection:", error);
      setState(prev => ({ ...prev, connected: false }));
    }
  }, [user]);

  const fetchAccounts = useCallback(async () => {
    if (!user) {
      console.log('No user found, skipping account fetch');
      return;
    }
    
    console.log('Fetching accounts for user:', user.id);
    
    try {
      const accounts = await fetchGoogleAdsAccounts(user.id);
      console.log('Fetched accounts:', accounts);
      setState(prev => ({ ...prev, accounts }));
      
      if (accounts.length > 0) {
        const selectedAccountId = initializeSelectedAccount(accounts);
        setState(prev => ({ ...prev, selectedAccount: selectedAccountId }));
        console.log('Selected account ID:', selectedAccountId);
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.error('Error in fetchAccounts:', error);
    }
  }, [user]);

  useEffect(() => {
    console.log('useGoogleAdsIntegration - user changed:', user?.id);
    if (user) {
      checkConnection();
      fetchAccounts();
    } else {
      // Reset state when no user
      setState({
        loading: false,
        refreshing: false,
        accounts: [],
        connected: false,
        configError: null,
        selectedAccount: null,
      });
    }
  }, [user, checkConnection, fetchAccounts]);

  // Set up event listeners
  useGoogleAdsEventListeners(state, checkConnection, fetchAccounts);

  const handleConnect = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }
    
    try {
      setState(prev => ({ ...prev, configError: null, loading: true }));
      console.log('Starting Google Ads OAuth flow for user:', user.id);
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
    console.log('Handle select account:', accountId);
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
