
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MetaAdsAccount } from './types';

interface MetaAccountSelectorProps {
  accounts: MetaAdsAccount[];
  selectedAccount: MetaAdsAccount | null;
  onSelectAccount: (accountId: string) => void;
}

const MetaAccountSelector = ({
  accounts,
  selectedAccount,
  onSelectAccount
}: MetaAccountSelectorProps) => {
  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Select Meta Ads Account</h3>
      <Select 
        value={selectedAccount?.id}
        onValueChange={onSelectAccount}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MetaAccountSelector;
