import React from 'react';
import { WifiOff, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <WifiOff className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold mb-2">You are offline</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        It looks like you've lost your internet connection. Some parts of DevBattle are available offline, but this page requires a connection.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Link>
        </Button>
        <Button asChild variant="outline" onClick={() => window.history.back()}>
          <button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </Button>
      </div>
    </div>
  );
}
