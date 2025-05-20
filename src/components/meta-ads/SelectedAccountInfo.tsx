
import { MetaAdsAccount } from './types';

interface SelectedAccountInfoProps {
  selectedAccount: MetaAdsAccount | null;
}

const SelectedAccountInfo = ({ selectedAccount }: SelectedAccountInfoProps) => {
  if (!selectedAccount) return null;

  return (
    <div className="mb-4 bg-primary/10 p-3 rounded-md">
      <p className="text-sm font-medium">Current Selection:</p>
      <h4 className="text-lg font-bold">{selectedAccount.name}</h4>
      <p className="text-xs text-muted-foreground">ID: {selectedAccount.id}</p>
    </div>
  );
};

export default SelectedAccountInfo;
