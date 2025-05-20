
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PropertyFormProps {
  websiteUrl: string;
  isLoading: boolean;
  onWebsiteUrlChange: (value: string) => void;
  onAddProperty: () => Promise<void>;
}

const PropertyForm = ({ websiteUrl, isLoading, onWebsiteUrlChange, onAddProperty }: PropertyFormProps) => {
  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium mb-2">Add Search Console Property</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Enter website URL (e.g., example.com)"
            value={websiteUrl}
            onChange={(e) => onWebsiteUrlChange(e.target.value)}
          />
        </div>
        <Button 
          onClick={onAddProperty}
          disabled={isLoading || !websiteUrl}
        >
          Add Property
        </Button>
      </div>
    </div>
  );
};

export default PropertyForm;
