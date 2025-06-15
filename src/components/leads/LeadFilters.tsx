
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface LeadFiltersProps {
  onStatusFilter: (status: string) => void;
  onAssignedToFilter: (assignedTo: string) => void;
  onWebsiteFilter: (website: string) => void;
  availableWebsites: string[];
  onReset: () => void;
}

const LeadFilters = ({ onStatusFilter, onAssignedToFilter, onWebsiteFilter, availableWebsites, onReset }: LeadFiltersProps) => {
  const statusOptions = ['All', 'New', 'Contacted', 'Qualified', 'Follow-up', 'Not Reachable', 'Converted', 'Lost'];
  const assignedToOptions = ['All', 'Unassigned', 'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Brown'];

  return (
    <Card className="bg-white shadow-sm w-full">
      <CardContent className="p-3 lg:p-4">
        <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:flex-wrap lg:gap-4 lg:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="font-medium text-sm lg:text-base">Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 flex-1">
            {/* Status Filter */}
            <Select onValueChange={onStatusFilter}>
              <SelectTrigger className="w-full h-8 text-xs lg:text-sm">
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
              <SelectTrigger className="w-full h-8 text-xs lg:text-sm">
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

            {/* Website Filter */}
            <Select onValueChange={onWebsiteFilter}>
              <SelectTrigger className="w-full h-8 text-xs lg:text-sm">
                <SelectValue placeholder="Filter by Website" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {availableWebsites.map((website) => (
                  <SelectItem key={website} value={website} className="text-xs lg:text-sm">
                    {website}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset} 
              className="h-8 text-xs lg:text-sm w-full lg:w-auto"
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
