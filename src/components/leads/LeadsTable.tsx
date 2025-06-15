
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
import { useNavigate } from 'react-router-dom';
import LeadStatusSelector from './LeadStatusSelector';
import LeadAssignedToSelector from './LeadAssignedToSelector';
import LeadRemarksEditor from './LeadRemarksEditor';
import { Globe } from 'lucide-react';
import { Lead } from './types/leadTypes';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onStatusChange: (leadId: string, newStatus: string) => void;
  onAssignedToChange: (leadId: string, assignedTo: string) => void;
  onRemarksChange: (leadId: string, remarks: string) => void;
  visibleColumns: string[];
}

const LeadsTable = ({ 
  leads, 
  isLoading, 
  onStatusChange, 
  onAssignedToChange, 
  onRemarksChange,
  visibleColumns
}: LeadsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (leadId: string) => {
    navigate(`/leads/${leadId}`);
  };

  return (
    <Card className="bg-white shadow-sm w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
          <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
          <span className="text-primary font-semibold">Leads ({leads.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 lg:p-6">
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading leads...</p>
          </div>
        ) : leads.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.includes('name') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap">Name</TableHead>}
                  {visibleColumns.includes('email') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap">Email</TableHead>}
                  {visibleColumns.includes('phone') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap hidden sm:table-cell">Phone</TableHead>}
                  {visibleColumns.includes('source') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap">Source</TableHead>}
                  {visibleColumns.includes('campaign') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap hidden md:table-cell">Campaign</TableHead>}
                  {visibleColumns.includes('search_keyword') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap hidden md:table-cell">Search Keyword</TableHead>}
                  {visibleColumns.includes('message') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap hidden lg:table-cell">Message</TableHead>}
                  {visibleColumns.includes('created_at') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap hidden lg:table-cell">Created Date</TableHead>}
                  {visibleColumns.includes('updated_at') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap hidden lg:table-cell">Updated Date</TableHead>}
                  {visibleColumns.includes('status') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap">Status</TableHead>}
                  {visibleColumns.includes('assigned_to') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap hidden md:table-cell">Assigned</TableHead>}
                  {visibleColumns.includes('remarks') && <TableHead className="text-gray-700 font-medium text-xs lg:text-sm whitespace-nowrap hidden lg:table-cell">Remarks</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} onClick={() => handleRowClick(lead.id)} className="cursor-pointer hover:bg-blue-100">
                    {visibleColumns.includes('name') && <TableCell className="font-medium text-gray-900 text-xs lg:text-sm">
                      <div className="min-w-0">
                        <div className="truncate">
                          {lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '-'}
                        </div>
                      </div>
                    </TableCell>}
                    {visibleColumns.includes('email') && <TableCell className="text-gray-700 text-xs lg:text-sm">
                      <div className="min-w-0">
                        <div className="truncate">{lead.email || '-'}</div>
                      </div>
                    </TableCell>}
                    {visibleColumns.includes('phone') && <TableCell className="text-gray-700 text-xs lg:text-sm hidden sm:table-cell">
                      {lead.phone || '-'}
                    </TableCell>}
                    {visibleColumns.includes('source') && <TableCell className="text-gray-700 text-xs lg:text-sm">
                      <Badge variant="outline" className="flex items-center gap-1 w-fit text-xs">
                        <Globe className="w-2 h-2 lg:w-3 lg:h-3" />
                        <span className="truncate max-w-[100px]">{lead.source || '-'}</span>
                      </Badge>
                    </TableCell>}
                    {visibleColumns.includes('campaign') && <TableCell className="text-gray-700 text-xs lg:text-sm hidden md:table-cell">
                      <div className="truncate max-w-[120px]">{lead.campaign || '-'}</div>
                    </TableCell>}
                    {visibleColumns.includes('search_keyword') && <TableCell className="text-gray-700 text-xs lg:text-sm hidden md:table-cell">
                      <div className="truncate max-w-[120px]">{lead.search_keyword || '-'}</div>
                    </TableCell>}
                    {visibleColumns.includes('message') && <TableCell className="text-gray-700 text-xs lg:text-sm hidden lg:table-cell">
                      <div className="truncate max-w-[120px]">{lead.message || '-'}</div>
                    </TableCell>}
                    {visibleColumns.includes('created_at') && <TableCell className="text-gray-700 text-xs lg:text-sm hidden lg:table-cell">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </TableCell>}
                    {visibleColumns.includes('updated_at') && <TableCell className="text-gray-700 text-xs lg:text-sm hidden lg:table-cell">
                      {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString() : '-'}
                    </TableCell>}
                    {visibleColumns.includes('status') && <TableCell onClick={(e) => e.stopPropagation()}>
                      <LeadStatusSelector
                        status={lead.status}
                        leadId={lead.id}
                        onStatusChange={onStatusChange}
                      />
                    </TableCell>}
                    {visibleColumns.includes('assigned_to') && <TableCell className="hidden md:table-cell" onClick={(e) => e.stopPropagation()}>
                      <LeadAssignedToSelector
                        assignedTo={lead.assigned_to}
                        leadId={lead.id}
                        onAssignedToChange={onAssignedToChange}
                      />
                    </TableCell>}
                    {visibleColumns.includes('remarks') && <TableCell className="hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                      <LeadRemarksEditor
                        remarks={lead.remarks}
                        leadId={lead.id}
                        onRemarksChange={onRemarksChange}
                      />
                    </TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 px-4">
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
