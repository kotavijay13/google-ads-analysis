
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

    // Apply website filter first by getting form IDs for the selected website
    if (filters.website && filters.website !== 'All') {
      try {
        const { data: forms, error: formsError } = await supabase
          .from('connected_forms')
          .select('form_id')
          .eq('user_id', user.id)
          .eq('website_url', filters.website);
        
        if (formsError) {
          console.error('Error fetching forms for website:', formsError);
          // If there's an error, show no leads for this website filter
          filtered = [];
        } else {
          const formIds = forms ? forms.map(f => f.form_id) : [];
          console.log('Form IDs for website', filters.website, ':', formIds);
          
          if (formIds.length > 0) {
            // Filter leads by form_id - only show leads that match the form IDs for this website
            filtered = filtered.filter(lead => 
              formIds.includes(lead.form_id)
            );
            console.log('After website filter (by form_id):', filtered.length, 'leads');
          } else {
            // No forms found for this website, so no leads should be shown
            console.log('No forms found for website, showing 0 leads');
            filtered = [];
          }
        }
      } catch (error) {
        console.error('Error filtering by website:', error);
        // On error, show no leads to be safe
        filtered = [];
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
