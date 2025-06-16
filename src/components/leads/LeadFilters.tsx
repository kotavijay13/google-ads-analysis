
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
  availableSources: string[];
}

const LeadFilters = ({ onStatusFilter, onAssignedToFilter, onSourceFilter, onReset, availableSources }: LeadFiltersProps) => {
  const statusOptions = ['All', 'New', 'Contacted', 'Qualified', 'Follow-up', 'Not Reachable', 'Converted', 'Lost'];
  const assignedToOptions = ['All', 'Unassigned', 'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Brown'];

  return (
    <Card className="bg-white shadow-sm w-full border-blue-200">
      <CardContent className="p-3 lg:p-4">
        <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:flex-wrap lg:gap-4 lg:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-sm lg:text-base text-blue-600">Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 flex-1">
            {/* Status Filter */}
            <Select onValueChange={onStatusFilter}>
              <SelectTrigger className="w-full h-8 text-xs lg:text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status} className="text-xs lg:text-sm">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Assigned To Filter */}
            <Select onValueChange={onAssignedToFilter}>
              <SelectTrigger className="w-full h-8 text-xs lg:text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Filter by Assigned" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {assignedToOptions.map((person) => (
                  <SelectItem key={person} value={person} className="text-xs lg:text-sm">
                    {person}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Source Filter */}
            <Select onValueChange={onSourceFilter}>
              <SelectTrigger className="w-full h-8 text-xs lg:text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Filter by Source" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {availableSources.map((source) => (
                  <SelectItem key={source} value={source} className="text-xs lg:text-sm">
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReset} 
              className="h-8 text-xs lg:text-sm w-full lg:w-auto border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500"
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
