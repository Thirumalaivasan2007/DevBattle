"use client";

import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function NetworkStatus() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const updateConnectionStatus = () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          setIsSlow(true);
        } else {
          setIsSlow(false);
        }
      };

      connection.addEventListener('change', updateConnectionStatus);
      updateConnectionStatus();

      return () => {
        connection.removeEventListener('change', updateConnectionStatus);
      };
    }
  }, []);

  if (!isSlow) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-2">
      <div className="bg-yellow-500/90 text-black text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
        <AlertTriangle className="w-3.5 h-3.5" />
        Slow Network Detected
      </div>
    </div>
  );
}
