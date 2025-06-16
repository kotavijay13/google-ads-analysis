
export interface Lead {
  id: string;
  user_id: string;
  form_id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  campaign?: string;
  status: string;
  assigned_to?: string;
  remarks?: string;
  search_keyword?: string;
  raw_data?: any;
  created_at: string;
  updated_at: string;
}

export interface Filters {
  status: string;
  assignedTo: string;
  source: string;
}

export interface UseLeadsDataReturn {
  leads: Lead[];
  filteredLeads: Lead[];
  isLoading: boolean;
  fetchLeadsData: () => void;
  handleStatusChange: (leadId: string, newStatus: string) => void;
  handleAssignedToChange: (leadId: string, assignedTo: string) => void;
  handleRemarksChange: (leadId: string, remarks: string) => void;
  applyFilters: () => void;
}
