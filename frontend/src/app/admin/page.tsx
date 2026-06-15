'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert, Users, Code, Trophy, BarChart3 } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic frontend role check. Real check happens on backend.
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-4">
          <ShieldAlert className="h-8 w-8 text-destructive" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage platform content and users</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">User Management</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10,243</div>
              <p className="text-xs text-muted-foreground mt-1">Total registered users</p>
            </CardContent>
          </Card>

          <Link href="/admin/problems" className="block">
            <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Problem Management</CardTitle>
                <Code className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Manage</div>
                <p className="text-xs text-muted-foreground mt-1">Create and edit problems</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contest Management</CardTitle>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">Upcoming/Active contests</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Platform Analytics</CardTitle>
              <BarChart3 className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground mt-1">Server health</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/30 rounded-lg p-8 text-center border border-dashed border-border">
          <p className="text-muted-foreground mb-4">
            Phase 1 Foundation setup complete. Full Admin CRUD operations will be implemented in subsequent phases.
          </p>
          <p className="text-sm text-primary font-medium">Architecture ready for modular expansion.</p>
        </div>
      </main>
    </div>
  );
}
