'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, ArrowDownCircle, MessageSquare, CornerDownRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await apiClient.get(`/community/posts/${id}`);
      return res.data;
    }
  });

  const voteMutation = useMutation({
    mutationFn: async ({ targetId, targetModel, voteType }: any) => {
      await apiClient.post('/community/vote', { targetId, targetModel, voteType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    }
  });

  const commentMutation = useMutation({
    mutationFn: async ({ content, parentCommentId }: any) => {
      await apiClient.post('/community/comments', { postId: id, content, parentCommentId });
    },
    onSuccess: () => {
      setReplyContent('');
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast.success('Comment posted!');
    }
  });

  if (isLoading || !data) return <div className="text-center pt-24">Loading post...</div>;

  const { post, comments } = data;

  const handleVote = (targetId: string, targetModel: string, voteType: number) => {
    if (!user) return toast.error('You must be logged in to vote');
    voteMutation.mutate({ targetId, targetModel, voteType });
  };

  const handleComment = () => {
    if (!user) return toast.error('You must be logged in to comment');
    if (!replyContent) return;
    commentMutation.mutate({ content: replyContent, parentCommentId: replyingTo });
  };

  // Helper to render nested comments
  const renderComments = (parentId: string | null = null, depth = 0) => {
    const thread = comments.filter((c: any) => 
      parentId ? c.parentCommentId === parentId : !c.parentCommentId
    );

    return thread.map((comment: any) => (
      <div key={comment._id} className={`mb-4 ${depth > 0 ? 'ml-8 border-l-2 border-border/50 pl-4' : ''}`}>
        <Card className="bg-card/40">
          <CardHeader className="py-3 flex flex-row items-center gap-3">
            <img src={comment.author.avatar || '/default-avatar.png'} className="w-8 h-8 rounded-full" />
            <div>
              <div className="font-bold text-sm">{comment.author.username} <Badge variant="outline" className="text-[10px] ml-2">{comment.author.reputationLevel}</Badge></div>
              <div className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</div>
            </div>
          </CardHeader>
          <CardContent className="py-2 text-sm prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.content}</ReactMarkdown>
          </CardContent>
          <CardFooter className="py-2 flex gap-4 text-xs text-muted-foreground">
            <button onClick={() => handleVote(comment._id, 'Comment', 1)} className="hover:text-green-500 flex items-center gap-1"><ArrowUpCircle className="w-4 h-4"/> {comment.upvotes}</button>
            <button onClick={() => handleVote(comment._id, 'Comment', -1)} className="hover:text-red-500 flex items-center gap-1"><ArrowDownCircle className="w-4 h-4"/> {comment.downvotes}</button>
            <button onClick={() => setReplyingTo(comment._id)} className="hover:text-primary flex items-center gap-1"><MessageSquare className="w-4 h-4"/> Reply</button>
          </CardFooter>
        </Card>

        {replyingTo === comment._id && (
          <div className="mt-4 mb-4 flex gap-2">
            <Textarea 
              className="min-h-[80px]" 
              placeholder={`Replying to ${comment.author.username}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <Button onClick={handleComment} disabled={commentMutation.isPending}>Reply</Button>
              <Button variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Recursive call for nested replies */}
        <div className="mt-4">
          {renderComments(comment._id, depth + 1)}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Main Post */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-extrabold">{post.title}</h1>
              <Badge variant="secondary">{post.postType}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <img src={post.author.avatar || '/default-avatar.png'} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-bold">{post.author.username} <Badge variant="outline" className="ml-2">{post.author.reputationLevel}</Badge></div>
                <div className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleString()} • {post.views} Views</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </CardContent>
          <CardFooter className="flex gap-6 pt-4 border-t border-border/50">
            <button onClick={() => handleVote(post._id, 'Post', 1)} className="flex items-center gap-2 hover:text-green-500 font-bold transition-colors">
              <ArrowUpCircle className="w-6 h-6" /> {post.upvotes}
            </button>
            <button onClick={() => handleVote(post._id, 'Post', -1)} className="flex items-center gap-2 hover:text-red-500 font-bold transition-colors">
              <ArrowDownCircle className="w-6 h-6" /> {post.downvotes}
            </button>
          </CardFooter>
        </Card>

        {/* Top-level Reply Box */}
        {!replyingTo && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Add a Comment</h3>
            <Textarea 
              className="min-h-[100px] mb-4" 
              placeholder="What are your thoughts?"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button onClick={handleComment} disabled={commentMutation.isPending}>Post Comment</Button>
          </div>
        )}

        {/* Comments Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-6 border-b border-border/50 pb-2">{comments.length} Comments</h3>
          {renderComments()}
        </div>

      </div>
    </div>
  );
}
