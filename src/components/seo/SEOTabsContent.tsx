
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KeywordTable from './KeywordTable';
import SortableTable from './SortableTable';
import DownloadButton from './DownloadButton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  
  const pagesColumns = [
    {
      key: 'url',
      label: 'Page URL',
      sortable: true,
      render: (value: string) => (
        <span className="text-blue-600 font-medium">{value}</span>
      ),
    },
    {
      key: 'impressions',
      label: 'Impressions',
      sortable: true,
      className: 'text-right',
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'clicks',
      label: 'Clicks',
      sortable: true,
      className: 'text-right',
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'ctr',
      label: 'CTR (%)',
      sortable: true,
      className: 'text-right',
      render: (value: number) => `${value}%`,
    },
    {
      key: 'position',
      label: 'Avg Position',
      sortable: true,
      className: 'text-right',
    },
  ];

  const urlMetaDataColumns = [
    {
      key: 'url',
      label: 'URL',
      sortable: true,
      render: (value: string) => (
        <span 
          className="text-blue-600 font-medium max-w-xs truncate block" 
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'metaTitle',
      label: 'Meta Title',
      sortable: true,
      render: (value: string) => (
        <span 
          className="max-w-sm truncate block" 
          title={value || 'N/A'}
        >
          {value || 'N/A'}
        </span>
      ),
    },
    {
      key: 'metaDescription',
      label: 'Meta Description',
      sortable: true,
      render: (value: string) => (
        <span 
          className="max-w-sm truncate block" 
          title={value || 'N/A'}
        >
          {value || 'N/A'}
        </span>
      ),
    },
    {
      key: 'indexStatus',
      label: 'Index Status',
      sortable: true,
      className: 'text-center',
      render: (value: string) => (
        <Badge variant={value === 'PASS' ? 'default' : 'destructive'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'crawlStatus',
      label: 'Crawl Status',
      sortable: true,
      className: 'text-center',
      render: (value: string) => (
        <Badge variant={value === 'GOOGLEBOT' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      ),
    },
  ];

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
            <SortableTable 
              data={pages} 
              columns={pagesColumns}
              className="overflow-x-auto"
            />
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
              <SortableTable 
                data={urlMetaData} 
                columns={urlMetaDataColumns}
                className="overflow-x-auto"
              />
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
