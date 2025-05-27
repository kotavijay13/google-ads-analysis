
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { GoogleAdsAccount, GoogleAdsIntegrationState } from './types';

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

  useEffect(() => {
    if (user) {
      checkConnection();
      fetchAccounts();
    }
  }, [user]);

  // Listen for successful OAuth completion
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
  }, [state.connected]);

  const checkConnection = async () => {
    if (!user) return;
    
    console.log('Checking Google Ads connection status...');
    
    try {
      const { data, error } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .maybeSingle();
      
      console.log('Connection check result:', { data, error });
      
      if (data && !error) {
        setState(prev => ({ ...prev, connected: true, configError: null }));
        console.log('Google Ads connection found');
        
        window.dispatchEvent(new CustomEvent('google-ads-connected', { detail: data }));
      } else {
        setState(prev => ({ ...prev, connected: false }));
        console.log('No Google Ads connection found');
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      setState(prev => ({ ...prev, connected: false }));
    }
  };

  const fetchAccounts = async () => {
    if (!user) return;
    
    console.log('Fetching Google Ads accounts...');
    
    try {
      const { data, error } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', 'google');
      
      console.log('Accounts fetch result:', { data, error });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const accountsData = data.map(account => ({
          id: account.account_id,
          name: account.account_name || `Account ${account.account_id}`
        }));
        
        console.log('Found Google Ads accounts:', accountsData);
        setState(prev => ({ ...prev, accounts: accountsData }));
        
        const savedAccountId = localStorage.getItem('selectedGoogleAdsAccount');
        if (savedAccountId && accountsData.length > 0) {
          const savedAccount = accountsData.find(acc => acc.id === savedAccountId);
          if (savedAccount) {
            setState(prev => ({ ...prev, selectedAccount: savedAccount.id }));
          } else {
            setState(prev => ({ ...prev, selectedAccount: accountsData[0].id }));
            localStorage.setItem('selectedGoogleAdsAccount', accountsData[0].id);
          }
        } else if (accountsData.length > 0) {
          setState(prev => ({ ...prev, selectedAccount: accountsData[0].id }));
          localStorage.setItem('selectedGoogleAdsAccount', accountsData[0].id);
        }

        window.dispatchEvent(new CustomEvent('google-ads-accounts-loaded', { 
          detail: { accounts: accountsData, selectedAccount: accountsData[0]?.id } 
        }));
      } else {
        console.log('No Google Ads accounts found in database');
        setState(prev => ({ ...prev, accounts: [] }));
      }
    } catch (error) {
      console.error('Error fetching Google Ads accounts:', error);
      toast.error('Failed to fetch Google Ads accounts');
    }
  };

  const handleConnect = async () => {
    try {
      setState(prev => ({ ...prev, configError: null, loading: true }));
      
      console.log('Starting Google Ads OAuth flow...');
      
      const state = Math.random().toString(36).substring(2);
      localStorage.setItem('googleOAuthState', state);
      
      const redirectUri = window.location.origin + '/google-callback';
      
      console.log('OAuth parameters:', { redirectUri, state });
      console.log('Current domain:', window.location.origin);
      
      console.log("Getting Google client ID from edge function");
      const { data: clientData, error: clientError } = await supabase.functions.invoke('google-ads-auth', {
        body: { 
          action: 'get_client_id'
        }
      });
      
      if (clientError || !clientData?.clientId) {
        console.error("Failed to get client ID:", clientError, clientData);
        throw new Error('Could not retrieve Google Client ID. Please check your configuration.');
      }
      
      const clientId = clientData.clientId;
      const scope = encodeURIComponent('https://www.googleapis.com/auth/adwords');
      
      console.log("Starting Google OAuth with client ID:", clientId.substring(0, 8) + '...');
      
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent&include_granted_scopes=true`;
      
      console.log('Redirecting to OAuth URL with redirect URI:', redirectUri);
      
      window.location.href = oauthUrl;
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
    localStorage.setItem('selectedGoogleAdsAccount', accountId);
    
    const account = state.accounts.find(acc => acc.id === accountId);
    if (account) {
      toast.success(`Selected account: ${account.name}`);
      
      window.dispatchEvent(new CustomEvent('google-ads-account-selected', { 
        detail: { accountId, accountName: account.name } 
      }));
    }
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
