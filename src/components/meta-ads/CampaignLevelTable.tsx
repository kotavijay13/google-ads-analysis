
import { useState } from 'react';
import MetaTableRenderer from './MetaTableRenderer';
import { MetaAdsAccount } from './types';
import { campaignColumns } from './tableUtils';

interface CampaignLevelTableProps {
  accounts: MetaAdsAccount[];
  selectedAccount: MetaAdsAccount | null;
  onSelectAccount: (accountId: string) => void;
}

const CampaignLevelTable = ({ accounts, selectedAccount, onSelectAccount }: CampaignLevelTableProps) => {
  const [visibleColumns, setVisibleColumns] = useState([
    'selected', 'campaignId', 'campaignName', 'status', 'budget', 'amountSpent', 'impressions', 'ctr', 'cpc', 'roas'
  ]);

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey) 
        : [...prev, columnKey]
    );
  };

  return (
    <MetaTableRenderer
      title="Campaign Level Data"
      columns={campaignColumns}
      visibleColumns={visibleColumns}
      accounts={accounts}
      selectedAccount={selectedAccount}
      onSelectAccount={onSelectAccount}
      onColumnToggle={toggleColumn}
      keyPrefix="campaign"
    />
  );
};

export default CampaignLevelTable;
