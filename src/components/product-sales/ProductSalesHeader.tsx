
import { Brain } from 'lucide-react';
import DateRangePicker from '@/components/DateRangePicker';

interface ProductSalesHeaderProps {
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (newDateRange: { from: Date; to: Date }) => void;
}

const ProductSalesHeader = ({ dateRange, onDateRangeChange }: ProductSalesHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-primary">Product Sales Analytics</h1>
        <p className="text-muted-foreground">Track and analyze your product sales performance across all channels</p>
      </div>
      <div className="flex flex-col items-end">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sales Date Range
        </label>
        <DateRangePicker onDateChange={onDateRangeChange} />
      </div>
    </div>
  );
};

export default ProductSalesHeader;
