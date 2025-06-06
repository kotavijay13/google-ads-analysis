
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { WebsiteForm } from './types';

interface DetectedFormsListProps {
  forms: WebsiteForm[];
  selectedForm: WebsiteForm | null;
  onFormSelect: (form: WebsiteForm) => void;
}

const DetectedFormsList = ({ forms, selectedForm, onFormSelect }: DetectedFormsListProps) => {
  if (forms.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Detected Forms</h4>
      <div className="grid gap-3">
        {forms.map((form) => (
          <div 
            key={form.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedForm?.id === form.id 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onFormSelect(form)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">{form.name}</h5>
                <p className="text-sm text-muted-foreground">{form.url}</p>
                <div className="flex gap-1 mt-2">
                  {form.fields.map((field) => (
                    <Badge key={field.name} variant="secondary" className="text-xs">
                      {field.name}
                    </Badge>
                  ))}
                </div>
              </div>
              {selectedForm?.id === form.id && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetectedFormsList;
