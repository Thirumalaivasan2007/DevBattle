"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { InvitationModal } from '@/components/teams/InvitationModal';
import { PendingRequests } from '@/components/teams/PendingRequests';
import { useTeam } from '../TeamContext';

export default function TeamMembersPage() {
  const { team, fetchTeam } = useTeam();
  const { user } = useAuthStore();
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  if (!team) return null;

  const currentUserMember = team.members.find((m: any) => m.user._id === user?._id || m.user.username === user?.username);
  const canInvite = currentUserMember && (currentUserMember.role === 'OWNER' || currentUserMember.role === 'ADMIN');

  return (
    <>
      {canInvite && <PendingRequests teamId={team._id} onUpdate={fetchTeam} />}
      <Card className="border-border/40 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Roster</CardTitle>
          <CardDescription>Manage members, roles, and view contributions.</CardDescription>
        </div>
        {canInvite && (
          <Button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border-0 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.members.map((member: any) => (
                <TableRow key={member._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                        {member.user.profilePicture ? (
                          <img src={member.user.profilePicture} alt={member.user.username} className="w-full h-full object-cover" />
                        ) : (
                          member.user.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div>{member.user.username}</div>
                        {member.user.rank && <div className="text-xs text-muted-foreground">{member.user.rank}</div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'OWNER' ? 'default' : member.role === 'ADMIN' ? 'secondary' : 'outline'}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.user.rating || 1200}</TableCell>
                  <TableCell className="text-muted-foreground">{member.contribution} XP</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <InvitationModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        teamId={team._id} 
      />
    </Card>
    </>
  );
}
