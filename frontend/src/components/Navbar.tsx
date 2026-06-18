'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Code2, LogOut, Menu, User, Trophy, Swords, Activity, MessageSquare, Flame, Map, Users, Building2, ChevronDown } from 'lucide-react';
import NotificationDropdown from './notifications/NotificationDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">DevBattle</span>
          </Link>
          <div className="hidden md:flex space-x-1 items-center">
            <Link href="/problems" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/problems') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted hover:text-foreground'}`}>
              <Code2 className="w-4 h-4 inline mr-2 mb-1" />
              Problems
            </Link>
            <Link href="/daily" className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${isActive('/daily') ? 'bg-orange-500/10 text-orange-500' : 'text-orange-500/80 hover:bg-orange-500/10 hover:text-orange-500'}`}>
              <Flame className="w-4 h-4 inline mr-2 mb-1" />
              Daily
            </Link>
            <Link href="/roadmaps" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/roadmaps') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted hover:text-foreground'}`}>
              <Map className="w-4 h-4 inline mr-2 mb-1" />
              Roadmaps
            </Link>
            <Link href="/contests" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/contests') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted hover:text-foreground'}`}>
              <Trophy className="w-4 h-4 inline mr-2 mb-1" />
              Contests
            </Link>
            <Link href="/battles" className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${isActive('/battles') ? 'bg-red-500/20 text-red-500' : 'text-red-500/80 hover:bg-red-500/10 hover:text-red-500'}`}>
              <Swords className="w-4 h-4 inline mr-2 mb-1" />
              Battles
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center outline-none ${isActive('/community') || isActive('/teams') || isActive('/organizations') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted hover:text-foreground'}`}>
                  <Users className="w-4 h-4 mr-2 mb-1 inline" />
                  Social
                  <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                </button>
              } />
              <DropdownMenuContent align="start" className="w-48 bg-background border-border">
                <DropdownMenuItem render={
                  <Link href="/community" className="cursor-pointer flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Community Forums
                  </Link>
                } />
                <DropdownMenuSeparator />
                <DropdownMenuItem render={
                  <Link href="/teams" className="cursor-pointer flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    Teams Ecosystem
                  </Link>
                } />
                <DropdownMenuItem render={
                  <Link href="/organizations" className="cursor-pointer flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-purple-500" />
                    Organizations
                  </Link>
                } />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
                Dashboard
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors hidden sm:block">
                  Admin Panel
                </Link>
              )}
              
              <div className="hidden lg:flex items-center gap-3 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                <div className="flex items-center gap-1.5 text-sm font-medium text-amber-500">
                  <div className="bg-amber-500/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </div>
                  {user?.coins || 0}
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
                  <div className="bg-primary/20 p-1 rounded-full text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  Lv. {user?.level || 1}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <NotificationDropdown />
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={logout} className="hidden sm:flex">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
