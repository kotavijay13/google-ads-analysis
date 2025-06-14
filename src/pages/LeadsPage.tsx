
import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateRangePicker from '@/components/DateRangePicker';
import DownloadButton from '@/components/seo/DownloadButton';
import LeadFilters from '@/components/leads/LeadFilters';
import LeadAdmin from '@/components/leads/LeadAdmin';
import LeadsStatsCards from '@/components/leads/LeadsStatsCards';
import LeadsTable from '@/components/leads/LeadsTable';
import { useLeadsData } from '@/components/leads/hooks/useLeadsData';
import { useAuth } from '@/context/AuthContext';
import { useConnectedForms } from '@/hooks/useConnectedForms';
import { Globe } from 'lucide-react';

const LeadsPage = () => {
  const { user } = useAuth();
  const { connectedForms } = useConnectedForms();
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const [filters, setFilters] = useState({
    status: 'All',
    assignedTo: 'All',
    website: 'All'
  });

  // Get unique websites from connected forms
  const availableWebsites = Array.from(new Set(connectedForms.map(form => form.website_url)));

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

  const handleWebsiteFilter = (website: string) => {
    setFilters(prev => ({ ...prev, website }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'All',
      assignedTo: 'All',
      website: 'All'
    });
    setDateRange({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date()
    });
  };

  // Calculate stats from filtered data
  const totalLeads = filteredLeads.length;
  const conversionRate = 0;
  const costPerLead = 0;
  const averageValue = 0;

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
      
      {/* Website Selector Card */}
      <Card className="mb-6 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5" />
            Website Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-fit">
              Select Website:
            </label>
            <Select value={filters.website} onValueChange={handleWebsiteFilter}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Choose a website to view leads" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="All">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    All Websites
                  </div>
                </SelectItem>
                {availableWebsites.map((website) => (
                  <SelectItem key={website} value={website}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {website}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filters.website !== 'All' && (
              <div className="text-sm text-gray-600">
                Showing leads from: <span className="font-semibold text-blue-600">{filters.website}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
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
          onWebsiteFilter={handleWebsiteFilter}
          availableWebsites={['All', ...availableWebsites]}
          onReset={handleResetFilters}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium text-gray-900">
          Leads Overview
          {filters.website !== 'All' && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({filters.website})
            </span>
          )}
        </h2>
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
