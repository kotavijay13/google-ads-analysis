
import { useState } from 'react';
import Header from '@/components/Header';
import LeadFilters from '@/components/leads/LeadFilters';
import WebsiteFilterCard from '@/components/leads/WebsiteFilterCard';
import LeadsPageHeader from '@/components/leads/LeadsPageHeader';
import LeadsTabsContent from '@/components/leads/LeadsTabsContent';
import { useLeadsData } from '@/components/leads/hooks/useLeadsData';
import { useAuth } from '@/context/AuthContext';
import { useConnectedForms } from '@/hooks/useConnectedForms';
import { toast } from '@/components/ui/sonner';

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

  const [connectedWebsite, setConnectedWebsite] = useState<string>('');

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
  } = useLeadsData(dateRange, { ...filters, website: connectedWebsite || 'All' });

  const handleRefresh = () => {
    fetchLeadsData();
  };

  const handleDateChange = (range: { from: Date; to: Date }) => {
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

  const handleConnect = () => {
    if (filters.website && filters.website !== 'All') {
      setConnectedWebsite(filters.website);
      toast.success(`Connected to ${filters.website}. Loading leads...`);
      // The useLeadsData hook will automatically refetch when connectedWebsite changes
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'All',
      assignedTo: 'All',
      website: 'All'
    });
    setConnectedWebsite('');
    setDateRange({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date()
    });
  };

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
    <div className="w-full min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header onRefresh={handleRefresh} title="Leads Dashboard" />
        
        <WebsiteFilterCard
          selectedWebsite={filters.website}
          availableWebsites={availableWebsites}
          onWebsiteChange={handleWebsiteFilter}
          onConnect={handleConnect}
        />

        <LeadFilters
          onStatusFilter={handleStatusFilter}
          onAssignedToFilter={handleAssignedToFilter}
          onWebsiteFilter={handleWebsiteFilter}
          availableWebsites={['All', ...availableWebsites]}
          onReset={handleResetFilters}
        />

        <LeadsPageHeader
          selectedWebsite={connectedWebsite || filters.website}
          exportData={exportData}
          onDateChange={handleDateChange}
        />

        <LeadsTabsContent
          filteredLeads={filteredLeads}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onAssignedToChange={handleAssignedToChange}
          onRemarksChange={handleRemarksChange}
        />
      </div>
    </div>
  );
};

export default LeadsPage;
