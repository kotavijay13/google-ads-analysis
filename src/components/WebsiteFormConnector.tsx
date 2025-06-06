
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Globe, Link as LinkIcon, CheckCircle, X } from 'lucide-react';

interface WebsiteForm {
  id: string;
  name: string;
  url: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
}

interface FieldMapping {
  websiteField: string;
  leadField: string;
}

const leadFormFields = [
  'name',
  'firstName',
  'lastName', 
  'email',
  'phone',
  'company',
  'message',
  'source',
  'campaign'
];

const WebsiteFormConnector = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedForms, setDetectedForms] = useState<WebsiteForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<WebsiteForm | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const scanWebsiteForms = async () => {
    if (!websiteUrl) {
      toast.error("Please enter a website URL");
      return;
    }

    setIsScanning(true);
    
    // Simulate form detection (in real implementation, this would scan the website)
    setTimeout(() => {
      const mockForms: WebsiteForm[] = [
        {
          id: 'contact-form',
          name: 'Contact Form',
          url: `${websiteUrl}/contact`,
          fields: [
            { name: 'full_name', type: 'text', required: true },
            { name: 'email_address', type: 'email', required: true },
            { name: 'phone_number', type: 'tel', required: false },
            { name: 'message', type: 'textarea', required: true }
          ]
        },
        {
          id: 'newsletter-form',
          name: 'Newsletter Signup',
          url: `${websiteUrl}/newsletter`,
          fields: [
            { name: 'email', type: 'email', required: true },
            { name: 'first_name', type: 'text', required: false }
          ]
        }
      ];
      
      setDetectedForms(mockForms);
      setIsScanning(false);
      toast.success(`Found ${mockForms.length} forms on the website`);
    }, 2000);
  };

  const selectForm = (form: WebsiteForm) => {
    setSelectedForm(form);
    // Auto-suggest field mappings based on field names
    const autoMappings: FieldMapping[] = form.fields.map(field => {
      let suggestedMapping = 'none';
      
      if (field.name.toLowerCase().includes('name') && !field.name.toLowerCase().includes('first') && !field.name.toLowerCase().includes('last')) {
        suggestedMapping = 'name';
      } else if (field.name.toLowerCase().includes('first')) {
        suggestedMapping = 'firstName';
      } else if (field.name.toLowerCase().includes('last')) {
        suggestedMapping = 'lastName';
      } else if (field.name.toLowerCase().includes('email')) {
        suggestedMapping = 'email';
      } else if (field.name.toLowerCase().includes('phone')) {
        suggestedMapping = 'phone';
      } else if (field.name.toLowerCase().includes('company')) {
        suggestedMapping = 'company';
      } else if (field.name.toLowerCase().includes('message')) {
        suggestedMapping = 'message';
      }
      
      return {
        websiteField: field.name,
        leadField: suggestedMapping
      };
    });
    
    setFieldMappings(autoMappings);
  };

  const updateFieldMapping = (websiteField: string, leadField: string) => {
    setFieldMappings(prev => 
      prev.map(mapping => 
        mapping.websiteField === websiteField 
          ? { ...mapping, leadField }
          : mapping
      )
    );
  };

  const connectForm = () => {
    if (!selectedForm) return;
    
    const mappedFields = fieldMappings.filter(mapping => mapping.leadField && mapping.leadField !== 'none');
    
    if (mappedFields.length === 0) {
      toast.error("Please map at least one field");
      return;
    }
    
    // In real implementation, this would set up the webhook/integration
    setIsConnected(true);
    toast.success(`Connected ${selectedForm.name} successfully!`);
    console.log('Form connected with mappings:', mappedFields);
  };

  const disconnectForm = () => {
    setIsConnected(false);
    setSelectedForm(null);
    setFieldMappings([]);
    toast.success("Form disconnected");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Connect Website Forms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                placeholder="https://yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={scanWebsiteForms} 
                disabled={isScanning}
                className="min-w-[120px]"
              >
                {isScanning ? "Scanning..." : "Scan Forms"}
              </Button>
            </div>
          </div>
          
          {detectedForms.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Detected Forms</h4>
              <div className="grid gap-3">
                {detectedForms.map((form) => (
                  <div 
                    key={form.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedForm?.id === form.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => selectForm(form)}
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
          )}
        </CardContent>
      </Card>

      {selectedForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Field Mapping - {selectedForm.name}</span>
              {isConnected && (
                <Button variant="outline" size="sm" onClick={disconnectForm}>
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
                        onValueChange={(value) => updateFieldMapping(field.name, value)}
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
              <Button onClick={connectForm} className="w-full">
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
      )}
    </div>
  );
};

export default WebsiteFormConnector;
