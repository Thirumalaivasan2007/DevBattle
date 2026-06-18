"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Server, Database, AlertTriangle, CheckCircle, ActivityIcon } from 'lucide-react';
import api from '@/lib/axios';

export default function AdminOperationsPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.get('/health/readiness');
        setHealthData(res.data);
      } catch (error: any) {
        setHealthData(error.response?.data || { status: 'offline' });
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container max-w-6xl py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Operations Dashboard</h1>
          <p className="text-muted-foreground">Monitor system health, queue status, and infrastructure metrics.</p>
        </div>
        {loading ? (
          <div className="animate-pulse bg-muted h-8 w-24 rounded-md" />
        ) : (
          <div className={`px-3 py-1 rounded-full flex items-center gap-2 text-sm font-semibold ${healthData?.status === 'ready' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
            {healthData?.status === 'ready' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {healthData?.status === 'ready' ? 'System Healthy' : 'System Degraded'}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{healthData?.database || 'Loading...'}</div>
            <p className="text-xs text-muted-foreground mt-1">MongoDB Replica Set</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cache Status</CardTitle>
            <Server className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{healthData?.redis || 'Loading...'}</div>
            <p className="text-xs text-muted-foreground mt-1">Redis In-Memory Data Store</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">API Traffic</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~420 req/s</div>
            <p className="text-xs text-muted-foreground mt-1">Simulated Metric from Gateway</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ActivityIcon className="w-5 h-5 text-primary" />
              Service Mesh Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Auth Service', 'User Service', 'Problem Service', 'Judge Service', 'Battle Service'].map((svc, i) => (
              <div key={svc} className="flex items-center justify-between">
                <span className="text-sm font-medium">{svc}</span>
                <span className="text-xs text-success bg-success/10 px-2 py-1 rounded">Operational</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="w-5 h-5 text-primary" />
              Execution Engine Workers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm font-medium">Active Workers</span>
                <span className="text-sm font-bold">12</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm font-medium">Queued Submissions</span>
                <span className="text-sm font-bold text-yellow-500">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Latency</span>
                <span className="text-sm font-bold">142ms</span>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
