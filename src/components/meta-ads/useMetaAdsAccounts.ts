
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { MetaAdsAccount } from './types';

export const useMetaAdsAccounts = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<MetaAdsAccount[]>([]);
  const [connected, setConnected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<MetaAdsAccount | null>(null);

  useEffect(() => {
    if (user) {
      checkConnection();
      fetchAccounts();
    }
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('api_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'meta')
      .single();
    
    if (data) {
      setConnected(true);
    }
  };

  const fetchAccounts = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', 'meta');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const accountsData = data.map(account => ({
          id: account.account_id,
          name: account.account_name || account.account_id
        }));
        
        setAccounts(accountsData);
        
        // If there's a previously selected account in localStorage, use that
        const savedAccountId = localStorage.getItem('selectedMetaAccount');
        if (savedAccountId && accountsData.length > 0) {
          const savedAccount = accountsData.find(acc => acc.id === savedAccountId);
          if (savedAccount) {
            setSelectedAccount(savedAccount);
          } else {
            // If saved account not found, use the first account
            setSelectedAccount(accountsData[0]);
            localStorage.setItem('selectedMetaAccount', accountsData[0].id);
          }
        } else if (accountsData.length > 0) {
          // If no saved account, default to first
          setSelectedAccount(accountsData[0]);
          localStorage.setItem('selectedMetaAccount', accountsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching Meta Ads accounts:', error);
      toast.error('Failed to fetch Meta Ads accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setSelectedAccount(account);
      localStorage.setItem('selectedMetaAccount', account.id);
      toast.success(`Meta Ads account "${account.name}" selected`);
    }
  };

  return {
    loading,
    accounts,
    connected,
    selectedAccount,
    checkConnection,
    fetchAccounts,
    handleSelectAccount
  };
};
