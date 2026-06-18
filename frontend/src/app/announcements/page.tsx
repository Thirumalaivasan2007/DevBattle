"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Wrench, Zap, Star } from 'lucide-react';
import apiClient from '@/lib/axios';
import { formatDistanceToNow } from 'date-fns';

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: 'UPDATE' | 'MAINTENANCE' | 'EVENT' | 'FEATURE';
  link?: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await apiClient.get('/announcements');
        setAnnouncements(res.data);
      } catch (err) {
        console.error('Failed to load announcements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'MAINTENANCE': return <Wrench className="w-6 h-6 text-orange-500" />;
      case 'FEATURE': return <Star className="w-6 h-6 text-amber-500" />;
      case 'EVENT': return <Zap className="w-6 h-6 text-purple-500" />;
      default: return <Megaphone className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Megaphone className="w-10 h-10 text-primary" />
          Announcements
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Latest updates, features, and events from the DevBattle team.
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p className="text-muted-foreground">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-muted-foreground">No active announcements at this time.</p>
        ) : (
          announcements.map((ann) => (
            <Card key={ann._id} className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="bg-background p-3 rounded-xl border border-border/50">
                  {getIcon(ann.type)}
                </div>
                <div>
                  <CardTitle className="text-xl">{ann.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(ann.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-4 border-t border-border/10">
                <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {ann.message}
                </p>
                {ann.link && (
                  <a 
                    href={ann.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block mt-4 text-primary hover:underline font-medium"
                  >
                    Read more &rarr;
                  </a>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
