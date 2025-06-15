
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
        } else {
          const formIds = forms ? forms.map(f => f.form_id) : [];
          console.log('Form IDs for website', filters.website, ':', formIds);
          
          if (formIds.length > 0) {
            filtered = filtered.filter(lead => formIds.includes(lead.form_id));
          } else {
            // No forms found for this website, so no leads should be shown
            filtered = [];
          }
        }
      } catch (error) {
        console.error('Error filtering by website:', error);
      }
    }

    // Apply status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Apply assigned to filter
    if (filters.assignedTo !== 'All') {
      if (filters.assignedTo === 'Unassigned') {
        filtered = filtered.filter(lead => !lead.assigned_to);
      } else {
        filtered = filtered.filter(lead => lead.assigned_to === filters.assignedTo);
      }
    }

    console.log('Filtered leads:', filtered.length, 'from total:', leads.length);
    setFilteredLeads(filtered);
  }, [leads, filters, user]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return { filteredLeads };
};
