
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceChart from '@/components/PerformanceChart';
import { dailyPerformance } from '@/data/mockData';
import { Link } from 'lucide-react';

// Mock SEO data
const keywordRankings = [
  { keyword: "digital marketing agency", position: 3, change: 2, volume: 5400, difficulty: "High" },
  { keyword: "social media services", position: 5, change: -1, volume: 3200, difficulty: "Medium" },
  { keyword: "ppc management", position: 2, change: 4, volume: 2800, difficulty: "Medium" },
  { keyword: "seo consultant", position: 8, change: 0, volume: 1900, difficulty: "High" },
  { keyword: "content marketing strategy", position: 4, change: 1, volume: 1600, difficulty: "Medium" },
];

// Mock URL meta data
const urlMetaData = [
  { 
    url: "/", 
    title: "Digital Marketing Agency | Services for SMBs | YourCompany", 
    description: "Full-service digital marketing agency specializing in SEO, PPC, social media marketing, and content strategy for small and medium businesses.",
    pageSpeed: { mobile: 76, desktop: 92 },
    wordCount: 1450,
    h1Count: 1,
    imageCount: 8
  },
  { 
    url: "/services", 
    title: "Marketing Services | SEO, PPC, Social Media | YourCompany", 
    description: "Explore our digital marketing services including search engine optimization, paid advertising, social media management, and content creation.",
    pageSpeed: { mobile: 82, desktop: 94 },
    wordCount: 1280,
    h1Count: 1,
    imageCount: 6
  },
  { 
    url: "/blog", 
    title: "Digital Marketing Blog | Industry News & Tips | YourCompany", 
    description: "Stay updated with the latest digital marketing trends, news, and actionable tips for growing your business online.",
    pageSpeed: { mobile: 68, desktop: 88 },
    wordCount: 950,
    h1Count: 1,
    imageCount: 12
  },
  { 
    url: "/case-studies", 
    title: "Case Studies | Client Success Stories | YourCompany", 
    description: "Read our client success stories and learn how our digital marketing strategies have helped businesses achieve their growth goals.",
    pageSpeed: { mobile: 71, desktop: 90 },
    wordCount: 2100,
    h1Count: 1,
    imageCount: 14
  },
  { 
    url: "/contact", 
    title: "Contact Us | Get a Free Consultation | YourCompany", 
    description: "Get in touch with our digital marketing experts for a free consultation. Find our contact details and office locations.",
    pageSpeed: { mobile: 85, desktop: 97 },
    wordCount: 450,
    h1Count: 1,
    imageCount: 3
  },
];

const SEOPage = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Refreshing SEO data...');
    }, 1000);
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  }, []);

  // Initial data fetch when component mounts
  useEffect(() => {
    console.log('Initial SEO data fetch with date range:', dateRange);
  }, []);

  const getSpeedColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="SEO Dashboard" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">SEO Overview</h2>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,238</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Keywords Ranked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">143</div>
            <p className="text-xs text-muted-foreground">+5 new this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4</div>
            <p className="text-xs text-muted-foreground">Improved by 1.2</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,680</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="keywords" className="mt-6">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="meta-data">URL Meta Data</TabsTrigger>
          <TabsTrigger value="performance">Site Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keywords" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Top Ranking Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Position</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">Search Volume</TableHead>
                    <TableHead>Difficulty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywordRankings.map((keyword) => (
                    <TableRow key={keyword.keyword}>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell className="text-right">{keyword.position}</TableCell>
                      <TableCell className="text-right">
                        <span className={
                          keyword.change > 0 
                            ? "text-green-600" 
                            : keyword.change < 0 
                              ? "text-red-600" 
                              : ""
                        }>
                          {keyword.change > 0 ? `+${keyword.change}` : keyword.change}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{keyword.volume.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={
                          keyword.difficulty === "High" 
                            ? "bg-red-100 text-red-800 px-2 py-1 rounded text-xs" 
                            : "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs"
                        }>
                          {keyword.difficulty}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages by Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { url: "/blog/seo-tips-2023", visits: 1245, bounce: "32%" },
                  { url: "/services/digital-marketing", visits: 876, bounce: "41%" },
                  { url: "/case-studies/ecommerce", visits: 654, bounce: "28%" },
                  { url: "/contact", visits: 432, bounce: "18%" },
                ].map((page, i) => (
                  <div key={i} className="flex justify-between items-start py-2 border-b">
                    <div className="max-w-[60%]">
                      <div className="font-medium truncate">{page.url}</div>
                    </div>
                    <div className="text-right">
                      <div>{page.visits.toLocaleString()} visits</div>
                      <div className="text-sm text-muted-foreground">{page.bounce} bounce rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meta-data" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>URL Meta Data Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Meta Title</TableHead>
                      <TableHead>Meta Description</TableHead>
                      <TableHead className="text-center">Mobile Speed</TableHead>
                      <TableHead className="text-center">Desktop Speed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {urlMetaData.map((page) => (
                      <TableRow key={page.url}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link size={14} />
                            <span className="font-medium">{page.url}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={page.title}>{page.title}</div>
                          <div className="text-xs text-muted-foreground">{page.title.length} chars</div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={page.description}>{page.description}</div>
                          <div className="text-xs text-muted-foreground">{page.description.length} chars</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
                              <div className="absolute inset-0 rounded-full overflow-hidden">
                                <div 
                                  className={`${getSpeedColor(page.pageSpeed.mobile)} h-full`} 
                                  style={{ width: `${page.pageSpeed.mobile}%` }}
                                ></div>
                              </div>
                              <span className="relative text-xs font-medium">{page.pageSpeed.mobile}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
                              <div className="absolute inset-0 rounded-full overflow-hidden">
                                <div 
                                  className={`${getSpeedColor(page.pageSpeed.desktop)} h-full`} 
                                  style={{ width: `${page.pageSpeed.desktop}%` }}
                                ></div>
                              </div>
                              <span className="relative text-xs font-medium">{page.pageSpeed.desktop}</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Speed Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Mobile</span>
                      <span className="font-bold">76/100</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: "76%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Desktop</span>
                      <span className="font-bold">92/100</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Core Web Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Largest Contentful Paint (LCP)</span>
                      <span className="text-green-500 font-medium">2.1s</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: "70%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Good: Under 2.5s</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>First Input Delay (FID)</span>
                      <span className="text-green-500 font-medium">18ms</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: "90%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Good: Under 100ms</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Cumulative Layout Shift (CLS)</span>
                      <span className="text-amber-500 font-medium">0.17</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: "60%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Needs Improvement: 0.1-0.25</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOPage;
