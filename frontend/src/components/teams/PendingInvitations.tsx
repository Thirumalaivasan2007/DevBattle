"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Bell } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export function PendingInvitations() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const { isAuthenticated } = useAuthStore();

  const fetchInvitations = async () => {
    try {
      const res = await api.get('/teams/invitations/my');
      setInvitations(res.data);
    } catch (error) {
      console.error("Failed to fetch invitations", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInvitations();
    }
  }, [isAuthenticated]);

  const handleRespond = async (id: string, accept: boolean) => {
    try {
      await api.put(`/teams/invitations/${id}/respond`, { accept });
      toast.success(`Invitation ${accept ? 'accepted' : 'declined'}`);
      setInvitations(invitations.filter(inv => inv._id !== id));
    } catch (error: any) {
      toast.error("Failed to respond to invitation", {
        description: error.response?.data?.message || "An unexpected error occurred."
      });
    }
  };

  if (invitations.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-primary" />
        Pending Invitations ({invitations.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invitations.map((inv) => (
          <Card key={inv._id} className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src={inv.team?.logo} />
                  <AvatarFallback>{inv.team?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold leading-tight">{inv.team?.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    Invited by <span className="font-medium text-foreground">{inv.inviter?.username}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full">
                <Button 
                  size="sm" 
                  className="flex-1" 
                  onClick={() => handleRespond(inv._id, true)}
                >
                  <Check className="h-4 w-4 mr-1" /> Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-destructive/50 hover:bg-destructive/10 text-destructive"
                  onClick={() => handleRespond(inv._id, false)}
                >
                  <X className="h-4 w-4 mr-1" /> Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
