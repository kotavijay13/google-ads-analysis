
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
import { Search, ExternalLink, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const CompetitionAnalysis = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  // Mock keyword data
  const competitorKeywords = [
    { 
      keyword: "digital marketing agency", 
      position: 3, 
      searchVolume: 5400,
      competitorUrl: "/services/digital-marketing",
      change: 2
    },
    { 
      keyword: "social media services", 
      position: 5, 
      searchVolume: 3200,
      competitorUrl: "/services/social-media",
      change: -1
    },
    { 
      keyword: "ppc management", 
      position: 2, 
      searchVolume: 2800,
      competitorUrl: "/services/ppc",
      change: 0
    },
    { 
      keyword: "seo consultant", 
      position: 8, 
      searchVolume: 1900,
      competitorUrl: "/services/seo",
      change: 1
    },
    { 
      keyword: "content marketing strategy", 
      position: 4, 
      searchVolume: 1600,
      competitorUrl: "/blog/content-marketing-strategy",
      change: -2
    },
    { 
      keyword: "facebook ads agency", 
      position: 6, 
      searchVolume: 2200,
      competitorUrl: "/services/facebook-ads",
      change: 3
    },
    { 
      keyword: "local seo services", 
      position: 7, 
      searchVolume: 1800,
      competitorUrl: "/services/local-seo",
      change: 0
    },
  ];
  
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
  }, []);

  const analyzeCompetitor = () => {
    if (!websiteUrl) return;
    
    setIsLoading(true);
    // Simulate API call
    toast.info(`Analyzing competitor website: ${websiteUrl}`);
    
    setTimeout(() => {
      setIsLoading(false);
      setHasAnalyzed(true);
      toast.success("Competitor analysis complete!");
    }, 2000);
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
              {isLoading ? "Analyzing..." : "Analyze"}
              {!isLoading && <Search className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasAnalyzed && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">147</div>
                <p className="text-xs text-muted-foreground">Ranking in top 100</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top 10 Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">High visibility terms</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14.2</div>
                <p className="text-xs text-muted-foreground">Across all keywords</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Est. Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32,450</div>
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
                  {competitorKeywords.map((keyword) => (
                    <TableRow key={keyword.keyword}>
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
            </CardContent>
            <CardFooter className="flex justify-center border-t p-4">
              <Button variant="outline">Load more keywords</Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default CompetitionAnalysis;
