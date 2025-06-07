
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import WebsiteScanner from './forms/WebsiteScanner';
import DetectedFormsList from './forms/DetectedFormsList';
import FieldMappingCard from './forms/FieldMappingCard';
import ConnectedFormsList from './forms/ConnectedFormsList';
import { WebsiteForm, FieldMapping } from './forms/types';
import { useConnectedForms } from '@/hooks/useConnectedForms';
import { useAuth } from '@/context/AuthContext';

const WebsiteFormConnector = () => {
  const { user } = useAuth();
  const { connectedForms, isLoading, saveConnectedForm, deleteConnectedForm } = useConnectedForms();
  const [detectedForms, setDetectedForms] = useState<WebsiteForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<WebsiteForm | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleFormsDetected = (forms: WebsiteForm[], url: string) => {
    setDetectedForms(forms);
    setWebsiteUrl(url);
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

  const connectForm = async () => {
    if (!selectedForm || !user) return;
    
    const mappedFields = fieldMappings.filter(mapping => mapping.leadField && mapping.leadField !== 'none');
    
    if (mappedFields.length === 0) {
      toast.error("Please map at least one field");
      return;
    }

    try {
      await saveConnectedForm(selectedForm, fieldMappings, websiteUrl);
      toast.success(`Connected ${selectedForm.name} successfully!`);
      
      // Show webhook URL to user
      const webhookUrl = `${window.location.origin}/functions/v1/form-webhook`;
      toast.success(`Webhook URL: ${webhookUrl}`, {
        duration: 10000,
        description: 'Add this URL to your form submission handler'
      });
      
      // Reset form selection
      setSelectedForm(null);
      setFieldMappings([]);
      setDetectedForms([]);
    } catch (error) {
      console.error('Error connecting form:', error);
      toast.error('Failed to connect form');
    }
  };

  const disconnectForm = async (formId: string) => {
    try {
      await deleteConnectedForm(formId);
      toast.success("Form disconnected");
    } catch (error) {
      console.error('Error disconnecting form:', error);
      toast.error('Failed to disconnect form');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please log in to manage form connections.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConnectedFormsList 
        connectedForms={connectedForms}
        isLoading={isLoading}
        onDisconnect={disconnectForm}
      />
      
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
          isConnected={false}
          onFieldMappingUpdate={updateFieldMapping}
          onConnect={connectForm}
          onDisconnect={() => {}}
        />
      )}
    </div>
  );
};

export default WebsiteFormConnector;
