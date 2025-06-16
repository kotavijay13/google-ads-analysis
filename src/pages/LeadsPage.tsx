
import { useState } from 'react';
import Header from '@/components/Header';
import LeadFilters from '@/components/leads/LeadFilters';
import LeadsPageHeader from '@/components/leads/LeadsPageHeader';
import LeadsTabsContent from '@/components/leads/LeadsTabsContent';
import { useLeadsData } from '@/components/leads/hooks/useLeadsData';
import { useAuth } from '@/context/AuthContext';
import { useConnectedForms } from '@/hooks/useConnectedForms';

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
    source: 'All'
  });

  const [visibleColumns, setVisibleColumns] = useState([
    'name', 'email', 'source', 'status', 'assigned_to', 'created_at', 'remarks'
  ]);

  const allColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'source', label: 'Source' },
    { key: 'campaign', label: 'Campaign' },
    { key: 'search_keyword', label: 'Search Keyword' },
    { key: 'message', label: 'Message' },
    { key: 'status', label: 'Status' },
    { key: 'assigned_to', label: 'Assigned To' },
    { key: 'created_at', label: 'Created Date' },
    { key: 'updated_at', label: 'Updated Date' },
    { key: 'remarks', label: 'Remarks' },
  ];

  // Get unique sources from connected forms and add social media sources
  const availableSources = [
    'All',
    ...Array.from(new Set(connectedForms.map(form => form.website_url))),
    'Instagram',
    'Facebook Messenger',
    'WhatsApp'
  ];

  const {
    leads,
    filteredLeads,
    isLoading,
    fetchLeadsData,
    handleStatusChange,
    handleAssignedToChange,
    handleRemarksChange,
    applyFilters
  } = useLeadsData(dateRange, filters);

  const augmentedLeads = filteredLeads.map(lead => {
    const form = connectedForms.find(f => f.form_id === lead.form_id);
    return {
      ...lead,
      website_url: form ? form.website_url : null
    };
  });

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

  const handleSourceFilter = (source: string) => {
    setFilters(prev => ({ ...prev, source }));
  };

  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'All',
      assignedTo: 'All',
      source: 'All'
    });
    setDateRange({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date()
    });
  };

  // Prepare data for export
  const exportData = augmentedLeads.map(lead => ({
    Name: lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '-',
    Email: lead.email || '-',
    Phone: lead.phone || '-',
    Company: lead.company || '-',
    Source: lead.website_url || lead.source || '-',
    Campaign: lead.campaign || '-',
    'Search Keyword': lead.search_keyword || '-',
    Status: lead.status,
    'Assigned To': lead.assigned_to || 'Unassigned',
    'Created Date': new Date(lead.created_at).toLocaleDateString(),
    'Updated Date': lead.updated_at ? new Date(lead.updated_at).toLocaleDateString() : '-',
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
      <div className="max-w-7xl mx-auto space-y-4">
        <Header onRefresh={handleRefresh} title="Leads Dashboard" />

        <LeadFilters
          onStatusFilter={handleStatusFilter}
          onAssignedToFilter={handleAssignedToFilter}
          onSourceFilter={handleSourceFilter}
          onReset={handleResetFilters}
          onApplyFilters={applyFilters}
          availableSources={availableSources}
        />

        <LeadsPageHeader
          selectedWebsite="All Sources"
          exportData={exportData}
          onDateChange={handleDateChange}
          columns={allColumns}
          visibleColumns={visibleColumns}
          onColumnToggle={handleColumnToggle}
        />

        <LeadsTabsContent
          filteredLeads={augmentedLeads}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onAssignedToChange={handleAssignedToChange}
          onRemarksChange={handleRemarksChange}
          visibleColumns={visibleColumns}
        />
      </div>
    </div>
  );
};

export default LeadsPage;
