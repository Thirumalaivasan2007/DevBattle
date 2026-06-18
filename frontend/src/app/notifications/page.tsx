"use client";

import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCheck, Inbox, Bell, Swords, Code2, Trophy, AtSign, Settings, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'battles') return n.type === 'BATTLE';
    if (activeTab === 'mentions') return n.type === 'MENTION';
    return true; // 'all'
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'BATTLE': return <Swords className="w-5 h-5 text-red-500" />;
      case 'CONTEST': return <Code2 className="w-5 h-5 text-purple-500" />;
      case 'ACHIEVEMENT': return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'MENTION': return <AtSign className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Notification Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Stay updated on your battles, mentions, and achievements.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
          <Link href="/settings/notifications">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid grid-cols-4 w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="battles">Battles</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Inbox className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-semibold mb-2">No Notifications Found</h3>
                <p>You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notif) => (
              <Card 
                key={notif._id} 
                className={`transition-colors border-border/40 ${!notif.isRead ? 'bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.05)]' : 'bg-card'}`}
              >
                <div className="flex items-start p-5 gap-4">
                  <div className="bg-background rounded-full p-2 border border-border/50">
                    {getIconForType(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-base ${!notif.isRead ? 'font-bold text-foreground' : 'font-semibold text-foreground/80'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notif.message}
                    </p>
                    {notif.link && (
                      <Link href={notif.link}>
                        <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                          View details &rarr;
                        </Button>
                      </Link>
                    )}
                  </div>
                  {!notif.isRead && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-primary rounded-full"
                      onClick={() => markAsRead(notif._id)}
                      title="Mark as read"
                    >
                      <XCircle className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
