'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Trophy, Star } from 'lucide-react';
import { searchUsers } from '@/services/userService';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UsersPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await searchUsers(debouncedQuery, 1, 50);
        setUsers(data.users);
      } catch (error) {
        console.error('Failed to search users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">DevBattle Developers</h1>
            <p className="text-muted-foreground mt-1">Search and view developer profiles</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username or name..."
              className="pl-9 bg-card"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-lg border border-dashed border-border">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No developers found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Link key={user._id} href={`/users/${user.username}`}>
                <Card className="bg-card/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer h-full border-border/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{user.fullName}</h3>
                        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center text-xs font-medium text-yellow-500">
                            <Trophy className="h-3 w-3 mr-1" />
                            {user.rating}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            {user.rank}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
