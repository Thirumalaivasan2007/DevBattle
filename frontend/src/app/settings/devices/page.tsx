"use client";

import React, { useEffect, useState } from 'react';
import { DeviceCard } from '@/components/pwa/DeviceCard';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from /api/devices
    // Mocking for now to show the UI
    const mockDevices = [
      {
        id: '1',
        type: 'desktop' as const,
        name: 'Windows PC (Chrome)',
        lastActive: 'Just now',
        isCurrent: true
      },
      {
        id: '2',
        type: 'mobile' as const,
        name: 'iPhone 13 (Safari)',
        lastActive: '2 days ago',
        isCurrent: false
      }
    ];
    setDevices(mockDevices);
  }, []);

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Connected Devices</h1>
        <p className="text-muted-foreground">Manage devices where you are logged in and receiving push notifications.</p>
      </div>

      <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-primary">Secure by Default</p>
          <p className="text-muted-foreground">If you see a device you don't recognize, you can revoke its access here. This will sign the device out and disable push notifications.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {devices.map(device => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>

      <div className="pt-4 border-t border-border">
        <Button variant="destructive">Sign Out of All Other Devices</Button>
      </div>
    </div>
  );
}
