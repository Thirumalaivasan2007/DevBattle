'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, TrendingUp, Clock, Plus, MessageSquare, ArrowUpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CommunityFeedPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: async () => {
      const res = await apiClient.get('/community/posts');
      return res.data;
    }
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Main Feed */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold flex items-center">
              <Users className="w-10 h-10 mr-4 text-primary" /> Community
            </h1>
            <Link href="/community/create">
              <Button><Plus className="w-4 h-4 mr-2" /> New Post</Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Button variant="secondary"><TrendingUp className="w-4 h-4 mr-2" /> Trending</Button>
            <Button variant="ghost"><Clock className="w-4 h-4 mr-2" /> Recent</Button>
            <Button variant="ghost"><ArrowUpCircle className="w-4 h-4 mr-2" /> Top</Button>
          </div>

          {/* Posts List */}
          {isLoading ? (
            <div className="text-center py-10">Loading discussions...</div>
          ) : (
            <div className="space-y-4">
              {posts?.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                  No posts yet. Be the first to start a discussion!
                </div>
              ) : (
                posts?.map((post: any) => (
                  <Link href={`/community/post/${post._id}`} key={post._id}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{post.title}</CardTitle>
                          <Badge variant="secondary">{post.postType}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>Posted by <span className="text-primary font-medium">{post.author.username}</span></span>
                          <Badge variant="outline" className="text-xs">{post.author.reputationLevel}</Badge>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-2">
                          {post.content.replace(/[#*_>]/g, '') /* Simple markdown strip for preview */}
                        </p>
                      </CardContent>
                      <CardFooter className="flex gap-4 text-sm text-muted-foreground pt-0">
                        <div className="flex items-center gap-1"><ArrowUpCircle className="w-4 h-4"/> {post.upvotes}</div>
                        <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4"/> Discuss</div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Welcome to DevBattle Community</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A place to share knowledge, discuss complex problems, and level up your skills together. 
              Earn reputation by helping others!
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
