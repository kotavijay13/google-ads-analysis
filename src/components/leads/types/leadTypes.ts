
export interface Lead {
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
  updated_at: string;
  form_id: string;
  search_keyword: string | null;
}

export interface Filters {
  status: string;
  assignedTo: string;
  website: string;
}

export interface UseLeadsDataReturn {
  leads: Lead[];
  filteredLeads: Lead[];
  isLoading: boolean;
  fetchLeadsData: () => void;
  handleStatusChange: (leadId: string, newStatus: string) => void;
  handleAssignedToChange: (leadId: string, assignedTo: string) => void;
  handleRemarksChange: (leadId: string, remarks: string) => void;
}
