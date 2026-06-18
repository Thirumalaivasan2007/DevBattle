"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, UserPlus } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export function PendingRequests({ teamId, onUpdate }: { teamId: string, onUpdate: () => void }) {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      const res = await api.get(`/teams/${teamId}/requests`);
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [teamId]);

  const handleRespond = async (id: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      await api.put(`/teams/requests/${id}/respond`, { action });
      toast.success(`Request ${action === 'ACCEPT' ? 'accepted' : 'rejected'}`);
      setRequests(requests.filter(req => req._id !== id));
      if (action === 'ACCEPT') {
        onUpdate();
      }
    } catch (error: any) {
      toast.error("Failed to respond to request", {
        description: error.response?.data?.message || "An unexpected error occurred."
      });
    }
  };

  if (requests.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Pending Join Requests ({requests.length})
        </CardTitle>
        <CardDescription>Review users who want to join your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <Card key={req._id} className="bg-background shadow-sm">
              <CardContent className="p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={req.inviter?.profilePicture} />
                    <AvatarFallback>{req.inviter?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold leading-tight">{req.inviter?.username}</h4>
                    <p className="text-xs text-muted-foreground">Requested to join</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full">
                  <Button 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleRespond(req._id, 'ACCEPT')}
                  >
                    <Check className="h-4 w-4 mr-1" /> Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-destructive/50 hover:bg-destructive/10 text-destructive"
                    onClick={() => handleRespond(req._id, 'REJECT')}
                  >
                    <X className="h-4 w-4 mr-1" /> Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
