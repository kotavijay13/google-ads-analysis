
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { WebsiteForm, FieldMapping } from '@/components/forms/types';

export interface ConnectedForm {
  id: string;
  form_id: string;
  form_name: string;
  form_url: string;
  website_url: string;
  field_mappings: FieldMapping[];
  created_at: string;
}

export const useConnectedForms = () => {
  const { user } = useAuth();
  const [connectedForms, setConnectedForms] = useState<ConnectedForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConnectedForms = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('connected_forms')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching connected forms:', error);
        return;
      }

      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        field_mappings: Array.isArray(item.field_mappings) ? item.field_mappings as FieldMapping[] : []
      }));

      setConnectedForms(transformedData);
    } catch (error) {
      console.error('Error in fetchConnectedForms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConnectedForm = async (form: WebsiteForm, fieldMappings: FieldMapping[], websiteUrl: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('connected_forms')
        .insert({
          user_id: user.id,
          form_id: form.id,
          form_name: form.name,
          form_url: form.url,
          website_url: websiteUrl,
          field_mappings: fieldMappings as any // Cast to any to handle Json type
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving connected form:', error);
        throw error;
      }

      await fetchConnectedForms();
      return data;
    } catch (error) {
      console.error('Error in saveConnectedForm:', error);
      throw error;
    }
  };

  const deleteConnectedForm = async (formId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('connected_forms')
        .delete()
        .eq('id', formId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting connected form:', error);
        throw error;
      }

      await fetchConnectedForms();
    } catch (error) {
      console.error('Error in deleteConnectedForm:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchConnectedForms();
  }, [user]);

  return {
    connectedForms,
    isLoading,
    fetchConnectedForms,
    saveConnectedForm,
    deleteConnectedForm
  };
};
