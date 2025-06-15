
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Lead } from '../types/leadTypes';

export const useLeadOperations = () => {
  const { user } = useAuth();

  const handleStatusChange = async (leadId: string, newStatus: string, setLeads: React.Dispatch<React.SetStateAction<Lead[]>>) => {
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

  const handleAssignedToChange = async (leadId: string, assignedTo: string, setLeads: React.Dispatch<React.SetStateAction<Lead[]>>) => {
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

  const handleRemarksChange = async (leadId: string, remarks: string, setLeads: React.Dispatch<React.SetStateAction<Lead[]>>) => {
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

  return {
    handleStatusChange,
    handleAssignedToChange,
    handleRemarksChange
  };
};
