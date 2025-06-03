
import { Card, CardContent } from '@/components/ui/card';
import SortableTable from '../SortableTable';
import DownloadButton from '../DownloadButton';
import { urlMetaDataColumns } from '../columns/pagesColumns';

interface URLMetaDataTabProps {
  urlMetaData: any[];
  selectedWebsite: string;
}

const URLMetaDataTab = ({ urlMetaData, selectedWebsite }: URLMetaDataTabProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">URL Meta Data Analysis</h3>
            <p className="text-muted-foreground">Meta titles, descriptions and image analysis for {selectedWebsite}</p>
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
              Meta data is being scraped from the top performing pages using enhanced scraping.
            </p>
            <p className="text-sm text-muted-foreground">
              This includes actual meta titles, descriptions, and image analysis from the web pages.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default URLMetaDataTab;
