
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Keyword {
  keyword: string;
  landingUrl?: string;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  position: number;
  change: string;
}

interface KeywordTableProps {
  keywords: Keyword[];
}

type SortField = 'keyword' | 'position' | 'change' | 'impressions';
type SortDirection = 'asc' | 'desc' | null;

const KeywordTable = ({ keywords }: KeywordTableProps) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedKeywords = () => {
    if (!sortField || !sortDirection) {
      return keywords;
    }

    return [...keywords].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'keyword':
          aValue = a.keyword.toLowerCase();
          bValue = b.keyword.toLowerCase();
          break;
        case 'position':
          aValue = a.position;
          bValue = b.position;
          break;
        case 'change':
          aValue = parseInt(a.change.replace(/[^-\d]/g, '')) || 0;
          bValue = parseInt(b.change.replace(/[^-\d]/g, '')) || 0;
          break;
        case 'impressions':
          aValue = a.impressions || 0;
          bValue = b.impressions || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field;
    const direction = isActive ? sortDirection : null;

    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => handleSort(field)}
      >
        <span className="flex items-center gap-1">
          {children}
          {direction === 'asc' ? (
            <ArrowUp className="h-3 w-3" />
          ) : direction === 'desc' ? (
            <ArrowDown className="h-3 w-3" />
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-50" />
          )}
        </span>
      </Button>
    );
  };

  const sortedKeywords = getSortedKeywords();

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Top Ranking Keywords</h3>
        <p className="text-sm text-muted-foreground">Data from SERP API analysis</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4">
                <SortButton field="keyword">Keyword</SortButton>
              </th>
              <th className="text-left py-3 px-4">Landing URL</th>
              <th className="text-center py-3 px-4">
                <SortButton field="position">Position</SortButton>
              </th>
              <th className="text-center py-3 px-4">
                <SortButton field="change">Change</SortButton>
              </th>
              <th className="text-center py-3 px-4">
                <SortButton field="impressions">Search Volume</SortButton>
              </th>
              <th className="text-right py-3 px-4">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {sortedKeywords.map((keyword, index) => (
              <tr key={index} className="border-b hover:bg-muted/20">
                <td className="py-3 px-4">{keyword.keyword}</td>
                <td className="py-3 px-4">
                  <a 
                    href={keyword.landingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 truncate block max-w-xs"
                    title={keyword.landingUrl}
                  >
                    {keyword.landingUrl ? keyword.landingUrl.replace(/^https?:\/\//, '') : 'N/A'}
                  </a>
                </td>
                <td className="py-3 px-4 text-center">{keyword.position}</td>
                <td className="py-3 px-4 text-center">
                  <span className={cn(
                    "font-medium",
                    keyword.change.startsWith("+") ? "text-green-500" : "text-red-500"
                  )}>
                    {keyword.change}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">{keyword.impressions?.toLocaleString()}</td>
                <td className="py-3 px-4 text-right">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    keyword.position <= 3 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {keyword.position <= 3 ? "High" : "Medium"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordTable;
