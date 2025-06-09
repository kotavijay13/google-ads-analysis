
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subDays } from 'date-fns';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date;
  to: Date;
}

interface LeadFiltersProps {
  onDateRangeChange: (range: DateRange) => void;
  onStatusFilter: (status: string) => void;
  onAssignedToFilter: (assignedTo: string) => void;
  onReset: () => void;
}

const LeadFilters = ({ onDateRangeChange, onStatusFilter, onAssignedToFilter, onReset }: LeadFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});

  const today = new Date();
  
  const quickDateFilters = [
    { label: 'Today', getValue: () => ({ from: today, to: today }) },
    { label: 'Yesterday', getValue: () => { const yesterday = subDays(today, 1); return { from: yesterday, to: yesterday }; } },
    { label: 'Last 7 days', getValue: () => ({ from: subDays(today, 6), to: today }) },
    { label: 'Last 15 days', getValue: () => ({ from: subDays(today, 14), to: today }) },
    { label: 'Last 30 days', getValue: () => ({ from: subDays(today, 29), to: today }) }
  ];

  const statusOptions = ['All', 'New', 'Contacted', 'Qualified', 'Follow-up', 'Converted', 'Closed'];
  const assignedToOptions = ['All', 'Unassigned', 'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Brown'];

  const handleQuickDateFilter = (filter: typeof quickDateFilters[0]) => {
    const range = filter.getValue();
    onDateRangeChange(range);
  };

  const handleCustomDateSelect = () => {
    if (customDateRange.from && customDateRange.to) {
      onDateRangeChange({ from: customDateRange.from, to: customDateRange.to });
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters:</span>
          </div>
          
          {/* Quick Date Filters */}
          <div className="flex flex-wrap gap-2">
            {quickDateFilters.map((filter) => (
              <Button
                key={filter.label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickDateFilter(filter)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Custom Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">From:</label>
                    <Calendar
                      mode="single"
                      selected={customDateRange.from}
                      onSelect={(date) => setCustomDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">To:</label>
                    <Calendar
                      mode="single"
                      selected={customDateRange.to}
                      onSelect={(date) => setCustomDateRange(prev => ({ ...prev, to: date }))}
                    />
                  </div>
                  <Button onClick={handleCustomDateSelect} className="w-full">
                    Apply Custom Range
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Select onValueChange={onStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assigned To Filter */}
          <Select onValueChange={onAssignedToFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Assigned" />
            </SelectTrigger>
            <SelectContent>
              {assignedToOptions.map((person) => (
                <SelectItem key={person} value={person}>
                  {person}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadFilters;
