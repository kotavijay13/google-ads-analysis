import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { 
  Search, 
  ExternalLink, 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Loader,
  Info,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ColumnSelector from '@/components/ColumnSelector';

// Define the keyword data type
interface KeywordData {
  keyword: string;
  position: number;
  searchVolume: number;
  competitorUrl: string;
  change: number;
  estimatedVisits: number;
  difficulty: number;
  difficultyLevel: string;
}

interface OverviewStats {
  totalKeywords: number;
  top10Keywords: number;
  avgPosition: string;
  estTraffic: number;
}

interface AnalysisResponse {
  keywords: KeywordData[];
  stats: OverviewStats;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  column: keyof KeywordData | '';
  direction: SortDirection;
}

const CompetitionAnalysis = () => {
  const [activeTab, setActiveTab] = useState('competitor1');
  const [competitors, setCompetitors] = useState([
    { id: 'competitor1', url: '', data: null, loading: false },
    { id: 'competitor2', url: '', data: null, loading: false },
    { id: 'competitor3', url: '', data: null, loading: false }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [competitorKeywords, setCompetitorKeywords] = useState<KeywordData[]>([]);
  const [displayedKeywords, setDisplayedKeywords] = useState<KeywordData[]>([]);
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    totalKeywords: 0,
    top10Keywords: 0,
    avgPosition: '0.0',
    estTraffic: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [sortState, setSortState] = useState<SortState>({ column: '', direction: null });
  const [itemsToShow, setItemsToShow] = useState(10);
  
  // Define available columns and their visibility state
  const allColumns = [
    { key: 'keyword', label: 'Keyword' },
    { key: 'position', label: 'Position' },
    { key: 'change', label: 'Change' },
    { key: 'searchVolume', label: 'Search Volume' },
    { key: 'estimatedVisits', label: 'Est. Visits' },
    { key: 'difficulty', label: 'SEO Difficulty' },
    { key: 'competitorUrl', label: 'URL' }
  ];
  
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'keyword', 'position', 'change', 'searchVolume', 'estimatedVisits', 'difficulty', 'competitorUrl'
  ]);
  
  // Filter state
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };
  
  const handleSortChange = (column: keyof KeywordData) => {
    setSortState(prev => {
      if (prev.column === column) {
        // Cycle through: asc -> desc -> null
        if (prev.direction === 'asc') return { column, direction: 'desc' };
        if (prev.direction === 'desc') return { column: '', direction: null };
      }
      // Default start with ascending
      return { column, direction: 'asc' };
    });
  };
  
  const getSortIcon = (column: keyof KeywordData) => {
    if (sortState.column !== column) return null;
    return sortState.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />;
  };
  
  const handleRefresh = () => {
    if (websiteUrl) {
      analyzeCompetitor();
    } else {
      toast.error("Please enter a competitor website URL");
    }
  };
  
  const loadMore = () => {
    setItemsToShow(prev => prev + 10);
  };
  
  const applyFilter = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };
  
  const resetFilter = (column: string) => {
    setFilters(prev => {
      const newFilters = {...prev};
      delete newFilters[column];
      return newFilters;
    });
  };
  
  // Apply sorting and filtering
  useEffect(() => {
    let result = [...competitorKeywords];
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        const columnKey = column as keyof KeywordData;
        result = result.filter(item => {
          const itemValue = String(item[columnKey]).toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (sortState.column && sortState.direction) {
      const column = sortState.column;
      const direction = sortState.direction;
      
      result.sort((a, b) => {
        if (typeof a[column] === 'string' && typeof b[column] === 'string') {
          return direction === 'asc' 
            ? (a[column] as string).localeCompare(b[column] as string)
            : (b[column] as string).localeCompare(a[column] as string);
        }
        
        // For numeric values
        return direction === 'asc' 
          ? (a[column] as number) - (b[column] as number)
          : (b[column] as number) - (a[column] as number);
      });
    }
    
    setDisplayedKeywords(result);
  }, [competitorKeywords, sortState, filters]);

  const analyzeCompetitor = async (competitorId: string) => {
    const competitor = competitors.find(c => c.id === competitorId);
    if (!competitor?.url) {
      toast.error("Please enter a competitor website URL");
      return;
    }
    
    setCompetitors(prev => prev.map(c => 
      c.id === competitorId ? { ...c, loading: true } : c
    ));
    
    toast.info(`Analyzing competitor website: ${competitor.url}`);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('serp-api', {
        body: { websiteUrl: competitor.url }
      });
      
      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        toast.error(`Error: ${supabaseError.message || 'Failed to analyze competitor'}`);
        return;
      }
      
      if (data.error) {
        console.error('SERP API error:', data.error);
        toast.error(data.error);
        return;
      }
      
      // Limit to 1000 keywords as requested
      const limitedKeywords = (data.keywords || []).slice(0, 1000);
      
      setCompetitors(prev => prev.map(c => 
        c.id === competitorId ? {
          ...c,
          data: {
            keywords: limitedKeywords,
            stats: {
              ...data.stats,
              totalKeywords: limitedKeywords.length
            }
          },
          loading: false
        } : c
      ));
      
      toast.success(`Analysis complete! Found ${limitedKeywords.length} keywords`);
      
    } catch (error: any) {
      console.error('Exception during analysis:', error);
      toast.error("Failed to analyze competitor. Please try again later.");
      setCompetitors(prev => prev.map(c => 
        c.id === competitorId ? { ...c, loading: false } : c
      ));
    }
  };

  const updateCompetitorUrl = (competitorId: string, url: string) => {
    setCompetitors(prev => prev.map(c => 
      c.id === competitorId ? { ...c, url } : c
    ));
  };

  const clearCompetitor = (competitorId: string) => {
    setCompetitors(prev => prev.map(c => 
      c.id === competitorId ? { ...c, url: '', data: null } : c
    ));
  };

  const currentCompetitor = competitors.find(c => c.id === activeTab);
  const competitorKeywords = currentCompetitor?.data?.keywords || [];
  const overviewStats = currentCompetitor?.data?.stats || {
    totalKeywords: 0,
    top10Keywords: 0,
    avgPosition: '0.0',
    estTraffic: 0
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={() => {}} title="Competition Analysis" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Competitor Website Analysis</h2>
      </div>

      <Tabs defaultValue="competitor1" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="competitor1" className="relative">
            Competitor 1
            {competitors[0].url && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-1 -right-1 h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  clearCompetitor('competitor1');
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </TabsTrigger>
          <TabsTrigger value="competitor2" className="relative">
            Competitor 2
            {competitors[1].url && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-1 -right-1 h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  clearCompetitor('competitor2');
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </TabsTrigger>
          <TabsTrigger value="competitor3" className="relative">
            Competitor 3
            {competitors[2].url && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-1 -right-1 h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  clearCompetitor('competitor3');
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </TabsTrigger>
        </TabsList>

        {competitors.map((competitor) => (
          <TabsContent key={competitor.id} value={competitor.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyze {competitor.id === 'competitor1' ? 'First' : competitor.id === 'competitor2' ? 'Second' : 'Third'} Competitor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input 
                      placeholder="Enter competitor website URL (e.g., example.com)" 
                      value={competitor.url}
                      onChange={(e) => updateCompetitorUrl(competitor.id, e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    onClick={() => analyzeCompetitor(competitor.id)} 
                    disabled={!competitor.url || competitor.loading}
                    className="gap-2"
                  >
                    {competitor.loading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
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

            {competitor.data && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overviewStats.totalKeywords}</div>
                      <p className="text-xs text-muted-foreground">Up to 1000 keywords</p>
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
                    <div className="flex items-center gap-2">
                      <div className="bg-muted px-3 py-1 rounded-md text-sm">
                        Domain: {competitor.url}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {competitorKeywords.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-left">Keyword</TableHead>
                              <TableHead className="text-right">Position</TableHead>
                              <TableHead className="text-right">Change</TableHead>
                              <TableHead className="text-right">Search Volume</TableHead>
                              <TableHead className="text-right">Est. Visits</TableHead>
                              <TableHead className="text-right">SEO Difficulty</TableHead>
                              <TableHead className="text-left">URL</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {competitorKeywords.slice(0, 50).map((keyword, index) => (
                              <TableRow key={`${keyword.keyword}-${index}`}>
                                <TableCell className="font-medium text-left">{keyword.keyword}</TableCell>
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
                                  <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(keyword.difficulty || 0)}`}>
                                    {keyword.difficulty || 0}/100
                                  </span>
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
                  {competitorKeywords.length > 50 && (
                    <CardFooter className="flex justify-center border-t p-4">
                      <p className="text-sm text-muted-foreground">
                        Showing first 50 of {competitorKeywords.length} keywords
                      </p>
                    </CardFooter>
                  )}
                </Card>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CompetitionAnalysis;
