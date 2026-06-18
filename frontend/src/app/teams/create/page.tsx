"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ShieldPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function CreateTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    privacy: 'PUBLIC'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Required", { description: "Team name is required." });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/teams', formData);
      toast.success("Team Created", { description: "Your team was created successfully!" });
      router.push(`/teams/${response.data.slug}`);
    } catch (error: any) {
      toast.error("Creation Failed", { 
        description: error.response?.data?.message || "Internal server error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Create a Team</h1>
        <p className="text-lg text-muted-foreground mt-1">Found a new squad and invite your friends to compete.</p>
      </div>

      <Card className="border-border/40 shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldPlus className="h-5 w-5 text-primary" />
              Team Details
            </CardTitle>
            <CardDescription>Give your team an identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                placeholder="e.g. Byte Busters" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                maxLength={50}
                required
              />
              <p className="text-xs text-muted-foreground">This must be unique. A slug will be automatically generated.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="What is your team all about? (Optional)" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                maxLength={500}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacy">Privacy Mode</Label>
              <Select 
                value={formData.privacy} 
                onValueChange={(value) => setFormData({ ...formData, privacy: value || 'PUBLIC' })}
              >
                <SelectTrigger id="privacy">
                  <SelectValue placeholder="Select privacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Public (Anyone can find and request to join)</SelectItem>
                  <SelectItem value="INVITE_ONLY">Invite Only (Hidden from searches)</SelectItem>
                  <SelectItem value="PRIVATE">Private (Unlisted)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t border-border/40 pt-6">
            <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Team"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
