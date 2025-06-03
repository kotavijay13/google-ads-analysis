
import { Card, CardContent } from '@/components/ui/card';
import DownloadButton from '../DownloadButton';

interface SitePerformanceTabProps {
  urlMetaData: any[];
  sitePerformance: any;
  selectedWebsite: string;
}

const SitePerformanceTab = ({ urlMetaData, sitePerformance, selectedWebsite }: SitePerformanceTabProps) => {
  // Calculate site performance metrics with actual data
  const totalPagesScraped = urlMetaData.length;
  const totalImagesFound = urlMetaData.reduce((acc, page) => acc + (page.imageCount || 0), 0);
  const imagesWithoutAlt = urlMetaData.reduce((acc, page) => acc + (page.imagesWithoutAlt || 0), 0);

  const enhancedSitePerformance = {
    ...sitePerformance,
    totalPagesScraped,
    totalImagesFound,
    imagesWithoutAlt,
    altTextCoverage: totalImagesFound > 0 ? ((totalImagesFound - imagesWithoutAlt) / totalImagesFound * 100).toFixed(1) : '0'
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Site Performance Metrics</h3>
            <p className="text-muted-foreground">Comprehensive performance analysis for {selectedWebsite}</p>
          </div>
          <DownloadButton 
            data={Object.keys(enhancedSitePerformance).length > 0 ? [enhancedSitePerformance] : []}
            filename={`site-performance-${selectedWebsite}`}
            title={`Site Performance Report - ${selectedWebsite}`}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground">Total Pages</h4>
            <p className="text-2xl font-bold">{enhancedSitePerformance.totalPages || 0}</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground">Pages Analyzed</h4>
            <p className="text-2xl font-bold text-blue-600">{enhancedSitePerformance.totalPagesScraped || 0}</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground">Total Images Found</h4>
            <p className="text-2xl font-bold text-green-600">{enhancedSitePerformance.totalImagesFound || 0}</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground">Images Missing Alt Text</h4>
            <p className="text-2xl font-bold text-red-600">{enhancedSitePerformance.imagesWithoutAlt || 0}</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground">Alt Text Coverage</h4>
            <p className="text-2xl font-bold text-green-600">{enhancedSitePerformance.altTextCoverage || 0}%</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground">Mobile Usability</h4>
            <p className="text-2xl font-bold text-green-600">{enhancedSitePerformance.mobileUsability || 'Good'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SitePerformanceTab;
