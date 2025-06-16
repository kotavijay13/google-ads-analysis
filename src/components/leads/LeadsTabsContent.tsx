
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeadAdmin from '@/components/leads/LeadAdmin';
import LeadsTable from '@/components/leads/LeadsTable';
import { Lead } from './types/leadTypes';

interface LeadsTabsContentProps {
  filteredLeads: (Lead & { website_url?: string | null })[];
  isLoading: boolean;
  onStatusChange: (leadId: string, newStatus: string) => void;
  onAssignedToChange: (leadId: string, assignedTo: string) => void;
  onRemarksChange: (leadId: string, remarks: string) => void;
  visibleColumns: string[];
}

const LeadsTabsContent = ({ 
  filteredLeads, 
  isLoading, 
  onStatusChange, 
  onAssignedToChange, 
  onRemarksChange,
  visibleColumns
}: LeadsTabsContentProps) => {
  return (
    <Tabs defaultValue="leads" className="space-y-3">
      <TabsList>
        <TabsTrigger value="leads">Leads</TabsTrigger>
      </TabsList>

      <TabsContent value="leads" className="mt-2">
        <LeadsTable
          leads={filteredLeads}
          isLoading={isLoading}
          onStatusChange={onStatusChange}
          onAssignedToChange={onAssignedToChange}
          onRemarksChange={onRemarksChange}
          visibleColumns={visibleColumns}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LeadsTabsContent;
