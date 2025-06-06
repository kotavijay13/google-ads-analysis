
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import DateRangePicker from '@/components/DateRangePicker';
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
  created_at: string;
}

const LeadsPage = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Initial Leads data fetch with date range:', { from: dateRange.from, to: dateRange.to });
    fetchLeadsData();
  }, [dateRange, user]);

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
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLeadsData();
  };

  const handleDateChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };

  // Calculate stats from actual data
  const totalLeads = leads.length;
  const conversionRate = 0; // This would be calculated based on traffic data
  const costPerLead = 0; // This would be calculated based on campaign spend
  const averageValue = 0; // This would be calculated based on deal values

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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Leads Overview</h2>
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">From total traffic</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${costPerLead.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Average acquisition cost</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageValue}</div>
            <p className="text-xs text-muted-foreground">Per qualified lead</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="status">Lead Status</TabsTrigger>
          <TabsTrigger value="performance">Campaign Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading leads...</p>
                </div>
              ) : leads.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '-'}
                        </TableCell>
                        <TableCell>{lead.email || '-'}</TableCell>
                        <TableCell>{lead.phone || '-'}</TableCell>
                        <TableCell>{lead.source || '-'}</TableCell>
                        <TableCell>{lead.campaign || '-'}</TableCell>
                        <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            lead.status === 'New' ? 'default' :
                            lead.status === 'Contacted' ? 'secondary' :
                            lead.status === 'Qualified' ? 'default' :
                            'default'
                          }>
                            {lead.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No leads data available</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect your forms and campaigns to start collecting leads
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Lead Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">No lead status data available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">No campaign performance data available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadsPage;
