
import { Card, CardContent } from '@/components/ui/card';
import SortableTable from './SortableTable';
import DownloadButton from './DownloadButton';
import { Badge } from '@/components/ui/badge';

interface ImageAnalysisTabProps {
  urlMetaData: any[];
  selectedWebsite: string;
}

const ImageAnalysisTab = ({ urlMetaData, selectedWebsite }: ImageAnalysisTabProps) => {
  // Extract all images from all URLs
  const allImages = urlMetaData.flatMap(page => 
    (page.images || []).map((img: any) => ({
      pageUrl: page.url,
      imageUrl: img.src,
      altText: img.alt,
      hasAltText: img.hasAltText
    }))
  );

  // Calculate statistics
  const totalImages = allImages.length;
  const imagesWithoutAlt = allImages.filter(img => !img.hasAltText).length;
  const altTextCoverage = totalImages > 0 ? ((totalImages - imagesWithoutAlt) / totalImages * 100).toFixed(1) : '0';

  const imageColumns = [
    {
      key: 'pageUrl',
      label: 'Page URL',
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
      key: 'imageUrl',
      label: 'Image URL',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <img 
            src={value} 
            alt="Preview" 
            className="w-12 h-12 object-cover rounded border"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span 
            className="text-blue-600 font-medium max-w-xs truncate block" 
            title={value}
          >
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'altText',
      label: 'Alt Text',
      sortable: true,
      render: (value: string) => (
        <span 
          className="max-w-sm truncate block" 
          title={value || 'No alt text'}
        >
          {value || 'No alt text'}
        </span>
      ),
    },
    {
      key: 'hasAltText',
      label: 'Alt Text Status',
      sortable: true,
      className: 'text-center',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'destructive'}>
          {value ? 'Has Alt Text' : 'Missing Alt Text'}
        </Badge>
      ),
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Image Analysis</h3>
            <p className="text-muted-foreground">All images found on {selectedWebsite} with alt text analysis</p>
          </div>
          <DownloadButton 
            data={allImages}
            filename={`image-analysis-${selectedWebsite}`}
            title={`Image Analysis Report - ${selectedWebsite}`}
          />
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground">Total Images</h4>
            <p className="text-2xl font-bold">{totalImages}</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground">Missing Alt Text</h4>
            <p className="text-2xl font-bold text-red-600">{imagesWithoutAlt}</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground">Alt Text Coverage</h4>
            <p className="text-2xl font-bold text-green-600">{altTextCoverage}%</p>
          </div>
        </div>

        {allImages.length > 0 ? (
          <SortableTable 
            data={allImages} 
            columns={imageColumns}
            className="overflow-x-auto"
          />
        ) : (
          <div className="p-6 border rounded-lg bg-muted/20">
            <h4 className="font-semibold mb-2">Loading Image Data...</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Images are being analyzed from the scraped pages.
            </p>
            <p className="text-sm text-muted-foreground">
              This includes image URLs and alt text analysis for SEO optimization.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageAnalysisTab;
