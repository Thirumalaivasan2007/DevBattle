'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CommunityTabContent({ problemId, postType }: { problemId: string, postType: string }) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['communityPosts', problemId, postType],
    queryFn: async () => {
      const res = await apiClient.get(`/community/posts?problemId=${problemId}&postType=${postType}`);
      return res.data;
    }
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">
          {postType === 'SOLUTION' ? 'Community Solutions' : 'Discussions'}
        </h3>
        <Link href={`/community/create?problemId=${problemId}&postType=${postType}`}>
          <Button size="sm"><Plus className="w-4 h-4 mr-2" /> New {postType === 'SOLUTION' ? 'Solution' : 'Discussion'}</Button>
        </Link>
      </div>

      {posts?.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
          No {postType.toLowerCase()}s found. Be the first to post!
        </div>
      ) : (
        posts?.map((post: any) => (
          <Link href={`/community/post/${post._id}`} key={post._id}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer mb-4">
              <CardHeader className="py-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{post.title}</CardTitle>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <img src={post.author.avatar || '/default-avatar.png'} className="w-4 h-4 rounded-full" />
                  <span><span className="font-medium text-foreground">{post.author.username}</span></span>
                  <Badge variant="outline" className="text-[10px] h-4">{post.author.reputationLevel}</Badge>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardFooter className="py-2 flex gap-4 text-xs text-muted-foreground bg-muted/20">
                <div className="flex items-center gap-1"><ArrowUpCircle className="w-4 h-4"/> {post.upvotes}</div>
                <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4"/> Discuss</div>
              </CardFooter>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
