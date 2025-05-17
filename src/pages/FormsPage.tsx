
import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from '@/components/ui/switch';
import { FileText, Link, Facebook, Edit, Plus, CornerDownRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const FormsPage = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  const [forms, setForms] = useState([
    { 
      id: 1, 
      name: 'Contact Form', 
      source: 'website', 
      url: 'https://example.com/contact', 
      leads: 42,
      lastSync: '2025-05-16T14:22:00Z',
      active: true
    },
    { 
      id: 2, 
      name: 'Request Quote', 
      source: 'website', 
      url: 'https://example.com/quote', 
      leads: 28,
      lastSync: '2025-05-16T09:45:00Z',
      active: true
    },
    { 
      id: 3, 
      name: 'Newsletter Signup', 
      source: 'website', 
      url: 'https://example.com/newsletter', 
      leads: 137,
      lastSync: '2025-05-16T12:30:00Z',
      active: false
    },
    { 
      id: 4, 
      name: 'Facebook Lead Gen', 
      source: 'facebook', 
      url: 'https://facebook.com/ads/lead/123456', 
      leads: 83,
      lastSync: '2025-05-15T18:15:00Z',
      active: true
    },
    { 
      id: 5, 
      name: 'Google Lead Form', 
      source: 'google', 
      url: 'https://ads.google.com/forms/123456', 
      leads: 56,
      lastSync: '2025-05-15T16:40:00Z',
      active: true
    }
  ]);

  const handleRefresh = () => {
    toast.success("Syncing forms data...");
    setTimeout(() => {
      toast.success("Forms data synced successfully");
    }, 1500);
  };

  const handleToggleForm = (id: number) => {
    setForms(forms.map(form => 
      form.id === id ? { ...form, active: !form.active } : form
    ));
    toast.success("Form status updated");
  };

  const getFormIcon = (source: string) => {
    switch(source) {
      case 'website': return <FileText className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'google': return <Link className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="Forms Management" onRefresh={handleRefresh} />
      
      <Tabs defaultValue="all-forms" className="w-full mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="all-forms">All Forms</TabsTrigger>
          <TabsTrigger value="website-forms">Website Forms</TabsTrigger>
          <TabsTrigger value="facebook-forms">Facebook Forms</TabsTrigger>
          <TabsTrigger value="google-forms">Google Forms</TabsTrigger>
          <TabsTrigger value="create-form">Create Form</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-forms">
          <Card>
            <CardHeader>
              <CardTitle>Connected Forms</CardTitle>
              <CardDescription>
                Manage all your lead capture forms across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button>
                  <Plus size={16} className="mr-2" />
                  Connect New Form
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Last Synced</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                            {getFormIcon(form.source)}
                          </span>
                          <span className="font-medium">{form.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{form.source}</TableCell>
                      <TableCell>{form.leads}</TableCell>
                      <TableCell>
                        {new Date(form.lastSync).toLocaleDateString()} at {new Date(form.lastSync).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          form.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {form.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleForm(form.id)}>
                          {form.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <CornerDownRight size={16} className="mr-1" />
                          View Leads
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="website-forms">
          <Card>
            <CardHeader>
              <CardTitle>Website Forms</CardTitle>
              <CardDescription>
                Manage forms embedded on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms
                    .filter(form => form.source === 'website')
                    .map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.name}</TableCell>
                        <TableCell className="text-sm text-gray-500">{form.url}</TableCell>
                        <TableCell>{form.leads}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            form.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {form.active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facebook-forms">
          <Card>
            <CardHeader>
              <CardTitle>Facebook Lead Forms</CardTitle>
              <CardDescription>
                Manage lead forms connected to your Facebook ads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Last Synced</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms
                    .filter(form => form.source === 'facebook')
                    .map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.name}</TableCell>
                        <TableCell>{form.leads}</TableCell>
                        <TableCell>
                          {new Date(form.lastSync).toLocaleDateString()} at {new Date(form.lastSync).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            form.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {form.active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Sync Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
              <div className="mt-6">
                <Button>
                  <Plus size={16} className="mr-2" />
                  Connect Facebook Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="google-forms">
          <Card>
            <CardHeader>
              <CardTitle>Google Forms</CardTitle>
              <CardDescription>
                Manage lead forms connected to your Google ads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Last Synced</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms
                    .filter(form => form.source === 'google')
                    .map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.name}</TableCell>
                        <TableCell>{form.leads}</TableCell>
                        <TableCell>
                          {new Date(form.lastSync).toLocaleDateString()} at {new Date(form.lastSync).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            form.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {form.active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Sync Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
              <div className="mt-6">
                <Button>
                  <Plus size={16} className="mr-2" />
                  Connect Google Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create-form">
          <Card>
            <CardHeader>
              <CardTitle>Create New Web Form</CardTitle>
              <CardDescription>
                Create a custom form for your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="form-name">Form Name</Label>
                  <Input id="form-name" placeholder="e.g. Contact Form" />
                </div>
                
                <div>
                  <Label htmlFor="form-description">Description</Label>
                  <Textarea id="form-description" placeholder="Describe the purpose of this form" />
                </div>
                
                <div>
                  <Label htmlFor="form-type">Form Type</Label>
                  <Select defaultValue="contact">
                    <SelectTrigger id="form-type">
                      <SelectValue placeholder="Select a form type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact">Contact Form</SelectItem>
                      <SelectItem value="lead">Lead Generation</SelectItem>
                      <SelectItem value="quote">Quote Request</SelectItem>
                      <SelectItem value="newsletter">Newsletter Signup</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" defaultChecked />
                  <Label htmlFor="notifications">Email notifications when new form submissions arrive</Label>
                </div>
                
                <div className="pt-4">
                  <Button>Create Form</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormsPage;
