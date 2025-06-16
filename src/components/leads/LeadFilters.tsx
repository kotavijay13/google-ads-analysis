
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface LeadFiltersProps {
  onStatusFilter: (status: string) => void;
  onAssignedToFilter: (assignedTo: string) => void;
  onSourceFilter: (source: string) => void;
  onReset: () => void;
  onApplyFilters: () => void;
  availableSources: string[];
}

const LeadFilters = ({ 
  onStatusFilter, 
  onAssignedToFilter, 
  onSourceFilter, 
  onReset, 
  onApplyFilters,
  availableSources 
}: LeadFiltersProps) => {
  const [tempFilters, setTempFilters] = useState({
    status: 'All',
    assignedTo: 'All',
    source: 'All'
  });

  const statusOptions = ['All', 'New', 'Contacted', 'Qualified', 'Follow-up', 'Not Reachable', 'Converted', 'Lost'];
  const assignedToOptions = ['All', 'Unassigned', 'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Brown'];

  const handleApply = () => {
    onStatusFilter(tempFilters.status);
    onAssignedToFilter(tempFilters.assignedTo);
    onSourceFilter(tempFilters.source);
    onApplyFilters();
  };

  const handleReset = () => {
    setTempFilters({
      status: 'All',
      assignedTo: 'All',
      source: 'All'
    });
    onReset();
  };

  return (
    <Card className="bg-white shadow-sm w-full border-blue-200">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:flex-wrap lg:gap-4 lg:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-sm lg:text-base text-blue-600">Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 flex-1">
            {/* Status Filter */}
            <Select value={tempFilters.status} onValueChange={(value) => setTempFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-full h-9 text-sm border-blue-300 focus:border-blue-600 focus:ring-blue-600">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status} className="text-sm">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Assigned To Filter */}
            <Select value={tempFilters.assignedTo} onValueChange={(value) => setTempFilters(prev => ({ ...prev, assignedTo: value }))}>
              <SelectTrigger className="w-full h-9 text-sm border-blue-300 focus:border-blue-600 focus:ring-blue-600">
                <SelectValue placeholder="Filter by Assigned" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {assignedToOptions.map((person) => (
                  <SelectItem key={person} value={person} className="text-sm">
                    {person}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Source Filter */}
            <Select value={tempFilters.source} onValueChange={(value) => setTempFilters(prev => ({ ...prev, source: value }))}>
              <SelectTrigger className="w-full h-9 text-sm border-blue-300 focus:border-blue-600 focus:ring-blue-600">
                <SelectValue placeholder="Filter by Source" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {availableSources.map((source) => (
                  <SelectItem key={source} value={source} className="text-sm">
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Apply Button */}
            <Button 
              onClick={handleApply}
              className="h-9 text-sm w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Filters
            </Button>

            {/* Reset Button */}
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="h-9 text-sm w-full lg:w-auto border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadFilters;
