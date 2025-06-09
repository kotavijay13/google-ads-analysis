
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface LeadStatusSelectorProps {
  status: string;
  leadId: string;
  onStatusChange: (leadId: string, newStatus: string) => void;
}

const statusOptions = [
  { value: 'New', label: 'New', variant: 'secondary' as const },
  { value: 'Contacted', label: 'Contacted', variant: 'default' as const },
  { value: 'Qualified', label: 'Qualified', variant: 'default' as const },
  { value: 'Follow-up', label: 'Follow-up', variant: 'secondary' as const },
  { value: 'Not Reachable', label: 'Not Reachable', variant: 'destructive' as const },
  { value: 'Converted', label: 'Converted', variant: 'default' as const },
  { value: 'Lost', label: 'Lost', variant: 'destructive' as const }
];

const LeadStatusSelector = ({ status, leadId, onStatusChange }: LeadStatusSelectorProps) => {
  const currentStatus = statusOptions.find(s => s.value === status) || statusOptions[0];

  return (
    <Select value={status} onValueChange={(newStatus) => onStatusChange(leadId, newStatus)}>
      <SelectTrigger className="w-36 h-8 text-sm">
        <SelectValue>
          <Badge variant={currentStatus.variant} className="text-xs">
            {currentStatus.label}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="z-50">
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-sm">
            <Badge variant={option.variant} className="text-xs">
              {option.label}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LeadStatusSelector;
