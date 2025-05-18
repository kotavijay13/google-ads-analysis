
import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { PlusCircle, Trash2, Save, FileText, Link as LinkIcon, Facebook } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

type FieldType = 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'checkbox';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For select fields
  placeholder?: string;
}

interface FormData {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  source: 'website' | 'facebook' | 'manual';
  created: Date;
}

const FormsPage = () => {
  const [forms, setForms] = useState<FormData[]>([
    {
      id: '1',
      name: 'Contact Form',
      description: 'Main website contact form',
      fields: [
        { id: '1-1', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
        { id: '1-2', label: 'Email Address', type: 'email', required: true, placeholder: 'your@email.com' },
        { id: '1-3', label: 'Phone Number', type: 'phone', required: false, placeholder: '+1 (123) 456-7890' },
        { id: '1-4', label: 'Message', type: 'textarea', required: true, placeholder: 'How can we help you?' },
      ],
      source: 'website',
      created: new Date(2023, 5, 15)
    },
    {
      id: '2',
      name: 'Newsletter Signup',
      description: 'Footer newsletter subscription',
      fields: [
        { id: '2-1', label: 'Email Address', type: 'email', required: true, placeholder: 'your@email.com' },
        { id: '2-2', label: 'Preferences', type: 'select', required: false, options: ['Marketing', 'Product Updates', 'Industry News'] },
      ],
      source: 'website',
      created: new Date(2023, 6, 22)
    },
    {
      id: '3',
      name: 'Lead Generation - Facebook',
      description: 'Facebook lead generation campaign form',
      fields: [
        { id: '3-1', label: 'Name', type: 'text', required: true },
        { id: '3-2', label: 'Email', type: 'email', required: true },
        { id: '3-3', label: 'Company Size', type: 'select', required: true, options: ['1-10', '11-50', '51-200', '201+'] },
        { id: '3-4', label: 'Interested in our services?', type: 'checkbox', required: false },
      ],
      source: 'facebook',
      created: new Date(2023, 8, 5)
    },
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newForm, setNewForm] = useState<Partial<FormData>>({
    name: '',
    description: '',
    fields: [],
    source: 'website'
  });
  
  const [newField, setNewField] = useState<Partial<FormField>>({
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
  });
  
  const addNewField = () => {
    if (!newField.label) {
      toast.error("Field label is required");
      return;
    }
    
    const field: FormField = {
      id: `new-${Date.now()}`,
      label: newField.label || '',
      type: newField.type as FieldType || 'text',
      required: newField.required || false,
      placeholder: newField.placeholder,
      options: newField.type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };
    
    setNewForm({
      ...newForm,
      fields: [...(newForm.fields || []), field]
    });
    
    // Reset new field form
    setNewField({
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
    });
    
    toast.success("Field added");
  };
  
  const removeField = (id: string) => {
    setNewForm({
      ...newForm,
      fields: newForm.fields?.filter(field => field.id !== id) || []
    });
    toast.success("Field removed");
  };
  
  const saveForm = () => {
    if (!newForm.name) {
      toast.error("Form name is required");
      return;
    }
    
    if (!newForm.fields || newForm.fields.length === 0) {
      toast.error("Add at least one field to your form");
      return;
    }
    
    const formToSave: FormData = {
      id: `form-${Date.now()}`,
      name: newForm.name,
      description: newForm.description || '',
      fields: newForm.fields,
      source: newForm.source as 'website' | 'facebook' | 'manual',
      created: new Date()
    };
    
    setForms([...forms, formToSave]);
    setIsCreating(false);
    setNewForm({
      name: '',
      description: '',
      fields: [],
      source: 'website'
    });
    
    toast.success("Form created successfully");
  };
  
  const connectToExternalForm = (type: 'website' | 'facebook') => {
    toast.info(`Connecting to ${type === 'website' ? 'Website Form' : 'Facebook Lead Form'}`);
    // In a real implementation, this would open a connection flow
  };
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={() => {}} title="Forms Management" />
      
      <Tabs defaultValue="all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <TabsList>
            <TabsTrigger value="all">All Forms</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          )}
        </div>
      
        <TabsContent value="all" className="mt-0">
          {isCreating ? (
            <FormBuilder 
              newForm={newForm}
              setNewForm={setNewForm}
              newField={newField}
              setNewField={setNewField}
              addNewField={addNewField}
              removeField={removeField}
              saveForm={saveForm}
              onCancel={() => setIsCreating(false)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
                <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[12rem]">
                  <Button variant="outline" onClick={() => setIsCreating(true)} className="mb-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Form
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => connectToExternalForm('website')}
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Connect Website Form
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => connectToExternalForm('facebook')}
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      Connect Facebook Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {forms.map(form => (
                <Card key={form.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      {form.source === 'website' ? (
                        <LinkIcon className="mr-2 h-4 w-4 text-blue-500" />
                      ) : form.source === 'facebook' ? (
                        <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4 text-gray-500" />
                      )}
                      {form.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{form.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {form.fields.length} fields • Created {form.created.toLocaleDateString()}
                    </p>
                    <div className="mt-4">
                      <Label className="text-xs font-normal text-muted-foreground mb-1 block">Fields</Label>
                      <div className="text-xs space-y-1">
                        {form.fields.slice(0, 3).map((field, i) => (
                          <div key={field.id} className="flex items-center">
                            <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-2 text-[10px]">
                              {i + 1}
                            </span>
                            <span>{field.label}</span>
                            {field.required && <span className="ml-1 text-red-500">*</span>}
                          </div>
                        ))}
                        {form.fields.length > 3 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            +{form.fields.length - 3} more fields
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-2">
                    <Button variant="ghost" size="sm">View Details</Button>
                    <Button variant="ghost" size="sm">View Submissions</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="website" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forms
              .filter(form => form.source === 'website')
              .map(form => (
                <Card key={form.id}>
                  {/* Same card content as above */}
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <LinkIcon className="mr-2 h-4 w-4 text-blue-500" />
                      {form.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{form.description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="facebook" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forms
              .filter(form => form.source === 'facebook')
              .map(form => (
                <Card key={form.id}>
                  {/* Same card content as above */}
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                      {form.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{form.description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="manual" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forms
              .filter(form => form.source === 'manual')
              .map(form => (
                <Card key={form.id}>
                  {/* Same card content as above */}
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-gray-500" />
                      {form.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{form.description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Form Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "John Doe", email: "john@example.com", form: "Contact Form", source: "Website", date: "2023-11-15" },
                  { name: "Jane Smith", email: "jane@example.com", form: "Newsletter Signup", source: "Website", date: "2023-11-14" },
                  { name: "Mike Johnson", email: "mike@example.com", form: "Lead Generation", source: "Facebook", date: "2023-11-13" },
                ].map((submission, i) => (
                  <TableRow key={i}>
                    <TableCell>{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.form}</TableCell>
                    <TableCell>{submission.source}</TableCell>
                    <TableCell>{submission.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Form Builder Component
interface FormBuilderProps {
  newForm: Partial<FormData>;
  setNewForm: (form: Partial<FormData>) => void;
  newField: Partial<FormField>;
  setNewField: (field: Partial<FormField>) => void;
  addNewField: () => void;
  removeField: (id: string) => void;
  saveForm: () => void;
  onCancel: () => void;
}

const FormBuilder = ({ 
  newForm, 
  setNewForm, 
  newField, 
  setNewField,
  addNewField,
  removeField,
  saveForm,
  onCancel
}: FormBuilderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Form</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="formName">Form Name</Label>
              <Input
                id="formName"
                placeholder="Contact Form"
                value={newForm.name || ''}
                onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="formSource">Form Source</Label>
              <Select 
                value={newForm.source} 
                onValueChange={(value) => setNewForm({ ...newForm, source: value as any })}
              >
                <SelectTrigger id="formSource">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="formDescription">Description</Label>
            <Input
              id="formDescription"
              placeholder="Describe the purpose of this form"
              value={newForm.description || ''}
              onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
            />
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="text-lg font-medium">Form Fields</h3>
          
          {newForm.fields && newForm.fields.length > 0 ? (
            <div className="space-y-4 mb-6">
              {newForm.fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <div className="font-medium">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Type: {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeField(field.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed rounded-md bg-muted">
              <p className="text-muted-foreground">No fields added yet. Add your first field below.</p>
            </div>
          )}
          
          <div className="bg-muted p-4 rounded-md">
            <h4 className="text-sm font-medium mb-4">Add New Field</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="fieldLabel">Field Label</Label>
                <Input
                  id="fieldLabel"
                  placeholder="Full Name"
                  value={newField.label || ''}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="fieldType">Field Type</Label>
                <Select 
                  value={newField.type} 
                  onValueChange={(value) => setNewField({ ...newField, type: value as FieldType })}
                >
                  <SelectTrigger id="fieldType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                <Input
                  id="fieldPlaceholder"
                  placeholder="Enter placeholder text"
                  value={newField.placeholder || ''}
                  onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                />
              </div>
              <div className="flex items-center pt-6">
                <Label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={newField.required || false}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  />
                  Required Field
                </Label>
              </div>
            </div>
            
            <Button onClick={addNewField} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={saveForm}>
          <Save className="mr-2 h-4 w-4" />
          Save Form
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FormsPage;
