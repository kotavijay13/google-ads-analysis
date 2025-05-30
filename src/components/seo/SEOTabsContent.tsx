
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KeywordTable from './KeywordTable';
import DownloadButton from './DownloadButton';
import { Badge } from '@/components/ui/badge';

interface SEOTabsContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  serpKeywords: any[];
  pages: any[];
  urlMetaData: any[];
  sitePerformance: any;
  selectedWebsite: string;
}

const SEOTabsContent = ({ 
  activeTab, 
  onTabChange, 
  serpKeywords, 
  pages, 
  urlMetaData, 
  sitePerformance, 
  selectedWebsite 
}: SEOTabsContentProps) => {
  return (
    <Tabs defaultValue="keywords" className="mt-6" onValueChange={onTabChange} value={activeTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="keywords">Keywords ({serpKeywords.length})</TabsTrigger>
        <TabsTrigger value="pages">Pages ({pages.length})</TabsTrigger>
        <TabsTrigger value="urlData">URL Meta Data ({urlMetaData.length})</TabsTrigger>
        <TabsTrigger value="sitePerformance">Site Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="keywords" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Top Ranking Keywords</h3>
          <DownloadButton 
            data={serpKeywords}
            filename={`keywords-${selectedWebsite}`}
            title={`Keywords Report - ${selectedWebsite}`}
          />
        </div>
        <KeywordTable keywords={serpKeywords} />
      </TabsContent>

      <TabsContent value="pages">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Top Performing Pages</h3>
              <DownloadButton 
                data={pages}
                filename={`pages-${selectedWebsite}`}
                title={`Pages Report - ${selectedWebsite}`}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Page URL</th>
                    <th className="text-right pb-2">Impressions</th>
                    <th className="text-right pb-2">Clicks</th>
                    <th className="text-right pb-2">CTR (%)</th>
                    <th className="text-right pb-2">Avg Position</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="py-3 text-blue-600 font-medium">{page.url}</td>
                      <td className="py-3 text-right">{page.impressions.toLocaleString()}</td>
                      <td className="py-3 text-right">{page.clicks.toLocaleString()}</td>
                      <td className="py-3 text-right">{page.ctr}%</td>
                      <td className="py-3 text-right">{page.position}</td>
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
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">URL Meta Data Analysis</h3>
                <p className="text-muted-foreground">Meta titles, descriptions and indexing status for {selectedWebsite}</p>
              </div>
              <DownloadButton 
                data={urlMetaData}
                filename={`url-meta-data-${selectedWebsite}`}
                title={`URL Meta Data Report - ${selectedWebsite}`}
              />
            </div>
            
            {urlMetaData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">URL</th>
                      <th className="text-left pb-2">Meta Title</th>
                      <th className="text-left pb-2">Meta Description</th>
                      <th className="text-center pb-2">Index Status</th>
                      <th className="text-center pb-2">Crawl Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urlMetaData.map((url, index) => (
                      <tr key={index} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="py-3 text-blue-600 font-medium max-w-xs truncate" title={url.url}>{url.url}</td>
                        <td className="py-3 max-w-sm truncate" title={url.metaTitle || 'N/A'}>{url.metaTitle || 'N/A'}</td>
                        <td className="py-3 max-w-sm truncate" title={url.metaDescription || 'N/A'}>{url.metaDescription || 'N/A'}</td>
                        <td className="py-3 text-center">
                          <Badge variant={url.indexStatus === 'PASS' ? 'default' : 'destructive'}>
                            {url.indexStatus}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          <Badge variant={url.crawlStatus === 'GOOGLEBOT' ? 'default' : 'secondary'}>
                            {url.crawlStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 border rounded-lg bg-muted/20">
                <h4 className="font-semibold mb-2">Loading URL Meta Data...</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Meta data is being scraped from the top performing pages using the LinkPreview API.
                </p>
                <p className="text-sm text-muted-foreground">
                  This includes actual meta titles and descriptions from the web pages.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="sitePerformance">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Site Performance Metrics</h3>
                <p className="text-muted-foreground">Page speed and core web vitals for {selectedWebsite}</p>
              </div>
              <DownloadButton 
                data={Object.keys(sitePerformance).length > 0 ? [sitePerformance] : []}
                filename={`site-performance-${selectedWebsite}`}
                title={`Site Performance Report - ${selectedWebsite}`}
              />
            </div>
            
            {Object.keys(sitePerformance).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Total Pages</h4>
                  <p className="text-2xl font-bold">{sitePerformance.totalPages}</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Indexed Pages</h4>
                  <p className="text-2xl font-bold text-green-600">{sitePerformance.indexedPages}</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Crawl Errors</h4>
                  <p className="text-2xl font-bold text-red-600">{sitePerformance.crawlErrors}</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Avg Load Time</h4>
                  <p className="text-2xl font-bold">{sitePerformance.avgLoadTime}</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Mobile Usability</h4>
                  <p className="text-2xl font-bold text-green-600">{sitePerformance.mobileUsability}</p>
                </div>
                
                {sitePerformance.coreWebVitals && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm text-muted-foreground">Core Web Vitals</h4>
                    <div className="space-y-1">
                      <p className="text-sm">LCP: {sitePerformance.coreWebVitals.lcp}</p>
                      <p className="text-sm">FID: {sitePerformance.coreWebVitals.fid}</p>
                      <p className="text-sm">CLS: {sitePerformance.coreWebVitals.cls}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 border rounded-lg bg-muted/20">
                <p>Performance metrics will be integrated with Google Search Console data when available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SEOTabsContent;
