
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { EnhancedAnalysisResponse } from './types';

interface KeywordRankingsTableProps {
  data: EnhancedAnalysisResponse;
  competitorUrl: string;
}

const KeywordRankingsTable = ({ data, competitorUrl }: KeywordRankingsTableProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detailed Keyword Rankings</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{competitorUrl}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {data.keywords.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Keyword</TableHead>
                  <TableHead className="text-right">Position</TableHead>
                  <TableHead className="text-right">Search Volume</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead className="text-right">Est. Visits</TableHead>
                  <TableHead className="text-right">Difficulty</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                  <TableHead className="text-left">URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.keywords.slice(0, 50).map((keyword, index) => (
                  <TableRow key={`${keyword.keyword}-${index}`}>
                    <TableCell className="font-medium text-left">{keyword.keyword}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={keyword.position <= 3 ? 'default' : keyword.position <= 10 ? 'secondary' : 'outline'}>
                        {keyword.position}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{keyword.searchVolume?.toLocaleString() || 0}</TableCell>
                    <TableCell className="text-right">${keyword.cpc?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell className="text-right">{keyword.estimatedVisits?.toLocaleString() || 0}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={`px-2 py-1 text-xs ${
                        keyword.difficulty >= 70 ? "text-red-600 bg-red-50" :
                        keyword.difficulty >= 40 ? "text-amber-600 bg-amber-50" :
                        "text-green-600 bg-green-50"
                      }`}>
                        {keyword.difficulty || 0}/100
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {keyword.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600 mx-auto" />}
                      {keyword.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600 mx-auto" />}
                      {keyword.trend === 'stable' && <div className="h-1 w-4 bg-gray-400 mx-auto rounded" />}
                    </TableCell>
                    <TableCell className="text-left">
                      <a 
                        href={keyword.competitorUrl?.startsWith('http') ? keyword.competitorUrl : `https://${keyword.competitorUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline max-w-xs"
                      >
                        <span className="truncate">{keyword.competitorUrl}</span>
                        <ExternalLink size={14} className="ml-2 flex-shrink-0" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No keyword data available for this domain
          </div>
        )}
      </CardContent>
      {data.keywords.length > 50 && (
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-muted-foreground">
            Showing first 50 of {data.keywords.length} keywords
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default KeywordRankingsTable;
