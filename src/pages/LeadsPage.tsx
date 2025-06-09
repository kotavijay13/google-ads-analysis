
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DateRangePicker from '@/components/DateRangePicker';
import DownloadButton from '@/components/seo/DownloadButton';
import LeadFilters from '@/components/leads/LeadFilters';
import LeadStatusSelector from '@/components/leads/LeadStatusSelector';
import LeadAssignedToSelector from '@/components/leads/LeadAssignedToSelector';
import LeadRemarksEditor from '@/components/leads/LeadRemarksEditor';
import LeadAdmin from '@/components/leads/LeadAdmin';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

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

const LeadsPage = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'All',
    assignedTo: 'All'
  });

  useEffect(() => {
    console.log('Initial Leads data fetch with date range:', { from: dateRange.from, to: dateRange.to });
    fetchLeadsData();
  }, [dateRange, user]);

  useEffect(() => {
    applyFilters();
  }, [leads, filters]);

  const fetchLeadsData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast.error('Failed to fetch leads');
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    if (filters.status !== 'All') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    if (filters.assignedTo !== 'All') {
      if (filters.assignedTo === 'Unassigned') {
        filtered = filtered.filter(lead => !lead.assigned_to);
      } else {
        filtered = filtered.filter(lead => lead.assigned_to === filters.assignedTo);
      }
    }

    setFilteredLeads(filtered);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
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

      // Update local state
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      
      toast.success('Lead status updated successfully');
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Failed to update lead status');
    }
  };

  const handleAssignedToChange = async (leadId: string, assignedTo: string) => {
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

      // Update local state
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, assigned_to: assignedTo || null } : lead
      ));
      
      toast.success('Lead assignment updated successfully');
    } catch (error) {
      console.error('Error updating lead assignment:', error);
      toast.error('Failed to update lead assignment');
    }
  };

  const handleRemarksChange = async (leadId: string, remarks: string) => {
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

      // Update local state
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, remarks: remarks } : lead
      ));
      
      toast.success('Remarks updated successfully');
    } catch (error) {
      console.error('Error updating lead remarks:', error);
      toast.error('Failed to update lead remarks');
    }
  };

  const handleRefresh = () => {
    fetchLeadsData();
  };

  const handleDateChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };

  const handleDateRangeFilter = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleAssignedToFilter = (assignedTo: string) => {
    setFilters(prev => ({ ...prev, assignedTo }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'All',
      assignedTo: 'All'
    });
    setDateRange({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date()
    });
  };

  // Calculate stats from filtered data
  const totalLeads = filteredLeads.length;
  const conversionRate = 0; // This would be calculated based on traffic data
  const costPerLead = 0; // This would be calculated based on campaign spend
  const averageValue = 0; // This would be calculated based on deal values

  // Prepare data for export
  const exportData = filteredLeads.map(lead => ({
    Name: lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '-',
    Email: lead.email || '-',
    Phone: lead.phone || '-',
    Company: lead.company || '-',
    Source: lead.source || '-',
    Campaign: lead.campaign || '-',
    Status: lead.status,
    'Assigned To': lead.assigned_to || 'Unassigned',
    'Created Date': new Date(lead.created_at).toLocaleDateString(),
    Message: lead.message || '-',
    Remarks: lead.remarks || '-'
  }));

  if (!user) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please log in to view your leads.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Leads Dashboard" />
      
      {/* Stats Cards - Moved to Top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalLeads}</div>
            <p className="text-xs text-gray-500 mt-1">
              {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">From total traffic</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cost Per Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${costPerLead.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Average acquisition cost</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${averageValue}</div>
            <p className="text-xs text-gray-500 mt-1">Per qualified lead</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <LeadFilters
          onDateRangeChange={handleDateRangeFilter}
          onStatusFilter={handleStatusFilter}
          onAssignedToFilter={handleAssignedToFilter}
          onReset={handleResetFilters}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium text-gray-900">Leads Overview</h2>
        <div className="flex gap-2">
          <DateRangePicker onDateChange={handleDateChange} />
          <DownloadButton 
            data={exportData}
            filename="leads-export"
            title="Leads Report"
            disabled={filteredLeads.length === 0}
          />
        </div>
      </div>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="admin">Lead Administration</TabsTrigger>
          <TabsTrigger value="performance">Campaign Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Leads ({filteredLeads.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Loading leads...</p>
                </div>
              ) : filteredLeads.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-700 font-medium">Name</TableHead>
                      <TableHead className="text-gray-700 font-medium">Email</TableHead>
                      <TableHead className="text-gray-700 font-medium">Phone</TableHead>
                      <TableHead className="text-gray-700 font-medium">Source</TableHead>
                      <TableHead className="text-gray-700 font-medium">Campaign</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Status</TableHead>
                      <TableHead className="text-gray-700 font-medium">Assigned To</TableHead>
                      <TableHead className="text-gray-700 font-medium">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">
                          {lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '-'}
                        </TableCell>
                        <TableCell className="text-gray-700">{lead.email || '-'}</TableCell>
                        <TableCell className="text-gray-700">{lead.phone || '-'}</TableCell>
                        <TableCell className="text-gray-700">{lead.source || '-'}</TableCell>
                        <TableCell className="text-gray-700">{lead.campaign || '-'}</TableCell>
                        <TableCell className="text-gray-700">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <LeadStatusSelector
                            status={lead.status}
                            leadId={lead.id}
                            onStatusChange={handleStatusChange}
                          />
                        </TableCell>
                        <TableCell>
                          <LeadAssignedToSelector
                            assignedTo={lead.assigned_to}
                            leadId={lead.id}
                            onAssignedToChange={handleAssignedToChange}
                          />
                        </TableCell>
                        <TableCell>
                          <LeadRemarksEditor
                            remarks={lead.remarks}
                            leadId={lead.id}
                            onRemarksChange={handleRemarksChange}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No leads data available</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Connect your forms and campaigns to start collecting leads
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
    </div>
  );
};

export default LeadsPage;
