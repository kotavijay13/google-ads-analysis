
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, RefreshCw } from 'lucide-react';
import { GoogleAdsAccount } from './types';

interface GoogleAdsAccountsTableProps {
  accounts: GoogleAdsAccount[];
  selectedAccount: string | null;
  onSelectAccount: (accountId: string) => void;
  onRefreshAccounts: () => void;
}

const GoogleAdsAccountsTable = ({ 
  accounts, 
  selectedAccount, 
  onSelectAccount, 
  onRefreshAccounts 
}: GoogleAdsAccountsTableProps) => {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No Google Ads accounts found</p>
        <p className="text-sm text-muted-foreground">
          Make sure you have access to Google Ads accounts with the email you used to sign in.
        </p>
        <Button 
          onClick={onRefreshAccounts} 
          className="mt-4"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Accounts
        </Button>
      </div>
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
            className={selectedAccount === account.id ? "bg-muted/80" : ""}
            onClick={() => onSelectAccount(account.id)}
            style={{ cursor: 'pointer' }}
          >
            <TableCell>
              {selectedAccount === account.id && (
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

export default GoogleAdsAccountsTable;
