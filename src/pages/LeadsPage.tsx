
import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DateRangePicker from '@/components/DateRangePicker';
import DownloadButton from '@/components/seo/DownloadButton';
import LeadFilters from '@/components/leads/LeadFilters';
import LeadAdmin from '@/components/leads/LeadAdmin';
import LeadsStatsCards from '@/components/leads/LeadsStatsCards';
import LeadsTable from '@/components/leads/LeadsTable';
import { useLeadsData } from '@/components/leads/hooks/useLeadsData';
import { useAuth } from '@/context/AuthContext';

const LeadsPage = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const [filters, setFilters] = useState({
    status: 'All',
    assignedTo: 'All'
  });

  const {
    leads,
    filteredLeads,
    isLoading,
    fetchLeadsData,
    handleStatusChange,
    handleAssignedToChange,
    handleRemarksChange
  } = useLeadsData(dateRange, filters);

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
      
      <LeadsStatsCards
        totalLeads={totalLeads}
        conversionRate={conversionRate}
        costPerLead={costPerLead}
        averageValue={averageValue}
        dateRange={dateRange}
      />

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
          <LeadsTable
            leads={filteredLeads}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
            onAssignedToChange={handleAssignedToChange}
            onRemarksChange={handleRemarksChange}
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
    </div>
  );
};

export default LeadsPage;
