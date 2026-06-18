"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { redirect, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Ensure user is logged in and has either ADMIN or SUPER_ADMIN role
  if (!isAuthenticated || !user) {
    redirect('/auth/login?redirect=/admin/dashboard');
  }

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8">You do not have permission to access the admin portal.</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex h-16 items-center px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <h2 className="text-lg font-semibold">DevBattle Admin Control Center</h2>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {user.username} ({user.role})</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
