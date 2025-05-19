
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Search, ExternalLink, ArrowUpRight, ArrowDownRight, Minus, Loader2 } from 'lucide-react';
import { useSupabaseClient } from '@supabase/supabase-js';

// Define the keyword data type
interface KeywordData {
  keyword: string;
  position: number;
  searchVolume: number;
  competitorUrl: string;
  change: number;
}

interface OverviewStats {
  totalKeywords: number;
  top10Keywords: number;
  avgPosition: string;
  estTraffic: number;
}

const CompetitionAnalysis = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [competitorKeywords, setCompetitorKeywords] = useState<KeywordData[]>([]);
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    totalKeywords: 0,
    top10Keywords: 0,
    avgPosition: '0.0',
    estTraffic: 0
  });
  
  const supabase = useSupabaseClient();
  
  const handleRefresh = () => {
    if (websiteUrl) {
      analyzeCompetitor();
    } else {
      toast.error("Please enter a competitor website URL");
    }
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
    
    // Re-analyze if we already have a website
    if (hasAnalyzed && websiteUrl) {
      analyzeCompetitor();
    }
  }, [hasAnalyzed, websiteUrl]);

  const analyzeCompetitor = async () => {
    if (!websiteUrl) return;
    
    setIsLoading(true);
    toast.info(`Analyzing competitor website: ${websiteUrl}`);
    
    try {
      const { data, error } = await supabase.functions.invoke('serp-api', {
        body: { websiteUrl }
      });
      
      if (error) {
        console.error('Error fetching SERP data:', error);
        toast.error(`Error: ${error.message || 'Failed to analyze competitor'}`);
        return;
      }
      
      if (data.error) {
        console.error('SERP API error:', data.error);
        toast.error(`Error: ${data.error}`);
        return;
      }
      
      // Update state with the API response data
      setCompetitorKeywords(data.keywords || []);
      setOverviewStats(data.stats || {
        totalKeywords: 0,
        top10Keywords: 0,
        avgPosition: '0.0',
        estTraffic: 0
      });
      setHasAnalyzed(true);
      toast.success("Competitor analysis complete!");
      
    } catch (error) {
      console.error('Exception during analysis:', error);
      toast.error("Failed to analyze competitor. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Competition Analysis" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Competitor Website Analysis</h2>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analyze Competitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Enter competitor website URL (e.g., example.com)" 
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={analyzeCompetitor} 
              disabled={!websiteUrl || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze
                  <Search className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && !hasAnalyzed && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="ml-4 text-lg text-muted-foreground">Analyzing competitor data...</p>
        </div>
      )}

      {hasAnalyzed && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalKeywords}</div>
                <p className="text-xs text-muted-foreground">Ranking in top 100</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top 10 Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.top10Keywords}</div>
                <p className="text-xs text-muted-foreground">High visibility terms</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.avgPosition}</div>
                <p className="text-xs text-muted-foreground">Across all keywords</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Est. Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.estTraffic.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Monthly organic visits</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Competitor Keyword Rankings</CardTitle>
              <div className="bg-muted px-3 py-1 rounded-md text-sm">
                Domain: {websiteUrl}
              </div>
            </CardHeader>
            <CardContent>
              {competitorKeywords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead className="text-right">Position</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">Search Volume</TableHead>
                      <TableHead>URL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitorKeywords.map((keyword, index) => (
                      <TableRow key={`${keyword.keyword}-${index}`}>
                        <TableCell className="font-medium">{keyword.keyword}</TableCell>
                        <TableCell className="text-right">{keyword.position}</TableCell>
                        <TableCell className="text-right">
                          {keyword.change > 0 ? (
                            <div className="flex items-center justify-end text-green-600">
                              <ArrowUpRight size={16} className="mr-1" />
                              {keyword.change}
                            </div>
                          ) : keyword.change < 0 ? (
                            <div className="flex items-center justify-end text-red-600">
                              <ArrowDownRight size={16} className="mr-1" />
                              {Math.abs(keyword.change)}
                            </div>
                          ) : (
                            <div className="flex items-center justify-end text-gray-500">
                              <Minus size={16} className="mr-1" />
                              0
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{keyword.searchVolume.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="truncate max-w-[200px]">{keyword.competitorUrl}</span>
                            <ExternalLink size={14} className="ml-2 text-muted-foreground" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No keyword data available for this domain
                </div>
              )}
            </CardContent>
            {competitorKeywords.length > 0 && (
              <CardFooter className="flex justify-center border-t p-4">
                <Button variant="outline">Load more keywords</Button>
              </CardFooter>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default CompetitionAnalysis;
