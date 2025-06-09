
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeadAssignedToSelectorProps {
  assignedTo: string | null;
  leadId: string;
  onAssignedToChange: (leadId: string, assignedTo: string) => void;
}

const salesPersons = [
  'Unassigned',
  'John Smith',
  'Sarah Johnson', 
  'Mike Wilson',
  'Emily Davis',
  'David Brown'
];

const LeadAssignedToSelector = ({ assignedTo, leadId, onAssignedToChange }: LeadAssignedToSelectorProps) => {
  return (
    <Select 
      value={assignedTo || 'Unassigned'} 
      onValueChange={(value) => onAssignedToChange(leadId, value === 'Unassigned' ? '' : value)}
    >
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Assign to..." />
      </SelectTrigger>
      <SelectContent>
        {salesPersons.map((person) => (
          <SelectItem key={person} value={person === 'Unassigned' ? '' : person}>
            {person}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LeadAssignedToSelector;
