
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, Sheet } from 'lucide-react';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';

interface DownloadButtonProps {
  data: any[];
  filename: string;
  title: string;
  disabled?: boolean;
}

const DownloadButton = ({ data, filename, title, disabled = false }: DownloadButtonProps) => {
  const handleCSVDownload = () => {
    exportToCSV(data, filename);
  };

  const handlePDFDownload = () => {
    exportToPDF(data, filename, title);
  };

  if (disabled || !data || data.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCSVDownload}>
          <Sheet className="w-4 h-4 mr-2" />
          Export as Excel (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePDFDownload}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadButton;
