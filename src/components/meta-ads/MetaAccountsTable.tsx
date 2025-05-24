
import { Loader2 } from 'lucide-react';
import { MetaAdsAccount } from './types';
import CampaignLevelTable from './CampaignLevelTable';
import AdSetLevelTable from './AdSetLevelTable';
import AdLevelTable from './AdLevelTable';

interface MetaAccountsTableProps {
  accounts: MetaAdsAccount[];
  selectedAccount: MetaAdsAccount | null;
  loading: boolean;
  onSelectAccount: (accountId: string) => void;
}

const MetaAccountsTable = ({ 
  accounts, 
  selectedAccount, 
  loading, 
  onSelectAccount 
}: MetaAccountsTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  
  if (accounts.length === 0) {
    return (
      <p className="text-center text-muted-foreground my-4">No Meta Ads accounts found</p>
    );
  }

  return (
    <div className="space-y-6">
      <CampaignLevelTable
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={onSelectAccount}
      />
      
      <AdSetLevelTable
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={onSelectAccount}
      />
      
      <AdLevelTable
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={onSelectAccount}
      />
    </div>
  );
};

export default MetaAccountsTable;
