"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileCode2, Trophy, Swords, Send, Activity, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error: any) {
        toast.error("Failed to fetch stats", {
          description: error.response?.data?.message || "Internal server error"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { title: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'text-green-500' },
    { title: 'Problems', value: stats.totalProblems, icon: FileCode2, color: 'text-orange-500' },
    { title: 'Submissions', value: stats.totalSubmissions, icon: Send, color: 'text-purple-500' },
    { title: 'Contests', value: stats.totalContests, icon: Trophy, color: 'text-yellow-500' },
    { title: 'Battles', value: stats.totalBattles, icon: Swords, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">High-level metrics for the DevBattle platform.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Placeholder for charts in future */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4 border-border/40">
          <CardHeader>
            <CardTitle>User Growth & Submissions</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-border/20 bg-muted/5">
            <p className="text-muted-foreground italic">Chart visualization will be powered by Analytics Service</p>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-border/40">
          <CardHeader>
            <CardTitle>Judge Queue Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Queue Size</span>
                <span className="font-bold">{stats.systemHealth?.queueSize || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Workers</span>
                <span className="font-bold text-green-500">{stats.systemHealth?.activeWorkers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Status</span>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full font-bold">
                  {stats.systemHealth?.status || 'Online'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
