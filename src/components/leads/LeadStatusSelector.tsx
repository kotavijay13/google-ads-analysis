
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface LeadStatusSelectorProps {
  status: string;
  leadId: string;
  onStatusChange: (leadId: string, newStatus: string) => void;
}

const statusOptions = [
  { value: 'New', label: 'New', variant: 'default' as const },
  { value: 'Contacted', label: 'Contacted', variant: 'secondary' as const },
  { value: 'Qualified', label: 'Qualified', variant: 'default' as const },
  { value: 'Follow-up', label: 'Follow-up', variant: 'secondary' as const },
  { value: 'Converted', label: 'Converted', variant: 'default' as const },
  { value: 'Closed', label: 'Closed', variant: 'secondary' as const }
];

const LeadStatusSelector = ({ status, leadId, onStatusChange }: LeadStatusSelectorProps) => {
  const currentStatus = statusOptions.find(s => s.value === status) || statusOptions[0];

  return (
    <Select value={status} onValueChange={(newStatus) => onStatusChange(leadId, newStatus)}>
      <SelectTrigger className="w-32">
        <SelectValue>
          <Badge variant={currentStatus.variant}>
            {currentStatus.label}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <Badge variant={option.variant}>
              {option.label}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LeadStatusSelector;
