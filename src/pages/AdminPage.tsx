import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Initial mock fields
const initialFields = [
  { id: "field-1", name: "Name", type: "text", isRequired: true, isEditable: true },
  { id: "field-2", name: "Email", type: "email", isRequired: true, isEditable: true },
  { id: "field-3", name: "Phone", type: "tel", isRequired: false, isEditable: true },
  { id: "field-4", name: "Source", type: "dropdown", isRequired: true, isEditable: true },
  { id: "field-5", name: "Campaign", type: "dropdown", isRequired: false, isEditable: true },
  { id: "field-6", name: "Status", type: "dropdown", isRequired: true, isEditable: false },
  { id: "field-7", name: "Date", type: "date", isRequired: true, isEditable: false },
];

const AdminPage = () => {
  const [fields, setFields] = useState(initialFields);
  const [editingField, setEditingField] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: "",
      type: "text",
      isRequired: false,
      isEditable: true
    }
  });

  const handleAddField = (data: any) => {
    const newField = {
      id: `field-${Date.now()}`,
      ...data
    };
    
    setFields([...fields, newField]);
    form.reset();
    setIsDialogOpen(false);
  };

  const handleEditField = (field: any) => {
    setEditingField(field);
    form.reset({
      name: field.name,
      type: field.type,
      isRequired: field.isRequired,
      isEditable: field.isEditable
    });
    setIsDialogOpen(true);
  };

  const handleSaveEdit = (data: any) => {
    setFields(fields.map(field => 
      field.id === editingField.id ? { ...field, ...data } : field
    ));
    setEditingField(null);
    setIsDialogOpen(false);
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleRefresh = () => {
    // Refresh admin data if needed
    console.log("Refreshing admin data");
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="Admin Dashboard" onRefresh={handleRefresh} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">System Configuration</h2>
      </div>

      <Tabs defaultValue="leads" className="mt-6">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="leads">Leads Fields</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lead Form Fields</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingField ? "Edit Field" : "Add New Field"}</DialogTitle>
                    <DialogDescription>
                      {editingField ? "Update the field details below." : "Create a new lead field by filling out the information below."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(editingField ? handleSaveEdit : handleAddField)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field Name</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., Company Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field Type</FormLabel>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              {...field}
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="tel">Phone</option>
                              <option value="dropdown">Dropdown</option>
                              <option value="date">Date</option>
                              <option value="number">Number</option>
                            </select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center justify-between">
                        <FormField
                          control={form.control}
                          name="isRequired"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Required</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <FormField
                          control={form.control}
                          name="isEditable"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>User Editable</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <DialogFooter>
                        <Button type="submit">
                          {editingField ? "Save Changes" : "Add Field"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Required</TableHead>
                    <TableHead className="text-center">User Editable</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">{field.name}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell className="text-center">{field.isRequired ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-center">{field.isEditable ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditField(field)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteField(field.id)}
                          disabled={["Name", "Email", "Status"].includes(field.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="text-sm font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Send email notifications for new leads</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="text-sm font-medium">Automatic Lead Assignment</h3>
                    <p className="text-sm text-muted-foreground">Automatically assign new leads to team members</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="text-sm font-medium">Lead Scoring</h3>
                    <p className="text-sm text-muted-foreground">Enable automatic lead scoring based on behavior</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
