
import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';

const AdminPage = () => {
  const [customFields, setCustomFields] = useState([
    { id: 1, name: 'Company Name', type: 'text', required: true, active: true },
    { id: 2, name: 'Job Title', type: 'text', required: false, active: true },
    { id: 3, name: 'Industry', type: 'select', required: true, active: true },
    { id: 4, name: 'Budget Range', type: 'select', required: false, active: true },
    { id: 5, name: 'Interested Services', type: 'checkbox', required: false, active: true },
  ]);

  const [connectedForms, setConnectedForms] = useState([
    { id: 1, name: 'Website Contact Form', source: 'website', lastSync: '2025-05-16', status: 'active' },
    { id: 2, name: 'Facebook Lead Form', source: 'facebook', lastSync: '2025-05-15', status: 'active' },
    { id: 3, name: 'Google Ads Lead Form', source: 'google', lastSync: '2025-05-14', status: 'active' },
  ]);

  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    required: false,
    active: true
  });

  const handleAddField = () => {
    if (!newField.name.trim()) {
      toast.error("Field name is required");
      return;
    }

    const id = Math.max(0, ...customFields.map(field => field.id)) + 1;
    setCustomFields([...customFields, { ...newField, id }]);
    setNewField({
      name: '',
      type: 'text',
      required: false,
      active: true
    });
    toast.success("Custom field added successfully");
  };

  const handleToggleField = (id: number) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, active: !field.active } : field
    ));
    toast.success("Field status updated");
  };

  const handleDeleteField = (id: number) => {
    setCustomFields(customFields.filter(field => field.id !== id));
    toast.success("Field deleted successfully");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="Lead Admin" onRefresh={handleRefresh} />
      
      <Tabs defaultValue="lead-fields" className="w-full mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="lead-fields">Lead Custom Fields</TabsTrigger>
          <TabsTrigger value="form-connections">Form Connections</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lead-fields">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lead Custom Fields</CardTitle>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Field Name" 
                  className="w-40"
                  value={newField.name}
                  onChange={(e) => setNewField({...newField, name: e.target.value})}
                />
                <Select 
                  value={newField.type} 
                  onValueChange={(value) => setNewField({...newField, type: value})}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Field Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="required-field" 
                    checked={newField.required}
                    onCheckedChange={(checked) => setNewField({...newField, required: checked})}
                  />
                  <Label htmlFor="required-field">Required</Label>
                </div>
                <Button onClick={handleAddField}>
                  <Plus size={16} className="mr-2" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customFields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">{field.name}</TableCell>
                      <TableCell className="capitalize">{field.type}</TableCell>
                      <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          field.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {field.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleField(field.id)}>
                          {field.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteField(field.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="form-connections">
          <Card>
            <CardHeader>
              <CardTitle>Connected Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Last Synced</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connectedForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.name}</TableCell>
                      <TableCell className="capitalize">{form.source}</TableCell>
                      <TableCell>{form.lastSync}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          form.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {form.status === 'active' ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText size={16} className="mr-2" />
                          View Leads
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6">
                <Button>
                  <Plus size={16} className="mr-2" />
                  Connect New Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Lead Admin Settings</h3>
              <p>Configure lead management settings here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
