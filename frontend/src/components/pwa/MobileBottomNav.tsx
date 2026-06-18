"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Trophy, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null; // Don't show if not logged in

  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Compass, label: 'Explore', href: '/problems' },
    { icon: Trophy, label: 'Compete', href: '/contests' },
    { icon: User, label: 'Profile', href: `/profile/${user?.username}` },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && item.href !== '/' || pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
