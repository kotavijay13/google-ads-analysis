
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
import PerformanceChart from '@/components/PerformanceChart';
import { dailyPerformance } from '@/data/mockData';

// Mock SEO data
const keywordRankings = [
  { keyword: "digital marketing agency", position: 3, change: 2, volume: 5400, difficulty: "High" },
  { keyword: "social media services", position: 5, change: -1, volume: 3200, difficulty: "Medium" },
  { keyword: "ppc management", position: 2, change: 4, volume: 2800, difficulty: "Medium" },
  { keyword: "seo consultant", position: 8, change: 0, volume: 1900, difficulty: "High" },
  { keyword: "content marketing strategy", position: 4, change: 1, volume: 1600, difficulty: "Medium" },
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
            <CardTitle className="text-sm font-medium">Domain Authority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+3 from last check</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Organic Traffic Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={dailyPerformance} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>Organic Search</div>
                <div className="w-2/3">
                  <div className="bg-green-500 h-2 rounded" style={{ width: "62%" }}></div>
                </div>
                <div>62%</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Direct</div>
                <div className="w-2/3">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: "18%" }}></div>
                </div>
                <div>18%</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Referral</div>
                <div className="w-2/3">
                  <div className="bg-purple-500 h-2 rounded" style={{ width: "12%" }}></div>
                </div>
                <div>12%</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Social</div>
                <div className="w-2/3">
                  <div className="bg-orange-500 h-2 rounded" style={{ width: "8%" }}></div>
                </div>
                <div>8%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
      </div>
    </div>
  );
};

export default SEOPage;
