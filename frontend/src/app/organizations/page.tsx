"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, Users, Trophy, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function OrganizationsDirectoryPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await api.get(`/organizations?search=${search}`);
        setOrganizations(res.data.organizations || []);
      } catch (error: any) {
        toast.error("Error", { description: error.response?.data?.message || "Failed to load organizations" });
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, [search]);

  return (
    <div className="container py-10 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Organizations Directory</h1>
          <p className="text-lg text-muted-foreground mt-1">Discover verified companies, schools, and coding clubs.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search organizations by name..." 
            className="pl-10 h-12 text-md bg-card border-border shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : organizations.length === 0 ? (
          <Card className="border-border/40 bg-card/50 text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Organizations Found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <Card key={org._id} className="border-border/40 hover:border-primary/50 transition-all cursor-pointer bg-card/50 hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border/50 overflow-hidden">
                    {org.logo ? (
                      <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl line-clamp-1">{org.name}</CardTitle>
                    {org.verified && (
                      <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary hover:bg-primary/20">
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 min-h-[2.5rem] mb-4">
                    {org.description || "No description provided."}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{org.members?.length || 0} Members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>{org.score || 0} Score</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
