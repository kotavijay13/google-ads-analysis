import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface Lead {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  source: string;
  campaign: string;
  status: string;
  assigned_to: string | null;
  remarks: string | null;
  created_at: string;
}

interface UseLeadsDataReturn {
  leads: Lead[];
  filteredLeads: Lead[];
  isLoading: boolean;
  fetchLeadsData: () => void;
  handleStatusChange: (leadId: string, newStatus: string) => void;
  handleAssignedToChange: (leadId: string, assignedTo: string) => void;
  handleRemarksChange: (leadId: string, remarks: string) => void;
}

interface Filters {
  status: string;
  assignedTo: string;
  website: string;
}

export const useLeadsData = (
  dateRange: { from: Date; to: Date },
  filters: Filters
): UseLeadsDataReturn => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeadsData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (filters.website && filters.website !== 'All') {
        const { data: forms, error: formsError } = await supabase
          .from('connected_forms')
          .select('form_id')
          .eq('user_id', user.id)
          .eq('website_url', filters.website);
        
        if (formsError) {
          console.error('Error fetching forms for website:', formsError);
          toast.error('Failed to filter by website.');
        }

        const formIds = forms ? forms.map(f => f.form_id) : [];

        if (formIds.length > 0) {
          query = query.in('form_id', formIds);
        } else {
          setLeads([]);
          setIsLoading(false);
          return;
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast.error('Failed to fetch leads');
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [user, dateRange.from, dateRange.to, filters.website]);

  const applyFilters = () => {
    let filtered = [...leads];

    if (filters.status !== 'All') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    if (filters.assignedTo !== 'All') {
      if (filters.assignedTo === 'Unassigned') {
        filtered = filtered.filter(lead => !lead.assigned_to);
      } else {
        filtered = filtered.filter(lead => lead.assigned_to === filters.assignedTo);
      }
    }

    setFilteredLeads(filtered);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating lead status:', error);
        toast.error('Failed to update lead status');
        return;
      }

      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      
      toast.success('Lead status updated successfully');
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Failed to update lead status');
    }
  };

  const handleAssignedToChange = async (leadId: string, assignedTo: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ assigned_to: assignedTo || null })
        .eq('id', leadId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating lead assignment:', error);
        toast.error('Failed to update lead assignment');
        return;
      }

      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, assigned_to: assignedTo || null } : lead
      ));
      
      toast.success('Lead assignment updated successfully');
    } catch (error) {
      console.error('Error updating lead assignment:', error);
      toast.error('Failed to update lead assignment');
    }
  };

  const handleRemarksChange = async (leadId: string, remarks: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ remarks: remarks })
        .eq('id', leadId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating lead remarks:', error);
        toast.error('Failed to update lead remarks');
        return;
      }

      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, remarks: remarks } : lead
      ));
      
      toast.success('Remarks updated successfully');
    } catch (error) {
      console.error('Error updating lead remarks:', error);
      toast.error('Failed to update lead remarks');
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, [fetchLeadsData]);

  useEffect(() => {
    applyFilters();
  }, [leads, filters]);

  return {
    leads,
    filteredLeads,
    isLoading,
    fetchLeadsData,
    handleStatusChange,
    handleAssignedToChange,
    handleRemarksChange
  };
};
