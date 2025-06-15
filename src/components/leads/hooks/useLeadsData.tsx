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

  const { handleStatusChange: statusChange, handleAssignedToChange: assignedToChange } = useLeadOperations();
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

  const handleRemarksChange = async (leadId: string, remarks: string) => {
    if (!user) {
      toast.error('You must be logged in to add remarks.');
      return;
    }

    try {
      // 1. Insert new remark into lead_remarks table
      const { error: remarkError } = await supabase
        .from('lead_remarks')
        .insert({
          lead_id: leadId,
          remark: remarks,
          user_id: user.id
        });

      if (remarkError) throw remarkError;

      // 2. Update the main lead entry with the latest remark and updated_at timestamp
      const updated_at = new Date().toISOString();
      const { data: updatedLead, error: leadError } = await supabase
        .from('leads')
        .update({ remarks, updated_at })
        .eq('id', leadId)
        .select()
        .single();
      
      if (leadError) throw leadError;

      // 3. Update local state
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, ...updatedLead } : lead
        )
      );
      toast.success('Remark added successfully.');
    } catch (error: any) {
      console.error('Error adding remark:', error);
      toast.error(error.message || 'Failed to add remark.');
    }
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
