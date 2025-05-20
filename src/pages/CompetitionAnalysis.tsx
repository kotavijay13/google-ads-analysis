
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
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
import { toast } from "@/components/sonner";
import { 
  Search, 
  ExternalLink, 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Loader,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ColumnSelector from '@/components/ColumnSelector';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const analyzeCompetitor = async () => {
    if (!websiteUrl) return;
    
    setIsLoading(true);
    setError(null);
    toast.info(`Analyzing competitor website: ${websiteUrl}`);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('serp-api', {
        body: { websiteUrl }
      });
      
      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        setError(`Error: ${supabaseError.message || 'Failed to analyze competitor'}`);
        toast.error(`Error: ${supabaseError.message || 'Failed to analyze competitor'}`);
        setHasAnalyzed(false);
        return;
      }
      
      if (data.error) {
        console.error('SERP API error:', data.error);
        setError(data.error);
        toast.error(data.error);
        setHasAnalyzed(false);
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
      setItemsToShow(10); // Reset to show first 10 items
      toast.success("Competitor analysis complete!");
      
    } catch (error: any) {
      console.error('Exception during analysis:', error);
      setError(`Failed to analyze competitor: ${error.message || 'Unknown error'}`);
      toast.error("Failed to analyze competitor. Please try again later.");
      setHasAnalyzed(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get difficulty color
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return "text-red-600 bg-red-50";
    if (difficulty >= 40) return "text-amber-600 bg-amber-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Competition Analysis" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Competitor Website Analysis</h2>
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

      {isLoading && !hasAnalyzed && (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="ml-4 text-lg text-muted-foreground">Analyzing competitor data...</p>
        </div>
      )}
      
      {error && (
        <Card className="mb-6 border-red-200">
          <CardHeader className="pb-2 text-red-600">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Analysis Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="text-sm mt-2 text-muted-foreground">
              Please check that your SERP API key is correctly configured and try again.
            </p>
          </CardContent>
        </Card>
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
              <div className="flex items-center gap-2">
                <div className="bg-muted px-3 py-1 rounded-md text-sm">
                  Domain: {websiteUrl}
                </div>
                <ColumnSelector 
                  columns={allColumns}
                  visibleColumns={visibleColumns}
                  onColumnToggle={toggleColumnVisibility}
                />
              </div>
            </CardHeader>
            <CardContent>
              {displayedKeywords.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {visibleColumns.includes('keyword') && (
                          <TableHead>
                            <div className="flex items-center cursor-pointer" onClick={() => handleSortChange('keyword')}>
                              Keyword
                              {getSortIcon('keyword')}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 p-0">
                                    <Filter className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-60">
                                  <div className="p-2">
                                    <Input 
                                      placeholder="Filter keywords..." 
                                      value={filters.keyword || ''}
                                      onChange={(e) => applyFilter('keyword', e.target.value)}
                                      className="mb-2"
                                    />
                                    <div className="flex justify-between">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => resetFilter('keyword')}
                                      >
                                        Clear
                                      </Button>
                                    </div>
                                  </div>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.includes('position') && (
                          <TableHead className="text-right">
                            <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSortChange('position')}>
                              Position
                              {getSortIcon('position')}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 p-0">
                                    <Filter className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-60">
                                  <div className="p-2">
                                    <Input 
                                      placeholder="Filter by position..." 
                                      value={filters.position || ''}
                                      onChange={(e) => applyFilter('position', e.target.value)}
                                      className="mb-2"
                                    />
                                    <div className="flex justify-between">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => resetFilter('position')}
                                      >
                                        Clear
                                      </Button>
                                    </div>
                                  </div>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.includes('change') && (
                          <TableHead className="text-right">
                            <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSortChange('change')}>
                              Change
                              {getSortIcon('change')}
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.includes('searchVolume') && (
                          <TableHead className="text-right">
                            <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSortChange('searchVolume')}>
                              Search Volume
                              {getSortIcon('searchVolume')}
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.includes('estimatedVisits') && (
                          <TableHead className="text-right">
                            <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSortChange('estimatedVisits')}>
                              Est. Visits
                              {getSortIcon('estimatedVisits')}
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.includes('difficulty') && (
                          <TableHead className="text-right">
                            <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSortChange('difficulty')}>
                              SEO Difficulty
                              {getSortIcon('difficulty')}
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.includes('competitorUrl') && (
                          <TableHead>
                            <div className="flex items-center cursor-pointer" onClick={() => handleSortChange('competitorUrl')}>
                              URL
                              {getSortIcon('competitorUrl')}
                            </div>
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedKeywords.slice(0, itemsToShow).map((keyword, index) => (
                        <TableRow key={`${keyword.keyword}-${index}`}>
                          {visibleColumns.includes('keyword') && (
                            <TableCell className="font-medium">{keyword.keyword}</TableCell>
                          )}
                          
                          {visibleColumns.includes('position') && (
                            <TableCell className="text-right">{keyword.position}</TableCell>
                          )}
                          
                          {visibleColumns.includes('change') && (
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
                          )}
                          
                          {visibleColumns.includes('searchVolume') && (
                            <TableCell className="text-right">{keyword.searchVolume.toLocaleString()}</TableCell>
                          )}
                          
                          {visibleColumns.includes('estimatedVisits') && (
                            <TableCell className="text-right">{keyword.estimatedVisits.toLocaleString()}</TableCell>
                          )}
                          
                          {visibleColumns.includes('difficulty') && (
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(keyword.difficulty)}`}>
                                      {keyword.difficulty}/100
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p>Difficulty: {keyword.difficultyLevel}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          )}
                          
                          {visibleColumns.includes('competitorUrl') && (
                            <TableCell>
                              <a 
                                href={keyword.competitorUrl.startsWith('http') ? keyword.competitorUrl : `https://${keyword.competitorUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <span className="truncate max-w-[200px]">{keyword.competitorUrl}</span>
                                <ExternalLink size={14} className="ml-2" />
                              </a>
                            </TableCell>
                          )}
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
            {displayedKeywords.length > 0 && itemsToShow < displayedKeywords.length && (
              <CardFooter className="flex justify-center border-t p-4">
                <Button variant="outline" onClick={loadMore}>
                  Load more keywords ({itemsToShow} of {displayedKeywords.length})
                </Button>
              </CardFooter>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default CompetitionAnalysis;
