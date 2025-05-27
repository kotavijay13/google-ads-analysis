
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
      console.log('Google Ads connection found for user:', userId);
      
      // Check if token is still valid (not expired)
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (expiresAt > now) {
        console.log('Token is still valid');
        window.dispatchEvent(new CustomEvent('google-ads-connected', { detail: data }));
        return true;
      } else {
        console.log('Token has expired, need to refresh');
        return false;
      }
    } else {
      console.log('No Google Ads connection found for user:', userId);
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
    
    console.log('Accounts fetch result:', { data, error, userId });
    
    if (error) {
      console.error('Error fetching accounts:', error);
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
      console.log('No Google Ads accounts found in database for user:', userId);
      
      // Try to fetch accounts from Google Ads API
      console.log('Attempting to fetch accounts from Google Ads API...');
      
      const { data: tokenData } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', userId)
        .eq('provider', 'google')
        .single();
      
      if (tokenData) {
        console.log('Triggering account refresh from API...');
        toast.info('Fetching your Google Ads accounts...');
        
        // This should trigger the edge function to fetch accounts
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
  console.log('Initializing selected account. Saved:', savedAccountId, 'Available accounts:', accounts);
  
  if (savedAccountId && accounts.find(acc => acc.id === savedAccountId)) {
    console.log('Using saved account:', savedAccountId);
    return savedAccountId;
  } else {
    const firstAccountId = accounts[0].id;
    console.log('Using first available account:', firstAccountId);
    localStorage.setItem('selectedGoogleAdsAccount', firstAccountId);
    return firstAccountId;
  }
};
