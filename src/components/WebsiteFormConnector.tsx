
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import WebsiteScanner from './forms/WebsiteScanner';
import DetectedFormsList from './forms/DetectedFormsList';
import FieldMappingCard from './forms/FieldMappingCard';
import { WebsiteForm, FieldMapping } from './forms/types';

const WebsiteFormConnector = () => {
  const [detectedForms, setDetectedForms] = useState<WebsiteForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<WebsiteForm | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleFormsDetected = (forms: WebsiteForm[]) => {
    setDetectedForms(forms);
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
      <WebsiteScanner onFormsDetected={handleFormsDetected} />
      
      {detectedForms.length > 0 && (
        <div className="space-y-4">
          <DetectedFormsList
            forms={detectedForms}
            selectedForm={selectedForm}
            onFormSelect={selectForm}
          />
        </div>
      )}

      {selectedForm && (
        <FieldMappingCard
          selectedForm={selectedForm}
          fieldMappings={fieldMappings}
          isConnected={isConnected}
          onFieldMappingUpdate={updateFieldMapping}
          onConnect={connectForm}
          onDisconnect={disconnectForm}
        />
      )}
    </div>
  );
};

export default WebsiteFormConnector;
