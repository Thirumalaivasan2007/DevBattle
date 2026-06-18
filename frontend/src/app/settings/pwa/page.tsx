import React from 'react';
import PushNotificationManager from '@/components/pwa/PushNotificationManager';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Smartphone, HardDrive, DownloadCloud } from 'lucide-react';

export default function PWASettingsPage() {
  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">App Settings</h1>
        <p className="text-muted-foreground">Manage your offline experience and mobile features.</p>
      </div>

      <div className="grid gap-6">
        <PushNotificationManager />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Offline Storage
            </CardTitle>
            <CardDescription>
              DevBattle stores data on your device to make it run faster and work offline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>When offline, you can still:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>View recently opened coding problems</li>
                <li>Write code (submissions will be queued)</li>
                <li>Browse your profile and past submissions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DownloadCloud className="w-5 h-5" />
              Background Sync
            </CardTitle>
            <CardDescription>
              Any actions performed while offline will be automatically synced when your connection is restored.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Background Sync is handled automatically by the DevBattle Service Worker. Ensure your browser is allowed to run in the background for the best experience.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
