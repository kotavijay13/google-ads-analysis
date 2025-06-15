
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import LeadStatusSelector from './LeadStatusSelector';
import LeadAssignedToSelector from './LeadAssignedToSelector';
import LeadRemarksEditor from './LeadRemarksEditor';
import { Globe } from 'lucide-react';

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

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onStatusChange: (leadId: string, newStatus: string) => void;
  onAssignedToChange: (leadId: string, assignedTo: string) => void;
  onRemarksChange: (leadId: string, remarks: string) => void;
}

const LeadsTable = ({ 
  leads, 
  isLoading, 
  onStatusChange, 
  onAssignedToChange, 
  onRemarksChange 
}: LeadsTableProps) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Leads ({leads.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading leads...</p>
          </div>
        ) : leads.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 font-medium">Name</TableHead>
                  <TableHead className="text-gray-700 font-medium">Email</TableHead>
                  <TableHead className="text-gray-700 font-medium">Phone</TableHead>
                  <TableHead className="text-gray-700 font-medium">Website Source</TableHead>
                  <TableHead className="text-gray-700 font-medium">Campaign</TableHead>
                  <TableHead className="text-gray-700 font-medium">Date</TableHead>
                  <TableHead className="text-gray-700 font-medium">Status</TableHead>
                  <TableHead className="text-gray-700 font-medium">Assigned To</TableHead>
                  <TableHead className="text-gray-700 font-medium">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                      {lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '-'}
                    </TableCell>
                    <TableCell className="text-gray-700">{lead.email || '-'}</TableCell>
                    <TableCell className="text-gray-700">{lead.phone || '-'}</TableCell>
                    <TableCell className="text-gray-700">
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <Globe className="w-3 h-3" />
                        {lead.source || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">{lead.campaign || '-'}</TableCell>
                    <TableCell className="text-gray-700">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <LeadStatusSelector
                        status={lead.status}
                        leadId={lead.id}
                        onStatusChange={onStatusChange}
                      />
                    </TableCell>
                    <TableCell>
                      <LeadAssignedToSelector
                        assignedTo={lead.assigned_to}
                        leadId={lead.id}
                        onAssignedToChange={onAssignedToChange}
                      />
                    </TableCell>
                    <TableCell>
                      <LeadRemarksEditor
                        remarks={lead.remarks}
                        leadId={lead.id}
                        onRemarksChange={onRemarksChange}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10">
            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No leads data available</p>
            <p className="text-sm text-gray-400 mt-2">
              Connect your forms and campaigns to start collecting leads
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsTable;
