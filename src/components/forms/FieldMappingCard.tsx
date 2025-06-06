
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { CheckCircle, X, LinkIcon } from 'lucide-react';
import { WebsiteForm, FieldMapping, leadFormFields } from './types';

interface FieldMappingCardProps {
  selectedForm: WebsiteForm;
  fieldMappings: FieldMapping[];
  isConnected: boolean;
  onFieldMappingUpdate: (websiteField: string, leadField: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

const FieldMappingCard = ({
  selectedForm,
  fieldMappings,
  isConnected,
  onFieldMappingUpdate,
  onConnect,
  onDisconnect
}: FieldMappingCardProps) => {
  const handleConnect = () => {
    const mappedFields = fieldMappings.filter(mapping => mapping.leadField && mapping.leadField !== 'none');
    
    if (mappedFields.length === 0) {
      toast.error("Please map at least one field");
      return;
    }
    
    onConnect();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Field Mapping - {selectedForm.name}</span>
          {isConnected && (
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              <X className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Map your website form fields to lead form fields to ensure data flows correctly.
        </div>
        
        <div className="space-y-3">
          {selectedForm.fields.map((field) => {
            const mapping = fieldMappings.find(m => m.websiteField === field.name);
            return (
              <div key={field.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium">{field.name}</Label>
                  <div className="text-xs text-muted-foreground">
                    {field.type} {field.required && '(required)'}
                  </div>
                </div>
                <div className="text-muted-foreground">→</div>
                <div className="flex-1">
                  <Select
                    value={mapping?.leadField || 'none'}
                    onValueChange={(value) => onFieldMappingUpdate(field.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lead field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Don't map</SelectItem>
                      {leadFormFields.map((leadField) => (
                        <SelectItem key={leadField} value={leadField}>
                          {leadField}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>
        
        {!isConnected ? (
          <Button onClick={handleConnect} className="w-full">
            <LinkIcon className="mr-2 h-4 w-4" />
            Connect Form
          </Button>
        ) : (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            <span className="text-green-700 font-medium">Form Connected Successfully!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FieldMappingCard;
