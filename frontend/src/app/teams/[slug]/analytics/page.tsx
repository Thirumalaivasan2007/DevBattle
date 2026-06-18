"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, BarChart, Activity } from 'lucide-react';
import { useTeam } from '../TeamContext';

export default function TeamAnalyticsPage() {
  const { team } = useTeam();
  if (!team) return null;

  return (
    <div className="space-y-6">
      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Performance Analytics
          </CardTitle>
          <CardDescription>Track your team's growth over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            <div className="flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-xl p-8 border border-dashed border-border/50">
              <LineChart className="h-10 w-10 mb-4 opacity-30" />
              <p>Rating History</p>
              <p className="text-xs mt-2">Not enough data to generate chart</p>
            </div>
            
            <div className="flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-xl p-8 border border-dashed border-border/50">
              <BarChart className="h-10 w-10 mb-4 opacity-30" />
              <p>XP Contributions</p>
              <p className="text-xs mt-2">Not enough data to generate chart</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
