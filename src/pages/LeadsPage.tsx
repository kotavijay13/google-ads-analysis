
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceChart from '@/components/PerformanceChart';
import { dailyPerformance } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock lead data with phone numbers added
const leads = [
  { 
    id: "lead-1", 
    name: "John Smith", 
    email: "john@example.com",
    phone: "(555) 123-4567",
    source: "Google Ads", 
    campaign: "Summer Sale", 
    date: "2023-05-12", 
    status: "New" 
  },
  { 
    id: "lead-2", 
    name: "Sarah Johnson", 
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    source: "Facebook", 
    campaign: "Retargeting", 
    date: "2023-05-11", 
    status: "Contacted" 
  },
  { 
    id: "lead-3", 
    name: "Michael Brown", 
    email: "michael@example.com",
    phone: "(555) 345-6789",
    source: "Organic Search", 
    campaign: "SEO", 
    date: "2023-05-10", 
    status: "Qualified" 
  },
  { 
    id: "lead-4", 
    name: "Emma Wilson", 
    email: "emma@example.com",
    phone: "(555) 456-7890",
    source: "Referral", 
    campaign: "Partner Program", 
    date: "2023-05-09", 
    status: "Converted" 
  },
  { 
    id: "lead-5", 
    name: "David Lee", 
    email: "david@example.com",
    phone: "(555) 567-8901",
    source: "Contact Form", 
    campaign: "Website", 
    date: "2023-05-08", 
    status: "New" 
  },
];

const LeadsPage = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [leadsData, setLeadsData] = useState(leads);
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Refreshing Leads data...');
    }, 1000);
  };

  const handleDateChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  }, []);

  const handleStatusChange = (leadId: string, newStatus: string) => {
    setLeadsData(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  // Initial data fetch when component mounts
  useEffect(() => {
    console.log('Initial Leads data fetch with date range:', dateRange);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Contacted": return "bg-yellow-100 text-yellow-800";
      case "Qualified": return "bg-purple-100 text-purple-800";
      case "Converted": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
            <div className="text-2xl font-bold">347</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$32.15</div>
            <p className="text-xs text-muted-foreground">-$3.40 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$186</div>
            <p className="text-xs text-muted-foreground">+$12 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="leads" className="mt-6">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="status">Lead Status</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {leadsData.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{lead.campaign}</TableCell>
                      <TableCell>{lead.date}</TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={lead.status} 
                          onValueChange={(value) => handleStatusChange(lead.id, value)}
                        >
                          <SelectTrigger className={`w-[130px] h-7 text-xs ${getStatusColor(lead.status)}`}>
                            <SelectValue placeholder={lead.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Lead Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 p-4 rounded">
                  <div className="text-blue-800 text-sm font-medium mb-1">New</div>
                  <div className="text-2xl font-bold">124</div>
                  <div className="text-xs text-blue-800/80">36% of total</div>
                </div>
                <div className="bg-yellow-100 p-4 rounded">
                  <div className="text-yellow-800 text-sm font-medium mb-1">Contacted</div>
                  <div className="text-2xl font-bold">86</div>
                  <div className="text-xs text-yellow-800/80">25% of total</div>
                </div>
                <div className="bg-purple-100 p-4 rounded">
                  <div className="text-purple-800 text-sm font-medium mb-1">Qualified</div>
                  <div className="text-2xl font-bold">68</div>
                  <div className="text-xs text-purple-800/80">20% of total</div>
                </div>
                <div className="bg-green-100 p-4 rounded">
                  <div className="text-green-800 text-sm font-medium mb-1">Converted</div>
                  <div className="text-2xl font-bold">69</div>
                  <div className="text-xs text-green-800/80">19% of total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Summer Sale", leads: 87, cpl: "$28.43", conversion: "26%" },
                  { name: "Product Launch", leads: 64, cpl: "$36.12", conversion: "18%" },
                  { name: "Retargeting", leads: 51, cpl: "$22.75", conversion: "32%" },
                  { name: "Partner Program", leads: 42, cpl: "$12.20", conversion: "21%" },
                ].map((campaign, i) => (
                  <div key={i} className="flex justify-between items-start py-2 border-b">
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">{campaign.leads} leads</div>
                    </div>
                    <div className="text-right">
                      <div>{campaign.cpl} CPL</div>
                      <div className="text-sm text-muted-foreground">{campaign.conversion} conv. rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadsPage;
