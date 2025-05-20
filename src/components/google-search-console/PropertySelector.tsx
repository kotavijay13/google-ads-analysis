
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SearchConsoleProperty } from './types';

interface PropertySelectorProps {
  properties: SearchConsoleProperty[];
  selectedProperty: string | null;
  onSelectProperty: (value: string) => void;
}

const PropertySelector = ({ properties, selectedProperty, onSelectProperty }: PropertySelectorProps) => {
  if (properties.length === 0) return null;

  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium mb-2">Select Search Console Property</h3>
      <Select 
        value={selectedProperty || undefined}
        onValueChange={onSelectProperty}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a property" />
        </SelectTrigger>
        <SelectContent>
          {properties.map((property) => (
            <SelectItem key={property.url} value={property.url} className="flex items-center justify-between">
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertySelector;
