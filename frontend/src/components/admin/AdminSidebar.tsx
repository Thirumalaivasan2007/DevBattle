"use client";

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Users, FileCode2, Trophy, Swords, 
  MessageSquare, Target, Flag, Shield, Bell, 
  Server, Activity, Settings, LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/problems', label: 'Problems', icon: FileCode2 },
  { href: '/admin/contests', label: 'Contests', icon: Trophy },
  { href: '/admin/battles', label: 'Battles', icon: Swords },
  { href: '/admin/community', label: 'Community', icon: MessageSquare },
  { href: '/admin/challenges', label: 'Challenges', icon: Target },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
  { href: '/admin/teams', label: 'Teams', icon: Shield },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/judge', label: 'Judge Engine', icon: Server },
  { href: '/admin/analytics', label: 'Analytics', icon: Activity },
  { href: '/admin/operations', label: 'Operations', icon: Activity },
  { href: '/admin/system', label: 'System Health', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border/40">
      <div className="flex h-16 items-center px-6 border-b border-border/40">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Shield className="h-6 w-6" />
          <span>Admin Portal</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border/40 p-4">
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Exit Admin
        </Button>
      </div>
    </div>
  );
}
