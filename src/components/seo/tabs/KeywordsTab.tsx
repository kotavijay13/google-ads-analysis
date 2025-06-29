
import KeywordTable from '../KeywordTable';
import DownloadButton from '../DownloadButton';

interface KeywordsTabProps {
  serpKeywords: any[];
  selectedWebsite: string;
}

const KeywordsTab = ({ serpKeywords, selectedWebsite }: KeywordsTabProps) => {
  // Sort keywords by position (best ranking first)
  const sortedKeywords = [...serpKeywords].sort((a, b) => {
    const aPosition = parseFloat(a.position) || 999;
    const bPosition = parseFloat(b.position) || 999;
    return aPosition - bPosition;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Top Ranking Keywords</h3>
          <p className="text-muted-foreground">Keywords ranked by position for {selectedWebsite}</p>
        </div>
        <DownloadButton 
          data={sortedKeywords}
          filename={`keywords-${selectedWebsite}`}
          title={`Keywords Report - ${selectedWebsite}`}
        />
      </div>
      {sortedKeywords.length > 0 ? (
        <KeywordTable keywords={sortedKeywords} selectedWebsite={selectedWebsite} />
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
