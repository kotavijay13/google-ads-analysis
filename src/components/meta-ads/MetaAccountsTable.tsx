
import { Check, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MetaAdsAccount } from './types';

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Selected</TableHead>
          <TableHead>Account ID</TableHead>
          <TableHead>Account Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account) => (
          <TableRow 
            key={account.id} 
            className={selectedAccount?.id === account.id ? "bg-muted/80" : ""}
            onClick={() => onSelectAccount(account.id)}
            style={{ cursor: 'pointer' }}
          >
            <TableCell>
              {selectedAccount?.id === account.id && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </TableCell>
            <TableCell>{account.id}</TableCell>
            <TableCell>{account.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MetaAccountsTable;
