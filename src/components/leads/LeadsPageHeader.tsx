
import DateRangePicker from '@/components/DateRangePicker';
import DownloadButton from '@/components/seo/DownloadButton';
import ColumnSelector from '@/components/ColumnSelector';

interface LeadsPageHeaderProps {
  selectedWebsite: string;
  exportData: any[];
  onDateChange: (range: { from: Date; to: Date }) => void;
  columns: { key: string; label: string }[];
  visibleColumns: string[];
  onColumnToggle: (column: string) => void;
}

const LeadsPageHeader = ({ 
  selectedWebsite, 
  exportData, 
  onDateChange,
  columns,
  visibleColumns,
  onColumnToggle
}: LeadsPageHeaderProps) => {
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
      <div className="flex items-center gap-2">
        <DateRangePicker onDateChange={onDateChange} />
        <DownloadButton 
          data={exportData}
          filename="leads-export"
          title="Leads Report"
          disabled={exportData.length === 0}
        />
        <ColumnSelector 
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnToggle={onColumnToggle}
        />
      </div>
    </div>
  );
};

export default LeadsPageHeader;
