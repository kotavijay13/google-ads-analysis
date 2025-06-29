
import { Card, CardContent } from '@/components/ui/card';
import SortableTable from '../SortableTable';
import DownloadButton from '../DownloadButton';
import { pagesColumns } from '../columns/pagesColumns';

interface PagesTabProps {
  pages: any[];
  selectedWebsite: string;
}

const PagesTab = ({ pages, selectedWebsite }: PagesTabProps) => {
  // Sort pages by impressions (highest to lowest)
  const sortedPages = [...pages].sort((a, b) => {
    const aImpressions = a.impressions || 0;
    const bImpressions = b.impressions || 0;
    return bImpressions - aImpressions;
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Top Performing Pages</h3>
            <p className="text-muted-foreground">Pages sorted by impressions for {selectedWebsite}</p>
          </div>
          <DownloadButton 
            data={sortedPages}
            filename={`pages-${selectedWebsite}`}
            title={`Pages Report - ${selectedWebsite}`}
          />
        </div>
        {sortedPages.length > 0 ? (
          <SortableTable 
            data={sortedPages} 
            columns={pagesColumns}
            className="overflow-x-auto"
          />
        ) : (
          <div className="p-6 border rounded-lg bg-muted/20">
            <h4 className="font-semibold mb-2">No Pages Found</h4>
            <p className="text-sm text-muted-foreground">
              Please select a website and refresh data to load page performance information.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PagesTab;
