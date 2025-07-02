import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useConnectedForms } from '@/hooks/useConnectedForms';
import { Lead, Filters } from '../types/leadTypes';

export const useLeadFiltering = (leads: Lead[], filters: Filters, selectedWebsite?: string) => {
  const { user } = useAuth();
  const { connectedForms } = useConnectedForms();
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  const applyFilters = useCallback(async () => {
    if (!user) return;
    
    let filtered = [...leads];
    console.log('Starting filter process with', filtered.length, 'leads');
    console.log('Current filters:', filters);
    console.log('Selected website:', selectedWebsite);

    // Apply global website filter first
    if (selectedWebsite && selectedWebsite !== 'All') {
      filtered = filtered.filter(lead => {
        const form = connectedForms.find(f => f.form_id === lead.form_id);
        const leadWebsite = form?.website_url || lead.source;
        return leadWebsite === selectedWebsite;
      });
      console.log('After global website filter:', filtered.length, 'leads');
    }

    // Apply source filter
    if (filters.source && filters.source !== 'All') {
      if (filters.source === 'Instagram' || filters.source === 'Facebook Messenger' || filters.source === 'WhatsApp') {
        // Filter by social media sources
        filtered = filtered.filter(lead => lead.source === filters.source);
        console.log('After social media source filter:', filtered.length, 'leads');
      } else {
        // Filter by website source (form-based)
        try {
          const { data: forms, error: formsError } = await supabase
            .from('connected_forms')
            .select('form_id')
            .eq('user_id', user.id)
            .eq('website_url', filters.source);
          
          if (formsError) {
            console.error('Error fetching forms for source:', formsError);
          } else {
            const formIds = forms ? forms.map(f => f.form_id) : [];
            console.log('Form IDs for source', filters.source, ':', formIds);
            
            if (formIds.length > 0) {
              filtered = filtered.filter(lead => 
                formIds.includes(lead.form_id)
              );
              console.log('After website source filter (by form_id):', filtered.length, 'leads');
            } else {
              console.log('No forms found for source, showing 0 leads');
              filtered = [];
            }
          }
        } catch (error) {
          console.error('Error filtering by source:', error);
        }
      }
    }

    // Apply status filter
    if (filters.status && filters.status !== 'All') {
      filtered = filtered.filter(lead => lead.status === filters.status);
      console.log('After status filter:', filtered.length, 'leads');
    }

    // Apply assigned to filter
    if (filters.assignedTo && filters.assignedTo !== 'All') {
      if (filters.assignedTo === 'Unassigned') {
        filtered = filtered.filter(lead => !lead.assigned_to);
      } else {
        filtered = filtered.filter(lead => lead.assigned_to === filters.assignedTo);
      }
      console.log('After assigned filter:', filtered.length, 'leads');
    }

    console.log('Final filtered leads:', filtered.length, 'from total:', leads.length);
    setFilteredLeads(filtered);
  }, [leads, filters, selectedWebsite, user, connectedForms]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return { filteredLeads, applyFilters };
};