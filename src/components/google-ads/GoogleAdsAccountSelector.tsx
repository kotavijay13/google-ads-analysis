
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { GoogleAdsAccount } from './types';

interface GoogleAdsAccountSelectorProps {
  accounts: GoogleAdsAccount[];
  selectedAccount: string | null;
  onSelectAccount: (accountId: string) => void;
}

const GoogleAdsAccountSelector = ({ accounts, selectedAccount, onSelectAccount }: GoogleAdsAccountSelectorProps) => {
  if (accounts.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Select Google Ads Account</h3>
      <Select 
        value={selectedAccount || undefined}
        onValueChange={onSelectAccount}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name} ({account.id})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedAccount && (
        <div className="mt-4 bg-primary/10 p-3 rounded-md">
          <p className="text-sm font-medium">Current Selection:</p>
          <h4 className="text-lg font-bold">
            {accounts.find(a => a.id === selectedAccount)?.name}
          </h4>
          <p className="text-xs text-muted-foreground">ID: {selectedAccount}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleAdsAccountSelector;
