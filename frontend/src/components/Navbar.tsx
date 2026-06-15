'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Code2, LogOut, Menu, User } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">DevBattle</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            {!isAuthenticated && <Link href="/" className="hover:text-foreground transition-colors">Home</Link>}
            <Link href="/problems" className="hover:text-foreground transition-colors">Problems</Link>
            <Link href="/users" className="hover:text-foreground transition-colors">Developers</Link>
            <Link href="/contests" className="hover:text-foreground transition-colors">Contests</Link>
            <Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
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
              <div className="flex items-center gap-4">
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
