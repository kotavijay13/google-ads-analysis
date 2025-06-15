
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Lead, Filters, UseLeadsDataReturn } from '../types/leadTypes';
import { useLeadOperations } from './useLeadOperations';
import { useLeadFiltering } from './useLeadFiltering';

export const useLeadsData = (
  dateRange: { from: Date; to: Date },
  filters: Filters
): UseLeadsDataReturn => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleStatusChange: statusChange, handleAssignedToChange: assignedToChange, handleRemarksChange: remarksChange } = useLeadOperations();
  const { filteredLeads } = useLeadFiltering(leads, filters);

  const fetchLeadsData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('Fetching leads for user:', user.id);
      console.log('Date range:', dateRange.from.toISOString(), 'to', dateRange.to.toISOString());
      
      let query = supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast.error('Failed to fetch leads');
        return;
      }

      console.log('Fetched leads from database:', data?.length || 0);
      console.log('Sample lead data:', data?.[0]);
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [user, dateRange.from, dateRange.to]);

  const handleStatusChange = (leadId: string, newStatus: string) => {
    statusChange(leadId, newStatus, setLeads);
  };

  const handleAssignedToChange = (leadId: string, assignedTo: string) => {
    assignedToChange(leadId, assignedTo, setLeads);
  };

  const handleRemarksChange = (leadId: string, remarks: string) => {
    remarksChange(leadId, remarks, setLeads);
  };

  useEffect(() => {
    fetchLeadsData();
  }, [fetchLeadsData]);

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
