
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { Users, UserPlus, Edit, Trash2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  canView: boolean;
  canEdit: boolean;
  status: 'active' | 'pending' | 'suspended';
}

// Sample mock users data
const mockUsers: User[] = [
  { id: '1', email: 'jane.doe@example.com', name: 'Jane Doe', role: 'Admin', canView: true, canEdit: true, status: 'active' },
  { id: '2', email: 'john.smith@example.com', name: 'John Smith', role: 'Editor', canView: true, canEdit: true, status: 'active' },
  { id: '3', email: 'mark.wilson@example.com', name: 'Mark Wilson', role: 'Viewer', canView: true, canEdit: false, status: 'active' },
  { id: '4', email: 'sarah.johnson@example.com', name: 'Sarah Johnson', role: 'Editor', canView: true, canEdit: true, status: 'pending' },
  { id: '5', email: 'robert.brown@example.com', name: 'Robert Brown', role: 'Viewer', canView: true, canEdit: false, status: 'suspended' },
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'Viewer',
    canView: true,
    canEdit: false
  });

  const handleAddUser = () => {
    const user = {
      id: Math.random().toString(36).substring(7),
      ...newUser,
      status: 'pending' as const
    };
    
    setUsers([...users, user]);
    setNewUser({
      email: '',
      name: '',
      role: 'Viewer',
      canView: true,
      canEdit: false
    });
    setIsAddUserOpen(false);
    toast.success('User invitation sent');
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

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setIsEditUserOpen(true);
  };

  return (
    <Card className="bg-white shadow-sm border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-medium">User Management</CardTitle>
          <CardDescription>Manage users and their permissions</CardDescription>
        </div>
        <Button onClick={() => setIsAddUserOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <UserPlus size={16} className="mr-2" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>View Permission</TableHead>
              <TableHead>Edit Permission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id} className="border-b border-gray-100">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'Editor' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${user.canView ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.canView ? 'Yes' : 'No'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${user.canEdit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.canEdit ? 'Yes' : 'No'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
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
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user. An invitation will be sent to their email.
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
                onValueChange={(value) => setNewUser({
                  ...newUser, 
                  role: value,
                  canEdit: value === 'Viewer' ? false : newUser.canEdit
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="canView" 
                checked={newUser.canView} 
                onCheckedChange={(checked) => setNewUser({...newUser, canView: checked})} 
              />
              <Label htmlFor="canView">Can view content</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="canEdit" 
                checked={newUser.canEdit} 
                disabled={newUser.role === 'Viewer'}
                onCheckedChange={(checked) => setNewUser({...newUser, canEdit: checked})} 
              />
              <Label htmlFor="canEdit">Can edit content</Label>
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
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions
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
                  onValueChange={(value) => setCurrentUser({
                    ...currentUser, 
                    role: value,
                    canEdit: value === 'Viewer' ? false : currentUser.canEdit
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={currentUser.status} 
                  onValueChange={(value: 'active' | 'pending' | 'suspended') => 
                    setCurrentUser({...currentUser, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-canView" 
                  checked={currentUser.canView} 
                  onCheckedChange={(checked) => setCurrentUser({...currentUser, canView: checked})} 
                />
                <Label htmlFor="edit-canView">Can view content</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-canEdit" 
                  checked={currentUser.canEdit} 
                  disabled={currentUser.role === 'Viewer'}
                  onCheckedChange={(checked) => setCurrentUser({...currentUser, canEdit: checked})} 
                />
                <Label htmlFor="edit-canEdit">Can edit content</Label>
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

export default UserManagement;
