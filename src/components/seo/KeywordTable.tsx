
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ExternalLink, ArrowUpDown } from 'lucide-react';

interface KeywordTableProps {
  keywords: any[];
  selectedWebsite: string;
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'keyword' | 'position' | 'change' | 'impressions' | 'estimatedVisits' | 'difficulty';

const KeywordTable = ({ keywords, selectedWebsite }: KeywordTableProps) => {
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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
    }
    
    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-1 h-3 w-3" />;
    } else if (sortDirection === 'desc') {
      return <ArrowDown className="ml-1 h-3 w-3" />;
    }
    
    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
  };

  const sortedKeywords = [...keywords].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // For numeric values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return "text-red-600 bg-red-50";
    if (difficulty >= 40) return "text-amber-600 bg-amber-50";
    return "text-green-600 bg-green-50";
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent text-left justify-start"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center">
        {children}
        {getSortIcon(field)}
      </span>
    </Button>
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">
              <SortableHeader field="keyword">Keyword</SortableHeader>
            </TableHead>
            <TableHead className="text-left">Landing URL</TableHead>
            <TableHead className="text-right">
              <SortableHeader field="position">Position</SortableHeader>
            </TableHead>
            <TableHead className="text-right">
              <SortableHeader field="change">Change</SortableHeader>
            </TableHead>
            <TableHead className="text-right">
              <SortableHeader field="impressions">Impressions</SortableHeader>
            </TableHead>
            <TableHead className="text-right">
              <SortableHeader field="estimatedVisits">Est. Visits</SortableHeader>
            </TableHead>
            <TableHead className="text-right">
              <SortableHeader field="difficulty">Difficulty</SortableHeader>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedKeywords.map((keyword, index) => (
            <TableRow key={`${keyword.keyword}-${index}`}>
              <TableCell className="font-medium text-left">{keyword.keyword}</TableCell>
              <TableCell className="text-left">
                <a 
                  href={keyword.landingUrl?.startsWith('http') ? keyword.landingUrl : `https://${keyword.landingUrl || selectedWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 hover:underline max-w-xs"
                >
                  <span className="truncate">{keyword.landingUrl || selectedWebsite}</span>
                  <ExternalLink size={14} className="ml-2 flex-shrink-0" />
                </a>
              </TableCell>
              <TableCell className="text-right">{keyword.position}</TableCell>
              <TableCell className="text-right">
                {keyword.change > 0 ? (
                  <div className="flex items-center justify-end text-green-600">
                    <ArrowUp size={16} className="mr-1" />
                    {keyword.change}
                  </div>
                ) : keyword.change < 0 ? (
                  <div className="flex items-center justify-end text-red-600">
                    <ArrowDown size={16} className="mr-1" />
                    {Math.abs(keyword.change)}
                  </div>
                ) : (
                  <div className="flex items-center justify-end text-gray-500">
                    <span className="mr-1">—</span>
                    0
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">{keyword.impressions?.toLocaleString() || 0}</TableCell>
              <TableCell className="text-right">{keyword.estimatedVisits?.toLocaleString() || 0}</TableCell>
              <TableCell className="text-right">
                <Badge className={`px-2 py-1 text-xs ${getDifficultyColor(keyword.difficulty || 0)}`}>
                  {keyword.difficulty || 0}/100
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default KeywordTable;
