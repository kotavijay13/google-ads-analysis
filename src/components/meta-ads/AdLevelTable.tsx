
import { useState } from 'react';
import MetaTableRenderer from './MetaTableRenderer';
import { MetaAdsAccount } from './types';
import { adColumns } from './tableUtils';

interface AdLevelTableProps {
  accounts: MetaAdsAccount[];
  selectedAccount: MetaAdsAccount | null;
  onSelectAccount: (accountId: string) => void;
}

const AdLevelTable = ({ accounts, selectedAccount, onSelectAccount }: AdLevelTableProps) => {
  const [visibleColumns, setVisibleColumns] = useState([
    'selected', 'adId', 'adName', 'status', 'format', 'impressions', 'linkClicks', 'ctr', 'cpc', 'roas', 'aiInsights'
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
      title="Ad Level Data"
      columns={adColumns}
      visibleColumns={visibleColumns}
      accounts={accounts}
      selectedAccount={selectedAccount}
      onSelectAccount={onSelectAccount}
      onColumnToggle={toggleColumn}
      keyPrefix="ad"
    />
  );
};

export default AdLevelTable;
