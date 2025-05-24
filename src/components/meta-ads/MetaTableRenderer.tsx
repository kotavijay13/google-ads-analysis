
import { Check } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColumnSelector from '../ColumnSelector';
import AIInsights from '../AIInsights';
import { MetaAdsAccount } from './types';
import { renderTableCell } from './tableUtils';

interface MetaTableRendererProps {
  title: string;
  columns: { key: string; label: string }[];
  visibleColumns: string[];
  accounts: MetaAdsAccount[];
  selectedAccount: MetaAdsAccount | null;
  onSelectAccount: (accountId: string) => void;
  onColumnToggle: (column: string) => void;
  keyPrefix: string;
}

const MetaTableRenderer = ({
  title,
  columns,
  visibleColumns,
  accounts,
  selectedAccount,
  onSelectAccount,
  onColumnToggle,
  keyPrefix
}: MetaTableRendererProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <ColumnSelector 
          columns={columns.filter(col => col.key !== 'selected')} 
          visibleColumns={visibleColumns} 
          onColumnToggle={onColumnToggle} 
        />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.filter(column => visibleColumns.includes(column.key)).map(column => (
                  <TableHead key={column.key} className="whitespace-nowrap">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow 
                  key={`${keyPrefix}-${account.id}`} 
                  className={selectedAccount?.id === account.id ? "bg-muted/80" : ""}
                  onClick={() => onSelectAccount(account.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {columns.filter(column => visibleColumns.includes(column.key)).map(column => (
                    <TableCell key={column.key} className="whitespace-nowrap">
                      {column.key === 'selected' ? (
                        selectedAccount?.id === account.id && <Check className="h-4 w-4 text-green-500" />
                      ) : column.key === 'aiInsights' ? (
                        <AIInsights data={account} type={keyPrefix as 'campaign' | 'adset' | 'ad'} />
                      ) : (
                        renderTableCell(column.key, account)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaTableRenderer;
