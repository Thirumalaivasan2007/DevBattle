import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Monitor, Tablet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeviceProps {
  id: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  name: string;
  lastActive: string;
  isCurrent?: boolean;
}

export function DeviceCard({ device }: { device: DeviceProps }) {
  const Icon = device.type === 'desktop' ? Monitor : device.type === 'mobile' ? Smartphone : Tablet;

  return (
    <Card className={`relative overflow-hidden ${device.isCurrent ? 'border-primary/50' : 'border-border'}`}>
      {device.isCurrent && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded-bl-md">
          Current Device
        </div>
      )}
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">{device.name}</h4>
            <p className="text-xs text-muted-foreground">Last active: {device.lastActive}</p>
          </div>
        </div>
        {!device.isCurrent && (
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
