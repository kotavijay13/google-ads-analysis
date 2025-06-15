
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
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Status Filter */}
          <Select onValueChange={onStatusFilter}>
            <SelectTrigger className="w-36 h-8 text-sm">
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
          <Select onValueChange={onAssignedToFilter}>
            <SelectTrigger className="w-40 h-8 text-sm">
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

          {/* Website Filter - Now using connected forms websites */}
          <Select onValueChange={onWebsiteFilter}>
            <SelectTrigger className="w-48 h-8 text-sm">
              <SelectValue placeholder="Filter by Website" />
            </SelectTrigger>
            <SelectContent className="z-50">
              {availableWebsites.map((website) => (
                <SelectItem key={website} value={website} className="text-sm">
                  {website}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-sm">
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadFilters;
