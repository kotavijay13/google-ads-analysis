
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Lead, Filters } from '../types/leadTypes';

export const useLeadFiltering = (leads: Lead[], filters: Filters) => {
  const { user } = useAuth();
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  const applyFilters = useCallback(async () => {
    if (!user) return;
    
    let filtered = [...leads];
    console.log('Starting filter process with', filtered.length, 'leads');
    console.log('Current filters:', filters);

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
            filtered = [];
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
          filtered = [];
        }
      }
    }

    // Apply status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(lead => lead.status === filters.status);
      console.log('After status filter:', filtered.length, 'leads');
    }

    // Apply assigned to filter
    if (filters.assignedTo !== 'All') {
      if (filters.assignedTo === 'Unassigned') {
        filtered = filtered.filter(lead => !lead.assigned_to);
      } else {
        filtered = filtered.filter(lead => lead.assigned_to === filters.assignedTo);
      }
      console.log('After assigned filter:', filtered.length, 'leads');
    }

    console.log('Final filtered leads:', filtered.length, 'from total:', leads.length);
    setFilteredLeads(filtered);
  }, [leads, filters, user]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return { filteredLeads };
};
