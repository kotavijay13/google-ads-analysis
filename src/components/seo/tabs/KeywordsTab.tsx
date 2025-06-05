
import KeywordTable from '../KeywordTable';
import DownloadButton from '../DownloadButton';

interface KeywordsTabProps {
  serpKeywords: any[];
  selectedWebsite: string;
}

const KeywordsTab = ({ serpKeywords, selectedWebsite }: KeywordsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Top Ranking Keywords</h3>
        <DownloadButton 
          data={serpKeywords}
          filename={`keywords-${selectedWebsite}`}
          title={`Keywords Report - ${selectedWebsite}`}
        />
      </div>
      {serpKeywords.length > 0 ? (
        <KeywordTable keywords={serpKeywords} selectedWebsite={selectedWebsite} />
      ) : (
        <div className="p-6 border rounded-lg bg-muted/20">
          <h4 className="font-semibold mb-2">No Keywords Found</h4>
          <p className="text-sm text-muted-foreground">
            Please select a website and refresh data to load keyword information.
          </p>
        </div>
      )}
    </div>
  );
};

export default KeywordsTab;
