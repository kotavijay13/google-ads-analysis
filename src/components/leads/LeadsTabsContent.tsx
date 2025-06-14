
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <TabsTrigger value="admin">Lead Administration</TabsTrigger>
        <TabsTrigger value="performance">Campaign Performance</TabsTrigger>
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

      <TabsContent value="admin">
        <LeadAdmin />
      </TabsContent>

      <TabsContent value="performance">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <p className="text-gray-500">No campaign performance data available</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default LeadsTabsContent;
