
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KeywordTable from './KeywordTable';

// Top pages sample data
const topPages = [
  { url: '/homepage', impressions: 3500, clicks: 320, ctr: 9.1, position: 2.3 },
  { url: '/product', impressions: 2800, clicks: 240, ctr: 8.6, position: 3.1 },
  { url: '/blog', impressions: 2200, clicks: 195, ctr: 8.9, position: 2.8 },
  { url: '/contact', impressions: 1900, clicks: 175, ctr: 9.2, position: 2.2 },
  { url: '/about', impressions: 1600, clicks: 140, ctr: 8.8, position: 3.0 },
];

interface SEOTabsContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  serpKeywords: any[];
  selectedWebsite: string;
}

const SEOTabsContent = ({ activeTab, onTabChange, serpKeywords, selectedWebsite }: SEOTabsContentProps) => {
  return (
    <Tabs defaultValue="keywords" className="mt-6" onValueChange={onTabChange} value={activeTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="keywords">Keywords</TabsTrigger>
        <TabsTrigger value="pages">Pages</TabsTrigger>
        <TabsTrigger value="urlData">URL Meta Data</TabsTrigger>
        <TabsTrigger value="sitePerformance">Site Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="keywords" className="space-y-4">
        <KeywordTable keywords={serpKeywords} />
      </TabsContent>

      <TabsContent value="pages">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Pages</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Page</th>
                    <th className="text-right pb-2">Impressions</th>
                    <th className="text-right pb-2">Clicks</th>
                    <th className="text-right pb-2">CTR</th>
                    <th className="text-right pb-2">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((page, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 text-blue-600">{page.url}</td>
                      <td className="py-3 text-right">{page.impressions.toLocaleString()}</td>
                      <td className="py-3 text-right">{page.clicks.toLocaleString()}</td>
                      <td className="py-3 text-right">{page.ctr.toFixed(1)}%</td>
                      <td className="py-3 text-right">{page.position.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="urlData">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">URL Meta Data Analysis</h3>
            <p className="text-muted-foreground mb-6">Meta title and description optimization status for {selectedWebsite}</p>
            <div className="p-6 border rounded-lg bg-muted/20">
              <p>URL meta data analysis will be populated from Google Search Console data when connected</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="sitePerformance">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Site Performance Metrics</h3>
            <p className="text-muted-foreground mb-6">Page speed and core web vitals for {selectedWebsite}</p>
            <div className="p-6 border rounded-lg bg-muted/20">
              <p>Performance metrics will be integrated with Google Search Console data</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SEOTabsContent;
