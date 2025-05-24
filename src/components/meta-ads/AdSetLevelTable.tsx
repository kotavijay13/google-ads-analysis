
import { useState } from 'react';
import MetaTableRenderer from './MetaTableRenderer';
import { MetaAdsAccount } from './types';
import { adSetColumns } from './tableUtils';

interface AdSetLevelTableProps {
  accounts: MetaAdsAccount[];
  selectedAccount: MetaAdsAccount | null;
  onSelectAccount: (accountId: string) => void;
}

const AdSetLevelTable = ({ accounts, selectedAccount, onSelectAccount }: AdSetLevelTableProps) => {
  const [visibleColumns, setVisibleColumns] = useState([
    'selected', 'adSetId', 'adSetName', 'delivery', 'optimizationGoal', 'budget', 'impressions', 'clicks', 'ctr', 'conversions', 'aiInsights'
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
      title="Ad Set Level Data"
      columns={adSetColumns}
      visibleColumns={visibleColumns}
      accounts={accounts}
      selectedAccount={selectedAccount}
      onSelectAccount={onSelectAccount}
      onColumnToggle={toggleColumn}
      keyPrefix="adset"
    />
  );
};

export default AdSetLevelTable;
