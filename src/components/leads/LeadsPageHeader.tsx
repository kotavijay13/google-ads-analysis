
import DateRangePicker from '@/components/DateRangePicker';
import DownloadButton from '@/components/seo/DownloadButton';

interface LeadsPageHeaderProps {
  selectedWebsite: string;
  exportData: any[];
  onDateChange: (range: { from: Date; to: Date }) => void;
}

const LeadsPageHeader = ({ selectedWebsite, exportData, onDateChange }: LeadsPageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h2 className="text-lg font-medium text-gray-900">
        Leads Overview
        {selectedWebsite !== 'All' && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({selectedWebsite})
          </span>
        )}
      </h2>
      <div className="flex gap-2">
        <DateRangePicker onDateChange={onDateChange} />
        <DownloadButton 
          data={exportData}
          filename="leads-export"
          title="Leads Report"
          disabled={exportData.length === 0}
        />
      </div>
    </div>
  );
};

export default LeadsPageHeader;
