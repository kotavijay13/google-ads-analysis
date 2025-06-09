
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeadStatusSelectorProps {
  status: string;
  leadId: string;
  onStatusChange: (leadId: string, newStatus: string) => void;
}

const statusOptions = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Follow-up', label: 'Follow-up' },
  { value: 'Not Reachable', label: 'Not Reachable' },
  { value: 'Converted', label: 'Converted' },
  { value: 'Lost', label: 'Lost' }
];

const LeadStatusSelector = ({ status, leadId, onStatusChange }: LeadStatusSelectorProps) => {
  const currentStatus = statusOptions.find(s => s.value === status) || statusOptions[0];

  return (
    <Select value={status} onValueChange={(newStatus) => onStatusChange(leadId, newStatus)}>
      <SelectTrigger className="w-36 h-8 text-sm">
        <SelectValue>
          <span className="text-sm text-gray-700">
            {currentStatus.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="z-50">
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-sm">
            <span className="text-sm text-gray-700">
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LeadStatusSelector;
