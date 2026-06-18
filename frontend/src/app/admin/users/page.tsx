"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, ShieldAlert, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const currentUser = useAuthStore((state) => state.user);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users?page=${page}&search=${search}`);
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
      } catch (error: any) {
        toast.error("Failed to fetch users", {
          description: error.response?.data?.message || "Internal server error"
        });
      } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

  const handleToggleBan = async (userId: string, isBanned: boolean) => {
    if (currentUser?.role !== 'SUPER_ADMIN') {
      toast.error("Access Denied", { description: "Only Super Admins can ban users" });
      return;
    }
    
    try {
      await api.put(`/admin/users/${userId}`, { isBanned: !isBanned, banReason: !isBanned ? 'Admin action' : '' });
      toast.success("Success", { description: `User ${isBanned ? 'unbanned' : 'banned'} successfully` });
      fetchUsers();
    } catch (error: any) {
      toast.error("Error", { description: error.response?.data?.message });
    }
  };

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    if (currentUser?.role !== 'SUPER_ADMIN') {
      toast.error("Access Denied", { description: "Only Super Admins can change roles" });
      return;
    }

    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      toast.success("Success", { description: `User role updated to ${newRole}` });
      fetchUsers();
    } catch (error: any) {
      toast.error("Error", { description: error.response?.data?.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage accounts, roles, and access.</p>
        </div>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username, email..."
              className="pl-9 bg-muted/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border border-border/40 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            {user.username}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'SUPER_ADMIN' ? 'destructive' : user.role === 'ADMIN' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <Badge variant="destructive">Banned</Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell>{user.rating}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              title={user.role === 'USER' ? "Promote to Admin" : "Demote to User"}
                              onClick={() => handleToggleAdmin(user._id, user.role)}
                              disabled={user.role === 'SUPER_ADMIN' || currentUser?.role !== 'SUPER_ADMIN'}
                            >
                              {user.role === 'USER' ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4 text-orange-500" />}
                            </Button>
                            <Button 
                              variant={user.isBanned ? "default" : "destructive"} 
                              size="icon"
                              title={user.isBanned ? "Unban User" : "Ban User"}
                              onClick={() => handleToggleBan(user._id, user.isBanned)}
                              disabled={user.role === 'SUPER_ADMIN' || currentUser?.role !== 'SUPER_ADMIN'}
                            >
                              {user.isBanned ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
