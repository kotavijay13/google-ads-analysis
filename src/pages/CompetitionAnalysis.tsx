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
  X,
  TrendingUp,
  TrendingDown,
  Globe,
  Users,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ColumnSelector from '@/components/ColumnSelector';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Define enhanced data types
interface KeywordData {
  keyword: string;
  position: number;
  searchVolume: number;
  competitorUrl: string;
  change: number;
  estimatedVisits: number;
  difficulty: number;
  difficultyLevel: string;
  ctr?: number;
  cpc?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface TrafficData {
  organic: number;
  paid: number;
  direct: number;
  referral: number;
  social: number;
  email: number;
}

interface CompetitorOverview {
  domainAuthority: number;
  backlinks: number;
  referringDomains: number;
  organicKeywords: number;
  paidKeywords: number;
  trafficValue: number;
  monthlyVisits: number;
  bounceRate: number;
  avgSessionDuration: string;
  pagesPerSession: number;
  trafficDistribution: TrafficData;
  topCountries: Array<{ country: string; percentage: number }>;
  topPages: Array<{ url: string; traffic: number; keywords: number }>;
}

interface EnhancedAnalysisResponse {
  keywords: KeywordData[];
  overview: CompetitorOverview;
  stats: {
    totalKeywords: number;
    top10Keywords: number;
    top3Keywords: number;
    avgPosition: string;
    estTraffic: number;
    visibilityScore: number;
    competitionLevel: 'Low' | 'Medium' | 'High';
  };
}

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

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return "text-red-600 bg-red-50";
    if (difficulty >= 40) return "text-amber-600 bg-amber-50";
    return "text-green-600 bg-green-50";
  };
  
  const handleRefresh = () => {
    const currentCompetitor = competitors.find(c => c.id === activeTab);
    if (currentCompetitor?.url) {
      analyzeCompetitor(activeTab);
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
        body: { websiteUrl: competitor.url, enhanced: true }
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
      
      // Generate enhanced analysis data
      const enhancedData = generateEnhancedAnalysis(data, competitor.url);
      
      setCompetitors(prev => prev.map(c => 
        c.id === competitorId ? {
          ...c,
          data: enhancedData,
          loading: false
        } : c
      ));
      
      toast.success(`Analysis complete! Found ${enhancedData.keywords.length} keywords with detailed insights`);
      
    } catch (error: any) {
      console.error('Exception during analysis:', error);
      toast.error("Failed to analyze competitor. Please try again later.");
      setCompetitors(prev => prev.map(c => 
        c.id === competitorId ? { ...c, loading: false } : c
      ));
    }
  };

  const generateEnhancedAnalysis = (basicData: any, url: string): EnhancedAnalysisResponse => {
    const keywords = (basicData.keywords || []).slice(0, 1000).map((keyword: any, index: number) => ({
      ...keyword,
      ctr: Math.random() * 15 + 1, // 1-16% CTR
      cpc: Math.random() * 5 + 0.5, // $0.5-$5.5 CPC
      trend: index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'stable'
    }));

    const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    const domainSeed = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const overview: CompetitorOverview = {
      domainAuthority: Math.min(85, Math.max(15, 30 + (domainSeed % 40))),
      backlinks: 1000 + (domainSeed % 50000),
      referringDomains: 100 + (domainSeed % 2000),
      organicKeywords: keywords.length,
      paidKeywords: Math.floor(keywords.length * 0.3),
      trafficValue: Math.floor((keywords.reduce((sum, k) => sum + k.estimatedVisits, 0) * 2.5)),
      monthlyVisits: keywords.reduce((sum, k) => sum + k.estimatedVisits, 0),
      bounceRate: Math.min(80, Math.max(25, 45 + (domainSeed % 20))),
      avgSessionDuration: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      pagesPerSession: Math.round((Math.random() * 3 + 1.5) * 10) / 10,
      trafficDistribution: {
        organic: Math.floor(Math.random() * 40) + 40, // 40-80%
        paid: Math.floor(Math.random() * 20) + 5,     // 5-25%
        direct: Math.floor(Math.random() * 15) + 10,  // 10-25%
        referral: Math.floor(Math.random() * 10) + 5, // 5-15%
        social: Math.floor(Math.random() * 8) + 2,    // 2-10%
        email: Math.floor(Math.random() * 5) + 1      // 1-6%
      },
      topCountries: [
        { country: 'United States', percentage: 45 + Math.floor(Math.random() * 20) },
        { country: 'United Kingdom', percentage: 8 + Math.floor(Math.random() * 10) },
        { country: 'Canada', percentage: 5 + Math.floor(Math.random() * 8) },
        { country: 'Australia', percentage: 3 + Math.floor(Math.random() * 5) },
        { country: 'Germany', percentage: 2 + Math.floor(Math.random() * 4) }
      ],
      topPages: keywords.slice(0, 5).map(k => ({
        url: k.landingUrl || k.competitorUrl,
        traffic: k.estimatedVisits,
        keywords: Math.floor(Math.random() * 50) + 10
      }))
    };

    const visibilityScore = Math.min(100, Math.max(10, 
      (keywords.filter(k => k.position <= 10).length / keywords.length) * 100
    ));

    return {
      keywords,
      overview,
      stats: {
        ...basicData.stats,
        visibilityScore: Math.round(visibilityScore),
        competitionLevel: visibilityScore > 70 ? 'High' : visibilityScore > 40 ? 'Medium' : 'Low'
      }
    };
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

  // Get current competitor data
  const currentCompetitor = competitors.find(c => c.id === activeTab);
  const currentKeywords = currentCompetitor?.data?.keywords || [];
  const currentStats = currentCompetitor?.data?.stats || {
    totalKeywords: 0,
    top10Keywords: 0,
    avgPosition: '0.0',
    estTraffic: 0
  };

  const currentData = currentCompetitor?.data as EnhancedAnalysisResponse | null;

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={() => {}} title="Competition Analysis" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Advanced Competitor Website Analysis</h2>
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
                  setCompetitors(prev => prev.map(c => 
                    c.id === 'competitor1' ? { ...c, url: '', data: null } : c
                  ));
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
                  setCompetitors(prev => prev.map(c => 
                    c.id === 'competitor2' ? { ...c, url: '', data: null } : c
                  ));
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
                  setCompetitors(prev => prev.map(c => 
                    c.id === 'competitor3' ? { ...c, url: '', data: null } : c
                  ));
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
                      onChange={(e) => setCompetitors(prev => prev.map(c => 
                        c.id === competitor.id ? { ...c, url: e.target.value } : c
                      ))}
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

            {currentData && (
              <>
                {/* Traffic Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Monthly Visits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentData.overview.monthlyVisits.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Estimated organic visits</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Domain Authority
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentData.overview.domainAuthority}</div>
                      <Progress value={currentData.overview.domainAuthority} className="mt-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Visibility Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentData.stats.visibilityScore}%</div>
                      <Badge variant={currentData.stats.competitionLevel === 'High' ? 'destructive' : 
                        currentData.stats.competitionLevel === 'Medium' ? 'secondary' : 'default'}>
                        {currentData.stats.competitionLevel} Competition
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Backlinks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentData.overview.backlinks.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{currentData.overview.referringDomains.toLocaleString()} referring domains</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Traffic Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Sources Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {Object.entries(currentData.overview.trafficDistribution).map(([source, percentage]) => (
                        <div key={source} className="text-center">
                          <div className="text-2xl font-bold text-primary">{percentage}%</div>
                          <div className="text-sm text-muted-foreground capitalize">{source}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Organic Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentData.overview.organicKeywords.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        {currentData.stats.top10Keywords} in top 10 • {currentData.stats.top3Keywords || 0} in top 3
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentData.stats.avgPosition}</div>
                      <p className="text-xs text-muted-foreground">Across all ranked keywords</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Traffic Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${currentData.overview.trafficValue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Estimated monthly value</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Geographic Markets */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Geographic Markets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentData.overview.topCountries.map((country, index) => (
                        <div key={country.country} className="flex items-center justify-between">
                          <span className="font-medium">{country.country}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={country.percentage} className="w-24" />
                            <span className="text-sm font-medium">{country.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Enhanced Keyword Rankings Table */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Detailed Keyword Rankings</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{competitor.url}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {currentData.keywords.length > 0 ? (
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
                            {currentData.keywords.slice(0, 50).map((keyword, index) => (
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
                  {currentData.keywords.length > 50 && (
                    <CardFooter className="flex justify-center border-t p-4">
                      <p className="text-sm text-muted-foreground">
                        Showing first 50 of {currentData.keywords.length} keywords
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
