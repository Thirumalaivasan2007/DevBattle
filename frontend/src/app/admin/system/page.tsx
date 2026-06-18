"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Server, Database, Cpu, HardDrive, Network, GitPullRequestDraft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function AdminSystemPage() {
  // Mock data representing Phase 15 Infrastructure metrics
  const systemMetrics = {
    cpu: 45,
    memory: 62,
    storage: 28,
    activeWorkers: 4,
    queueSize: 12,
    apiLatency: '45ms',
    errorRate: '0.02%',
    uptime: '14d 6h 32m',
    services: [
      { name: 'API Gateway', status: 'Healthy', ping: '12ms' },
      { name: 'Auth Service', status: 'Healthy', ping: '18ms' },
      { name: 'User Service', status: 'Healthy', ping: '15ms' },
      { name: 'Judge Engine', status: 'Under Load', ping: '85ms' },
      { name: 'Redis Cache', status: 'Healthy', ping: '2ms' },
      { name: 'MongoDB Main', status: 'Healthy', ping: '24ms' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health & Infrastructure</h1>
          <p className="text-muted-foreground">Monitor Kubernetes clusters, Judge queues, and Redis instances.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global API Latency</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.apiLatency}</div>
            <p className="text-xs text-muted-foreground mt-1">p95 response time</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate (5xx)</CardTitle>
            <Server className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.errorRate}</div>
            <p className="text-xs text-muted-foreground mt-1">Past 24 hours</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Judge Queue Size</CardTitle>
            <GitPullRequestDraft className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.queueSize}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending code executions</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.uptime}</div>
            <p className="text-xs text-muted-foreground mt-1">Since last rolling update</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4 border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Microservice Status</CardTitle>
            <CardDescription>Real-time health checks from Kubernetes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.services.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${service.status === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{service.ping}</span>
                    <span className={service.status === 'Healthy' ? 'text-green-500' : 'text-yellow-500'}>{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Hardware Utilization</CardTitle>
            <CardDescription>Aggregated metrics from worker nodes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span>CPU Usage</span>
                </div>
                <span>{systemMetrics.cpu}%</span>
              </div>
              <Progress value={systemMetrics.cpu} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span>Memory Usage</span>
                </div>
                <span>{systemMetrics.memory}%</span>
              </div>
              <Progress value={systemMetrics.memory} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span>Storage</span>
                </div>
                <span>{systemMetrics.storage}%</span>
              </div>
              <Progress value={systemMetrics.storage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
