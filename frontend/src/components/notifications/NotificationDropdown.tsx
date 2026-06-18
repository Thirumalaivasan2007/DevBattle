import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Bell, Check, CheckCheck, Inbox } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const router = useRouter();

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      router.push(link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 shadow-2xl border-border/20 bg-background/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-bold text-lg m-0">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-muted-foreground hover:text-primary" onClick={markAllAsRead}>
              <CheckCheck className="w-3 h-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-border/20" />
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center text-muted-foreground">
              <Inbox className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm">You have no notifications.</p>
            </div>
          ) : (
            notifications.slice(0, 5).map((notif) => (
              <DropdownMenuItem 
                key={notif._id} 
                className={`flex flex-col items-start p-3 cursor-pointer border-b border-border/5 last:border-0 ${!notif.isRead ? 'bg-primary/5' : ''}`}
                onClick={() => handleNotificationClick(notif._id, notif.link)}
              >
                <div className="flex justify-between w-full mb-1">
                  <span className={`font-semibold text-sm ${!notif.isRead ? 'text-primary' : ''}`}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notif.message}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="bg-border/20" />
        <div className="p-2">
          <Button 
            variant="ghost" 
            className="w-full text-sm h-8"
            onClick={() => router.push('/notifications')}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
