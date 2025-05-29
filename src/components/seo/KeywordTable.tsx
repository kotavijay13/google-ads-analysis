
import { cn } from '@/lib/utils';

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

const KeywordTable = ({ keywords }: KeywordTableProps) => {
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
              <th className="text-left py-3 px-4">Keyword</th>
              <th className="text-left py-3 px-4">Landing URL</th>
              <th className="text-center py-3 px-4">Position</th>
              <th className="text-center py-3 px-4">Change</th>
              <th className="text-center py-3 px-4">Search Volume</th>
              <th className="text-right py-3 px-4">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((keyword, index) => (
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
