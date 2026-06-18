'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProblemId = searchParams.get('problemId');
  const initialPostType = searchParams.get('postType');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState(initialPostType || 'GENERAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return toast.error('Title and content are required');

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/community/posts', {
        title,
        content,
        postType,
        problemId: initialProblemId
      });
      toast.success('Post published!');
      router.push(`/community/post/${res.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create post');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8">Create a Post</h1>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Post Type</label>
                <Select value={postType} onValueChange={setPostType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General Discussion</SelectItem>
                    <SelectItem value="QUESTION">Question</SelectItem>
                    <SelectItem value="SOLUTION">Solution / Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  placeholder="What's on your mind?" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content (Markdown supported)</label>
                <Textarea 
                  placeholder="Share your thoughts, code snippets, or questions..." 
                  className="min-h-[300px] font-mono text-sm"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>Publish Post</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
