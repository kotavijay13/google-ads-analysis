
import { useState, useEffect } from 'react';

export interface GoogleAccount {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export function useGoogleAccounts() {
  const [accounts, setAccounts] = useState<GoogleAccount[]>([]);
  const [currentAccount, setCurrentAccount] = useState<GoogleAccount | null>(null);

  useEffect(() => {
    // Listen for Google Ads accounts being loaded
    const handleAccountsLoaded = (event: CustomEvent) => {
      console.log('Google Ads accounts loaded:', event.detail);
      const { accounts: googleAdsAccounts, selectedAccount } = event.detail;
      
      if (googleAdsAccounts && googleAdsAccounts.length > 0) {
        const formattedAccounts = googleAdsAccounts.map((account: any) => ({
          id: account.id,
          name: account.name,
          email: `${account.name.toLowerCase().replace(/\s+/g, '')}@googleads.com`
        }));
        
        setAccounts(formattedAccounts);
        
        // Set current account based on selected account or first one
        const currentAcc = selectedAccount 
          ? formattedAccounts.find((acc: GoogleAccount) => acc.id === selectedAccount) 
          : formattedAccounts[0];
        
        if (currentAcc) {
          setCurrentAccount(currentAcc);
        }
      }
    };

    // Listen for account selection changes
    const handleAccountSelected = (event: CustomEvent) => {
      console.log('Google Ads account selected:', event.detail);
      const { accountId, accountName } = event.detail;
      
      const selectedAcc = accounts.find(acc => acc.id === accountId);
      if (selectedAcc) {
        setCurrentAccount(selectedAcc);
      } else {
        // Create account object if not found in current accounts
        const newAccount = {
          id: accountId,
          name: accountName,
          email: `${accountName.toLowerCase().replace(/\s+/g, '')}@googleads.com`
        };
        setCurrentAccount(newAccount);
      }
    };

    // Check for existing selected account on mount
    const savedAccountId = localStorage.getItem('selectedGoogleAdsAccount');
    if (savedAccountId && accounts.length === 0) {
      // If we have a saved account but no accounts loaded yet, 
      // try to load from any existing data
      console.log('Checking for existing Google Ads connection...');
    }

    window.addEventListener('google-ads-accounts-loaded', handleAccountsLoaded as EventListener);
    window.addEventListener('google-ads-account-selected', handleAccountSelected as EventListener);

    return () => {
      window.removeEventListener('google-ads-accounts-loaded', handleAccountsLoaded as EventListener);
      window.removeEventListener('google-ads-account-selected', handleAccountSelected as EventListener);
    };
  }, [accounts]);

  const switchAccount = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setCurrentAccount(account);
      localStorage.setItem('selectedGoogleAdsAccount', accountId);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('google-ads-account-selected', { 
        detail: { accountId, accountName: account.name } 
      }));
      
      return true;
    }
    return false;
  };

  return {
    accounts,
    currentAccount,
    switchAccount,
    setCurrentAccount,
  };
}
