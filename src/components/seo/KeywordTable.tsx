
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface KeywordTableProps {
  keywords: any[];
  selectedWebsite: string;
}

const KeywordTable = ({ keywords, selectedWebsite }: KeywordTableProps) => {
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return "text-red-600 bg-red-50";
    if (difficulty >= 40) return "text-amber-600 bg-amber-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Keyword</TableHead>
            <TableHead className="text-left">Landing URL</TableHead>
            <TableHead className="text-right">Position</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Search Volume</TableHead>
            <TableHead className="text-right">Est. Visits</TableHead>
            <TableHead className="text-right">Difficulty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((keyword, index) => (
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
              <TableCell className="text-right">{keyword.searchVolume?.toLocaleString() || 0}</TableCell>
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
