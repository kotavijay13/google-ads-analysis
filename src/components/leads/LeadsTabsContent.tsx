
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeadAdmin from '@/components/leads/LeadAdmin';
import LeadsTable from '@/components/leads/LeadsTable';

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

interface LeadsTabsContentProps {
  filteredLeads: Lead[];
  isLoading: boolean;
  onStatusChange: (leadId: string, newStatus: string) => void;
  onAssignedToChange: (leadId: string, assignedTo: string) => void;
  onRemarksChange: (leadId: string, remarks: string) => void;
}

const LeadsTabsContent = ({ 
  filteredLeads, 
  isLoading, 
  onStatusChange, 
  onAssignedToChange, 
  onRemarksChange 
}: LeadsTabsContentProps) => {
  return (
    <Tabs defaultValue="leads" className="space-y-6">
      <TabsList>
        <TabsTrigger value="leads">Leads</TabsTrigger>
      </TabsList>

      <TabsContent value="leads">
        <LeadsTable
          leads={filteredLeads}
          isLoading={isLoading}
          onStatusChange={onStatusChange}
          onAssignedToChange={onAssignedToChange}
          onRemarksChange={onRemarksChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LeadsTabsContent;
