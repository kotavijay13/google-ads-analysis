
import { useState } from 'react';

export interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// Mock data for Google Accounts
const defaultAccounts: GoogleAccount[] = [
  {
    id: '1',
    name: 'Marketing Account',
    email: 'marketing@example.com',
  },
  {
    id: '2',
    name: 'Sales Account',
    email: 'sales@example.com',
  },
  {
    id: '3',
    name: 'Corporate Account',
    email: 'corp@example.com',
  },
];

export function useGoogleAccounts() {
  const [accounts, setAccounts] = useState<GoogleAccount[]>(defaultAccounts);
  const [currentAccount, setCurrentAccount] = useState<GoogleAccount>(accounts[0]);

  const switchAccount = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setCurrentAccount(account);
      return true;
    }
    return false;
  };

  return {
    accounts,
    currentAccount,
    switchAccount,
  };
}
