
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { UserPlus, Edit, Trash2, Users } from 'lucide-react';

type UserRole = 'Manager' | 'Sales Rep' | 'Junior Rep';
type UserStatus = 'active' | 'inactive';

interface SalesUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  leadsAssigned: number;
}

// Mock data for sales users
const mockSalesUsers: SalesUser[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@company.com', role: 'Manager', status: 'active', leadsAssigned: 25 },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Sales Rep', status: 'active', leadsAssigned: 18 },
  { id: '3', name: 'Mike Wilson', email: 'mike.wilson@company.com', role: 'Sales Rep', status: 'active', leadsAssigned: 22 },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@company.com', role: 'Junior Rep', status: 'active', leadsAssigned: 12 },
  { id: '5', name: 'David Brown', email: 'david.brown@company.com', role: 'Sales Rep', status: 'inactive', leadsAssigned: 8 },
];

const LeadAdmin = () => {
  const [users, setUsers] = useState<SalesUser[]>(mockSalesUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SalesUser | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Sales Rep' as UserRole,
    status: 'active' as UserStatus
  });

  const handleAddUser = () => {
    const user: SalesUser = {
      id: Math.random().toString(36).substring(7),
      ...newUser,
      leadsAssigned: 0
    };
    
    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'Sales Rep',
      status: 'active'
    });
    setIsAddUserOpen(false);
    toast.success('Sales user added successfully');
  };

  const handleEditUser = () => {
    if (!currentUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? currentUser : user
    );
    
    setUsers(updatedUsers);
    setCurrentUser(null);
    setIsEditUserOpen(false);
    toast.success('User updated successfully');
  };

  const handleDeleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    toast.success('User removed successfully');
  };

  const handleEditClick = (user: SalesUser) => {
    setCurrentUser(user);
    setIsEditUserOpen(true);
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lead Administration
          </CardTitle>
          <CardDescription>Manage sales team and lead assignments</CardDescription>
        </div>
        <Button onClick={() => setIsAddUserOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus size={16} className="mr-2" />
          Add Sales User
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Leads Assigned</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'Manager' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{user.leadsAssigned}</span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(user)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Sales User</DialogTitle>
            <DialogDescription>
              Add a new member to your sales team
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newUser.name} 
                onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                  <SelectItem value="Junior Rep">Junior Rep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sales User</DialogTitle>
            <DialogDescription>
              Update user details and settings
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentUser.name} 
                  onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={currentUser.email} 
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={currentUser.role} 
                  onValueChange={(value: UserRole) => setCurrentUser({...currentUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                    <SelectItem value="Junior Rep">Junior Rep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={currentUser.status} 
                  onValueChange={(value: UserStatus) => setCurrentUser({...currentUser, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LeadAdmin;
