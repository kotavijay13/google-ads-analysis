
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { GoogleAdsAccount } from './types';

export const checkGoogleAdsConnection = async (userId: string) => {
  console.log('Checking Google Ads connection status for user:', userId);
  
  try {
    const { data, error } = await supabase
      .from('api_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .maybeSingle();
    
    console.log('Connection check result:', { data, error });
    
    if (data && !error) {
      console.log('Google Ads connection found, token expires at:', data.expires_at);
      
      // Check if token is expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (expiresAt <= now) {
        console.log('Token is expired, user needs to reconnect');
        toast.error('Your Google Ads connection has expired. Please reconnect.');
        return false;
      }
      
      window.dispatchEvent(new CustomEvent('google-ads-connected', { detail: data }));
      return true;
    } else {
      console.log('No Google Ads connection found');
      return false;
    }
  } catch (error) {
    console.error("Error checking connection:", error);
    return false;
  }
};

export const fetchGoogleAdsAccounts = async (userId: string): Promise<GoogleAdsAccount[]> => {
  console.log('Fetching Google Ads accounts for user:', userId);
  
  try {
    const { data, error } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'google');
    
    console.log('Accounts fetch result:', { data, error, count: data?.length });
    
    if (error) {
      console.error('Database error fetching accounts:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      const accountsData = data.map(account => ({
        id: account.account_id,
        name: account.account_name || `Account ${account.account_id}`
      }));
      
      console.log('Found Google Ads accounts:', accountsData);
      
      window.dispatchEvent(new CustomEvent('google-ads-accounts-loaded', { 
        detail: { accounts: accountsData, selectedAccount: accountsData[0]?.id } 
      }));
      
      return accountsData;
    } else {
      console.log('No Google Ads accounts found in database - this means the OAuth flow may not have completed properly');
      
      // Check if user has a valid token but no accounts
      const { data: tokenData } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', userId)
        .eq('provider', 'google')
        .maybeSingle();
      
      if (tokenData) {
        console.log('User has token but no accounts - suggesting to try the OAuth flow again');
        toast.error('No Google Ads accounts found. Please try reconnecting to refresh your account list.');
      }
      
      return [];
    }
  } catch (error) {
    console.error('Error fetching Google Ads accounts:', error);
    toast.error('Failed to fetch Google Ads accounts');
    return [];
  }
};

export const selectGoogleAdsAccount = (accountId: string, accounts: GoogleAdsAccount[]) => {
  console.log('Selecting Google Ads account:', accountId);
  localStorage.setItem('selectedGoogleAdsAccount', accountId);
  
  const account = accounts.find(acc => acc.id === accountId);
  if (account) {
    toast.success(`Selected account: ${account.name}`);
    
    window.dispatchEvent(new CustomEvent('google-ads-account-selected', { 
      detail: { accountId, accountName: account.name } 
    }));
  }
};

export const initializeSelectedAccount = (accounts: GoogleAdsAccount[]): string | null => {
  if (accounts.length === 0) return null;
  
  const savedAccountId = localStorage.getItem('selectedGoogleAdsAccount');
  if (savedAccountId && accounts.find(acc => acc.id === savedAccountId)) {
    console.log('Using saved account:', savedAccountId);
    return savedAccountId;
  } else {
    const firstAccountId = accounts[0].id;
    console.log('Using first account:', firstAccountId);
    localStorage.setItem('selectedGoogleAdsAccount', firstAccountId);
    return firstAccountId;
  }
};
